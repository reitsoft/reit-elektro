import * as fs from 'fs';
import { prisma } from '$lib/server/prisma';
import PdfPrinter from 'pdfmake';
import blobStream from 'blob-stream';
import { EUR } from '$lib';

const today = new Date();
const formatter = new Intl.DateTimeFormat('de-DE', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	separator: '.' // Use '.' as the separator
});
const formattedDate = formatter.format(today);

// ###### PDF ######
const fonts = {
	DINPro: {
		bold: `static/fonts/DINPro-Black.ttf`,
		medium: `static/fonts/DINPro-Medium.ttf`,
		normal: `static/fonts/DINPro-Regular.ttf`,
		light: `static/fonts/DINPro-Light.ttf`
	}
};

const printer = new PdfPrinter(fonts);

export async function generateQuotation(quotationId) {
	const projectId = Number(quotationId);

	const getProject = async (id) => {
		const result = await prisma.project.findUnique({
			where: {
				id
			},
			include: {
				Status: true,
				Customer: true
			}
		});
		return result;
	};

	const getArticles = async () => {
		const result = await prisma.article.findMany({
			where: { deleted: false },
			include: {
				Unit: true,
				Category: true,
				Manufacturer: true
			}
		});

		const articlesNoImage = result.map((article) => {
			let { image: _, ...rest } = article;
			return rest;
		});
		return articlesNoImage;
	};

	const getProjectArticles = async (id) => {
		const result = await prisma.projectArticles.findMany({
			where: {
				projectId: id
			}
		});
		return result;
	};

	const project = await getProject(projectId);
	const articles = await getArticles();
	const projectArticles = await getProjectArticles(projectId);

	const pArticles = projectArticles.map((p) => {
		const foundedArticle = articles.find((a) => a.id === p.articleId);
		return { ...p, ...foundedArticle, id: p.id };
	});
	// console.log(pArticles)

	const totalPriceNetto = projectArticles.reduce((a, b) => a + b.projectPrice * b.amount, 0);
	const mwst = totalPriceNetto * 0.19;
	const totalPriceBrutto = totalPriceNetto + mwst;
	let pos = 0;

	function buildArticleTableBody(data, header) {
		let body = [];
		body.push(header);

		data.forEach((article) => {
			let dataRow = [];
			dataRow.push({
				text: pos + 1,
				fontSize: 9,
				alignment: 'right',
				color: '#202020',
				margin: [4, 1, 5, 1]
			});
			dataRow.push({
				text: article.Manufacturer.name,
				fontSize: 9,
				alignment: 'left',
				color: '#202020',
				margin: [1, 1, 5, 1]
			});
			dataRow.push({
				text: article.description,
				fontSize: 9,
				alignment: 'left',
				color: '#202020',
				margin: [1, 1, 5, 1]
			});
			dataRow.push({
				text: article.amount,
				fontSize: 9,
				alignment: 'center',
				color: '#202020',
				margin: [2, 1, 2, 1]
			});
			dataRow.push({
				text: article.projectPrice.toFixed(2).toString().replace('.', ','),
				fontSize: 9,
				alignment: 'right',
				color: '#202020',
				margin: [2, 1, 2, 1]
			});
			dataRow.push({
				text: (article.amount * article.projectPrice).toFixed(2).toString().replace('.', ','),
				fontSize: 9,
				alignment: 'right',
				color: '#202020',
				margin: [2, 1, 4, 1]
			});
			body.push(dataRow);
			pos++;
		});
		// console.log(body)
		return body;
	}

	function table(data, columns) {
		return {
			layout: {
				// hLineWidth: function (i, node) {
				// 	return (i === 0 || i === node.table.body.length) ? 2 : 1;
				// },
				// vLineWidth: function (i, node) {
				// 	return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				// }
        hLineWidth: function() {return 0.3},
        vLineWidth: function() {return 0.3}
      },
      pageBreak: 'before',
			table: {
        headerRows: 1,
				widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
				body: buildArticleTableBody(data, columns)
			}
		};
	}

	const file = {
		pageMargins: [52, 90, 30, 80],
		header: function (currentPage) {
        return {
          columns: [
            {
              width: '50%',
              image: 'static/images/logo_banner.png',
              width: (currentPage === 1 ? 230 : 130),
              margin: [52, 20, 0, 0]
            },
            {
              width: '*',
              alignment: 'right',
              margin: (currentPage === 1 ? [0, 25, 30, 0] : [0, 15, 30, 0] ),
              stack: [
                {
                  text: 'REIT ELEKTRIK UG (haftungsbeschränkt)',
                  fontSize: (currentPage === 1 ? 8 : 7 ),
                  color: '#101010',
                  margin: [0, 10, 0, 0]
                },
                {
                  text: 'Ernst-Lehmann-Str. 18',
                  fontSize: (currentPage === 1 ? 8 : 7 ),
                  color: '#101010',
                  margin: [0, 1, 0, 0]
                },
                { 
                  text: '88074 Meckenbeuren', 
                  fontSize: (currentPage === 1 ? 8 : 7 ), 
                  color: '#101010', 
                  margin: [0, 1, 0, 0]
                },
                {
                  text: 'info@reit-elektrik.de',
                  fontSize: (currentPage === 1 ? 8 : 7 ),
                  color: '#101010',
                  margin: [0, 1, 0, 0]
                },
                { 
                  text: '0151 - 123 123 123', 
                  fontSize: (currentPage === 1 ? 8 : 7 ), 
                  color: '#101010', 
                  margin: [0, 1, 0, 0] 
                }
              ]
            }
          ]
        }
		},
		content: [
			{
				text: 'REIT ELEKTRIK UG • Ernst-Lehmann-Str. 18 • 88074 Meckenbeuren',
				fontSize: 8,
				color: '#888888',
				margin: [0, 30, 0, 0]
			},
			{
				text: project.Customer.company,
				fontSize: 11,
				color: '#666666',
				bold: true,
				margin: [0, 8, 0, 0]
			},
			{ text: project.Customer.name, fontSize: 11, color: '#202020', margin: [0, 2, 0, 0] },
			{ text: project.Customer.address, fontSize: 11, color: '#202020', margin: [0, 2, 0, 0] },
			{ text: project.Customer.city, fontSize: 11, color: '#202020', margin: [0, 2, 0, 50] },
			{
				layout: 'noBorders',
				table: {
					widths: ['auto', '*', 45, 'auto'],

					body: [
						[
							{ text: 'Projekt:', fontSize: 10, fillColor: '#F0F0F0', margin: [30, 5, 2, 2] },
							{
								text: project.name,
								fontSize: 10,
								bold: true,
								color: '#888888',
								fillColor: '#F0F0F0',
								margin: [0, 5, 100, 2]
							},
							{
								text: 'Datum:',
								fontSize: 10,
								fillColor: '#F0F0F0',
								alignment: 'right',
								margin: [0, 5, 0, 2]
							},
							{
								text: formattedDate,
								fontSize: 10,
								fillColor: '#F0F0F0',
								alignment: 'right',
								margin: [0, 5, 30, 2]
							}
						],
						[
							{ text: 'Angebot:', fontSize: 10, fillColor: '#F0F0F0', margin: [30, 2, 2, 5] },
							{
								text: project.ident,
								fontSize: 10,
								bold: true,
								color: '#888888',
								fillColor: '#F0F0F0',
								margin: [0, 2, 100, 5]
							},
							{ text: '', fillColor: '#F0F0F0' },
							{ text: '', fillColor: '#F0F0F0' }
						]
					]
				}
			},
			{
				text: 'Sehr geehrte Damen und Herren,',
				fontSize: 11,
				color: '#202020',
				margin: [0, 30, 0, 10]
			},
			{
				text: 'vielen Dank für Ihre Anfrage und das damit verbundene Interesse an einer Zusammenarbeit.',
				fontSize: 11,
				color: '#202020',
				margin: [0, 0, 0, 0]
			},
			{
				text: 'Gerne sende ich Ihnen folgendes Angebot:',
				fontSize: 11,
				color: '#202020',
				margin: [0, 0, 0, 15]
			},
      {
        // to treat a paragraph as a bulleted list, set an array of items under the ul key
        ul: [
          { text: 'Verlegung neuer Stromleitungen' },
          { text: 'Item 2' },
          { text: 'Item 3' },
          { text: 'Item 4' },
          { text: 'Item 2' },
          { text: 'Item 3' },
          { text: 'Item 4' },
        ]
      },
      {
				text: 'Gerne können Sie mir die Annahme des Angebotes per E-Mail bestätigen.',
				fontSize: 11,
				color: '#202020',
				margin: [0, 20, 0, 0]
			},
			{
				text: 'Für Rückfragen stehe ich Ihnen jederzeit zur Verfügung.',
				fontSize: 11,
				color: '#202020',
				margin: [0, 0, 0, 0]
			},
			{ text: 'Mit freundlichen Grüßen,', fontSize: 11, color: '#202020', margin: [0, 10, 0, 0] },
			{ text: 'Alexander Reit', fontSize: 11, color: '#202020', margin: [0, 5, 0, 0] },
			table(pArticles, [
				{
					text: 'Pos.',
					fontSize: 9,
					alignment: 'right',
					color: '#202020',
					fillColor: '#F0F0F0',
					margin: [4, 1, 1, 1]
				},
				{
					text: 'Hersteller',
					fontSize: 9,
					alignment: 'left',
					color: '#202020',
					fillColor: '#F0F0F0',
					margin: [1, 1, 5, 1]
				},
				{
					text: 'Artikel',
					fontSize: 9,
					alignment: 'left',
					color: '#202020',
					fillColor: '#F0F0F0',
					margin: [1, 1, 5, 1]
				},
				{
					text: 'Anzahl',
					fontSize: 9,
					alignment: 'center',
					color: '#202020',
					fillColor: '#F0F0F0',
					margin: [1, 1, 1, 1]
				},
				{
					text: 'Einzelpreis (EUR)',
					fontSize: 9,
					alignment: 'right',
					color: '#202020',
					fillColor: '#F0F0F0',
					margin: [1, 1, 1, 1]
				},
				{
					text: 'Gesamt (EUR)',
					fontSize: 9,
					alignment: 'right',
					color: '#202020',
					fillColor: '#F0F0F0',
					margin: [1, 1, 4, 1]
				}
			]),
			// {
			// 	canvas: [
			// 		{
			// 			type: 'line',
			// 			x1: 350,
			// 			y1: 5,
			// 			x2: 525,
			// 			y2: 5,
			// 			lineWidth: 0.5,
			// 			lineColor: '#999999'
			// 		}
			// 	]
			// },
			{
				layout: 'noBorders',
				table: {
					widths: ['*', 'auto'],

					body: [
						[
							{
								text: 'Nettopreis:',
								fontSize: 10,
								color: '#888888',
								alignment: 'right',
								bold: true,
								margin: [0, 1, 20, 0]
							},
							{
								text: totalPriceNetto.toFixed(2).toString().replace('.', ','),
								fontSize: 10,
								color: '#888888',
								alignment: 'right',
								bold: true,
								margin: [0, 1, 2, 0]
							}
						],
						[
							{ text: 'Zzgl. 19% USt.:', fontSize: 10, alignment: 'right', margin: [0, 1, 20, 0] },
							{
								text: mwst.toFixed(2).toString().replace('.', ','),
								fontSize: 10,
                color: '#888888',
								alignment: 'right',
								margin: [0, 1, 2, 0]
							}
						],
						[
							{
								text: 'Angebotspreis:',
								fontSize: 12,
								color: '#888888',
								alignment: 'right',
								bold: true,
								margin: [0, 2, 20, 0]
							},
							{
								text: totalPriceBrutto.toFixed(2).toString().replace('.', ','),
								fontSize: 12,
								color: '#888888',
								alignment: 'right',
								bold: true,
								margin: [0, 2, 2, 0]
							}
						]
					]
				}
			}
		],
		// content END
		footer: function (currentPage, pageCount, pageSize) {
			return [
				{
					canvas: [
						{
							type: 'line',
							x1: 5,
							y1: 0,
							x2: 590,
							y2: 0,
							lineWidth: 0.5,
							lineColor: '#CCCCCC'
						}
					]
				},
				{
					columns: [
						{
							width: '40%',
							alignment: 'left',
							margin: [40, 0, 0, 0],
							stack: [
								{
									text: 'REIT ELEKTRIK UG (haftungsbeschränkt)',
									fontSize: 7,
									color: '#333333',
									margin: [0, 10, 0, 0]
								},
								{
									text: 'Ernst-Lehmann-Str. 18 • 88074 Meckenbeuren',
									fontSize: 7,
									color: '#333333',
									margin: [0, 3, 0, 0]
								},
								{
									text: 'info@reit-elektrik.de',
									fontSize: 7,
									color: '#333333',
									margin: [0, 3, 0, 0]
								},
								{ text: '0151 - 123 123 123', fontSize: 7, color: '#333333', margin: [0, 2, 0, 0] }
							]
						},
						{
							width: '30%',
							alignment: 'left',
							margin: [40, 0, 0, 0],
							stack: [
								{ text: 'Bank: DKB', fontSize: 7, color: '#333333', margin: [0, 10, 0, 0] },
								{
									text: 'IBAN: DE 3423 4562 3435 7862 ',
									fontSize: 7,
									color: '#333333',
									margin: [0, 3, 0, 0]
								},
								{ text: 'BIC: DKBDEFFXXX', fontSize: 7, color: '#333333', margin: [0, 3, 0, 0] },
								{
									text: 'Kto. Inh.: Alexander Reit',
									fontSize: 7,
									color: '#333333',
									margin: [0, 3, 0, 0]
								}
							]
						},
						{
							width: '30%',
							alignment: 'left',
							margin: [40, 0, 0, 0],
							stack: [
								{
									text: 'USt-ID: DE78453629',
									fontSize: 7,
									color: '#333333',
									alignment: 'right',
									margin: [0, 10, 30, 0]
								},
								{
									text: 'HRB: 1234567B ',
									fontSize: 7,
									color: '#333333',
									alignment: 'right',
									margin: [0, 3, 30, 0]
								},
								{
									text: 'Amtsgericht: Ulm',
									fontSize: 7,
									color: '#333333',
									alignment: 'right',
									margin: [0, 3, 30, 0]
								},
								{
									text: 'Geschäftsführer: Alexander Reit',
									fontSize: 7,
									color: '#333333',
									alignment: 'right',
									margin: [0, 3, 30, 0]
								}
							]
						}
					]
				},
				{
					text: 'Seite ' + currentPage.toString() + ' von ' + pageCount,
					fontSize: 8,
					color: '#333333',
					alignment: 'right',
					margin: [0, 5, 30, 12]
				}
			];
		},
		defaultStyle: {
			font: 'DINPro'
		}
	};

	return new Promise((resolve, reject) => {
		const pdf = printer.createPdfKitDocument(file);

		// pdf.pipe(fs.createWriteStream('pdfs/basics.pdf'));
		pdf
			.pipe(blobStream())
			.on('finish', function () {
				console.log('Finished generating PDF!');
				resolve(this.toBlob('application/pdf'));
			})
			.on('error', (err) => {
				console.error('err', err);
				reject(err);
			});
		pdf.end();
	});
}
