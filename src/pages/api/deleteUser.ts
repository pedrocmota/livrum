import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IUserTable, ILendingsTable} from '../../models/Database'

export interface IDeleteUser {
  userID: string
}

export default async (req: ExtendedNextApiRequest<IDeleteUser>, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      userID: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const knex = getConnection()
  const deletedUser = await knex<IUserTable>('users').delete().where({
    id: req.body.userID
  })
  await knex<ILendingsTable>('lendings').delete().where({
    user: req.body.userID
  })
  if (deletedUser !== 1) {
    return res.status(404).end()
  }
  res.status(200).end()
}