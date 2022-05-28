import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IPreAutorizedTable} from '../../models/Database'

export interface IDeletePreAuthorization {
  email: string
}

export default async (req: ExtendedNextApiRequest<IDeletePreAuthorization>, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      email: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const knex = getConnection()
  const deleted = await knex<IPreAutorizedTable>('preauthorized').delete().where({
    email: req.body.email
  })
  if (deleted !== 1) {
    return res.status(404).end()
  }
  res.status(200).end()
}