import type {NextApiResponse} from 'next'
import Jimp from 'jimp'
import {v4 as uuid} from 'uuid'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IBookTable} from '../../models/Database'

export interface IAddBook {
  title: string,
  author: string,
  categories: string,
  stock: string,
  image: string
}

export default async (req: ExtendedNextApiRequest<IAddBook>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      title: 'string',
      author: 'string',
      categories: 'string',
      stock: 'string',
      image: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const title = req.body.title
  const author = req.body.author
  const categories = req.body.categories
  const stock = req.body.stock
  if ((title.length < 3 || title.length > 30) ||
    (author.length < 3 || author.length > 30) ||
    (categories.length < 3 || categories.length > 30) ||
    (isNaN(stock as any))
  ) {
    return res.status(406).end()
  }
  const image = await (async () => {
    if (req.body.image.length > 0) {
      try {
        const buf = Buffer.from(req.body.image.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64')
        return await (await Jimp.read(buf))
          .resize(80, 100)
          .quality(50)
          .getBase64Async(Jimp.MIME_JPEG)
      } catch (error) {
        return null
      }
    } else {
      return null
    }
  })()
  const id = uuid()
  const knex = getConnection()
  await knex<IBookTable>('books').insert({
    id: id,
    title: title,
    author: author,
    categories: categories,
    stock: parseInt(stock),
    createAt: Date.now() / 1000,
    updateAt: Date.now() / 1000,
    ...(image && {
      image: image
    })
  })
  return res.json({
    id: id,
    hasImage: req.body.image.length > 0
  })
}