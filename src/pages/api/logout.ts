import type {NextApiRequest, NextApiResponse} from 'next'
import Cookies from 'cookies'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const cookies = new Cookies(req, res)
  cookies.set('session', '', {
    maxAge: 0
  })
  res.redirect('/')
}