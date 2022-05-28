import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams} from '../../utils/request'
import {getIndexProps} from '../../models/IndexProps'

export interface IGetBooks {
  multi: string,
  search: string
}

export default async (req: ExtendedNextApiRequest<IGetBooks>, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    opcionalQuery: {
      multi: 'string',
      search: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const multi = (() => {
    const n = parseInt(req.query.multi?.toString() || '')
    return n > 0 ? n : 1
  })()
  const allBooks = (await getIndexProps('', req.query?.search.toString() || '', multi)).books
  res.json(allBooks)
}