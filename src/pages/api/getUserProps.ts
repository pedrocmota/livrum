import type {NextApiRequest, NextApiResponse} from 'next'
import {requireSession} from '../../utils/request'
import {getUserProps} from '../../models/UsersProps'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const session = requireSession(req.cookies.session, false)
  if (!session) {
    return res.status(401).end()
  }
  const userProps = (await getUserProps(session.userID))
  res.json(userProps)
}