import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, ILendingsTable} from '../../models/Database'

export interface IDeleteLending {
  lendingID: string
}

export default async (req: ExtendedNextApiRequest<IDeleteLending>, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      lendingID: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const knex = getConnection()
  const lending = await knex<ILendingsTable>('lendings').select('*').where({id: req.body.lendingID}).first()
  if (lending?.user !== session.userID) {
    return res.status(403).end()
  }
  await knex<ILendingsTable>('lendings').delete().where({
    id: req.body.lendingID
  })
  res.status(200).end()
}