import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import puppeteer from 'puppeteer';

export const GET = async () => {
	
	await scrapeAllArticles()
	return json({ status: 'scraping...' });
};

async function getArticles() {
	const articles = await prisma.article.findMany({});
	return articles;
}

async function safeUpdatedArticle(article) {
	const articleWithPrice = { ...article, price: parseFloat(article.price) };
	try {
		await prisma.article.update({
			where: {
				id: articleWithPrice.id
			},
			data: { ...articleWithPrice, error: false, updatedAt: new Date() }
		});
	} catch (error) {
		await prisma.article.update({
			where: {
				id
			},
			data: { ...articleWithPrice, error: true }
		});
	}
}

async function getImageBlob(page, imageUrl) {
	try {
		const response = await page.goto(imageUrl, { waitUntil: 'networkidle2' });
		const buffer = await response.buffer();
		return buffer.toString('base64');
	} catch (error) {
		console.error('Error while scraping image: ', error);
		return null;
	}
}

async function scrapeData(page, article) {
	const { id, url } = article;
	// console.log(url)
	await page.goto(url);
	const elementPrice = await page.waitForSelector('.current-price-container');
	const value = await elementPrice.evaluate((x) => x.textContent);
	const price = String(value)
		.replace(/(\r\n|\n|\r|\t)/gm, '')
		.replace(',', '.')
		.split(' ')[0];

	if (!article.name) {
		const elementName = await page.waitForSelector('.product-info-title-desktop');
		const name = await elementName.evaluate((x) => x.textContent);

		const imageUrlpart = await page.$$eval(
			'#product_image_swiper > div > div > div > a > img',
			(imgs) => imgs[0].getAttribute('src')
		);

		const imageUrl = new URL(article.url).origin + '/' + imageUrlpart;
		const image = await getImageBlob(page, imageUrl);
		return { id, price, name, url, imageUrl, image };
	} else {
		return { id, price, url };
	}
}

function wait(ms) {
	const start = Date.now();
	let now = start;
	while (now - start < ms) {
		now = Date.now();
	}
}

async function scrapeAllArticles() {
	const articles = await getArticles();
	articles.forEach(async (article) => {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		wait(500);
		const data = await scrapeData(page, article);
		wait(500);
		await browser.close();
		const updatedArticle = { ...article, ...data };

		await safeUpdatedArticle(updatedArticle);
		return updatedArticle;
	});
}
