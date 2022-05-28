import type {NextApiRequest, NextApiResponse} from 'next'
import {requireSession} from '../../utils/request'
import {getAllLendingProps} from '../../models/AllLendingProps'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const session = requireSession(req.cookies.session, false)
  if (!session) {
    return res.status(401).end()
  }
  const myLendings = (await getAllLendingProps(session.userID)).lendings
  res.json(myLendings)
}