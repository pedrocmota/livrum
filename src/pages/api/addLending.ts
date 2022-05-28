import type {NextApiResponse} from 'next'
import {v4 as uuid} from 'uuid'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IBookTable, ILendingsTable} from '../../models/Database'

export interface IAddLending {
  bookID: string,
  maxDate: string,
  notes: string
}

export default async (req: ExtendedNextApiRequest<IAddLending>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      bookID: 'string',
      maxDate: 'string',
      notes: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, false)
  if (!session) {
    return res.status(401).end()
  }
  if (req.body.notes.length > 5000) {
    return res.status(417).end()
  }
  const knex = getConnection()
  const book = await knex<IBookTable>('books').select(knex.raw(
    'books.id, stock, COUNT(lendings.book) as borrowed')
  )
    .leftJoin(knex.raw('lendings on lendings.book = books.id and lendings.status = 0'))
    .groupBy('books.id')
    .whereRaw(`books.id = '${req.body.bookID}'`).first()
  if (book === undefined) {
    return res.status(404).end()
  }
  if (book.stock <= book.borrowed) {
    return res.status(406).end()
  }
  await knex<ILendingsTable>('lendings').insert({
    id: uuid(),
    book: req.body.bookID,
    user: session.userID,
    borrowedAt: Date.now() / 1000,
    maxDate: parseInt(req.body.maxDate),
    notes: req.body.notes,
    status: 0
  })
  res.status(200).end()
}