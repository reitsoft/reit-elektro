import { generateQuotation } from '$lib/server/pdf/generateQuotation.js'

export async function GET({ url, params, setHeaders }) {
  const id = params.id

  const pdf = await generateQuotation(id)

  setHeaders({
    'Content-Type': 'application/pdf',
    'Content-Length': pdf.size?.toString(),
    'Last-Modified': new Date().toUTCString(),
    'Cache-Control': 'public, max-age=1'
  })

  return new Response(pdf)
}