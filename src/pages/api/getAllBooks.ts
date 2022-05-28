import type {NextApiRequest, NextApiResponse} from 'next'
import {requireSession} from '../../utils/request'
import {getLibraryProps} from '../../models/LibraryProps'

export interface INewIBookTable {
  id: string,
  title: string,
  author: string,
  categories: string,
  stock: number,
  hasImage: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const session = requireSession(req.cookies.session, false)
  if (!session) {
    return res.status(401).end()
  }
  const allBooks = (await getLibraryProps(session.userID)).books
  res.json(allBooks)
}