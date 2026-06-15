import { Parser } from 'json2csv'

export const generarCSV = (
  datos,
  fields
) => {

  const parser = new Parser({
    fields,
    delimiter: ';',
    quote: ''
  })

  return parser.parse(datos)
}