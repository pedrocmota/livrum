import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import {getConnection, IPreAutorizedTable} from '../../models/Database'
import {validateEmail} from '../../utils/data'

export interface IAddPreAuthorization {
  email: string,
  isAdmin: string
}

export default async (req: ExtendedNextApiRequest<IAddPreAuthorization>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      email: 'string',
      isAdmin: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  if (!validateEmail(req.body.email)) {
    return res.status(406).end()
  }
  if (req.body.isAdmin !== '0' && req.body.isAdmin !== '1') {
    return res.status(400).end()
  }
  const knex = getConnection()
  const alreadyExists = (await knex<IPreAutorizedTable>('preauthorized').select('*').where({
    email: req.body.email
  }).first()) !== undefined
  if (alreadyExists) {
    return res.status(409).end()
  }
  await knex<IPreAutorizedTable>('preauthorized').insert({
    email: req.body.email,
    isAdmin: parseInt(req.body.isAdmin)
  })
  res.status(200).end()
}