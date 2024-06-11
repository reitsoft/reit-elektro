import * as fs from 'fs';
import { prisma } from '$lib/server/prisma';
import PdfPrinter from 'pdfmake';
import blobStream from 'blob-stream';




// ###### PDF ######
const fonts = {
  DINPro: {
    bold: `static/fonts/DINPro-Black.ttf`,
    medium: `static/fonts/DINPro-Medium.ttf`,
    normal: `static/fonts/DINPro-Regular.ttf`,
    light: `static/fonts/DINPro-Light.ttf`
  }
}

const printer = new PdfPrinter(fonts);

async function blobToBase64(blob) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:${blob.type};base64,${buffer.toString('base64')}`;
}

export async function generateQuotation(quotationId) {

  const projectId = Number(quotationId)

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
  
  const articles = await getArticles();
  const projectArticles = await getProjectArticles(projectId)
  
  const pArticles = projectArticles.map(p => {
  const foundedArticle = articles.find(a => a.id === p.articleId)
  return {...p, ...foundedArticle, id: p.id}
  });

  const file = {
    content: ["Hello World!", JSON.stringify(pArticles)],
    defaultStyle: {
      font: "DINPro"
    }
  }

  return new Promise((resolve, reject) => {
    const pdf = printer.createPdfKitDocument(file)

    // pdf.pipe(fs.createWriteStream('pdfs/basics.pdf'));
    // pdf.end();
      pdf
        .pipe(blobStream())
        .on('finish', function() {
          console.log("Finished generating PDF!")
          resolve(this.toBlob('application/pdf'))
        })
        .on('error', (err) => {
    			console.error('err', err);
    			reject(err);
    		});
      pdf.end()
  })
}