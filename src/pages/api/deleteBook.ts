import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IBookTable, ILendingsTable} from '../../models/Database'

export interface IDeleteBook {
  id: string
}

export default async (req: ExtendedNextApiRequest<IDeleteBook>, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      id: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const knex = getConnection()
  const deleted = await knex<IBookTable>('books').delete().where({
    id: req.body.id
  })
  await knex<ILendingsTable>('lendings').delete().where({
    book: req.body.id
  })
  if (deleted !== 1) {
    res.status(404).end()
  }
  res.status(200).end()
}