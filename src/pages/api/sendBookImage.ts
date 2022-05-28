import type {NextApiResponse} from 'next'
import {ExtendedNextApiRequest, requireParams, requireSession} from '../../utils/request'
import Jimp from 'jimp'
import {getConnection, IBookTable} from '../../models/Database'

interface ISendBookImage {
  bookID: string,
  data: string
}

export default async (req: ExtendedNextApiRequest<ISendBookImage>, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  if (!requireParams(req, {
    body: {
      data: 'string',
      bookID: 'string'
    }
  })) {
    return res.status(422).end()
  }
  const session = requireSession(req.cookies.session, true)
  if (!session) {
    return res.status(401).end()
  }
  const knex = getConnection()
  try {
    if (req.body.data !== 'DELETE') {
      const buf = Buffer.from(req.body.data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64')
      await ((async () => {
        const base = await (await Jimp.read(buf))
          .resize(80, 100)
          .quality(50)
          .getBase64Async(Jimp.MIME_JPEG)
        const updated = await knex<IBookTable>('books').update({
          image: base,
          updateAt: Date.now() / 1000
        }).where({
          id: req.body.bookID
        })
        if (updated === 0) {
          return res.status(404).end()
        }
      }))()
    } else {
      const updated = await knex<IBookTable>('books').update({
        image: '',
        updateAt: Date.now() / 1000
      }).where({
        id: req.body.bookID
      })
      if (updated === 0) {
        return res.status(404).end()
      }
    }
    return res.status(200).end()
  } catch (error) {
    return res.status(406).end()
  }
}