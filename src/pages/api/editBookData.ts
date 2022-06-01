import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IBookTable} from '../../models/Database'

interface IEditBookData {
  id: string,
  title: string,
  author: string,
  categories: string,
  stock: string
}

export default async (req: ExtendedNextApiRequest<IEditBookData>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      id: 'string',
      title: 'string',
      author: 'string',
      categories: 'string',
      stock: 'string'
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
  if ((title.length < 3 || title.length > 400) ||
    (author.length < 3 || author.length > 400) ||
    (categories.length < 3 || categories.length > 400) ||
    (isNaN(stock as any))
  ) {
    return res.status(406).end()
  }
  const knex = getConnection()
  const updated = await knex<IBookTable>('books').update({
    title: title,
    author: author,
    categories: categories,
    stock: parseInt(stock),
    updateAt: Date.now() / 1000
  }).where({
    id: req.body.id
  })
  if (updated == 0) {
    return res.status(404).end()
  }
  return res.status(200).end()
}