import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {getConnection, IBookTable} from '../../models/Database'

interface IGetBookImage {
  bookID: string,
  data: string
}

export default async (req: ExtendedNextApiRequest<IGetBookImage>, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    query: {
      bookID: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const knex = getConnection()
  const data = await knex<IBookTable>('books')
    .select('image')
    .where({id: req.query.bookID as any})
    .first()
  if (data?.image && data.image.length > 0) {
    const decoded = data.image.toString().replace('data:image/jpeg;base64,', '')
    const imageResp = Buffer.from(decoded, 'base64')
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': imageResp.length
    })
    res.end(imageResp)
  } else {
    res.redirect('/noPhoto.png')
  }
}