import type {NextApiRequest} from 'next'
import jsonwebtoken from 'jsonwebtoken'
import {ISession} from '../types/global.d'

export interface ExtendedNextApiRequest<T> extends NextApiRequest {
  body: T
}

interface IRequires {
  body?: IRequireBody,
  query?: IRequireQuery,
  opcionalBody?: IRequireBody,
  opcionalQuery?: IRequireQuery
}

interface IRequireBody {
  [key: string]: requestTypes
}

interface IRequireQuery {
  [key: string]: Exclude<requestTypes, 'string[]'>
}

type requestTypes = 'string' | 'string[]'

export const requireParams = (req: NextApiRequest, rules?: IRequires) => {
  const body = req.body as any
  const query = req.query as unknown as any
  const errors: string[] = []
  if (rules?.body) {
    Object.keys(rules.body).forEach((rule) => {
      const param = body[rule]
      if (param !== undefined) {
        const type = rules.body![rule]
        if (validateType(type, param)) {
          body[rule] = processData(param)
        } else {
          errors.push(`${rule} is not ${type}`)
        }
      } else {
        errors.push(`${rule} is missing in body`)
      }
    })
  }
  if (rules?.opcionalBody) {
    Object.keys(rules.opcionalBody).forEach((rule) => {
      const param = body[rule]
      if (param !== undefined) {
        const type = rules.opcionalBody![rule]
        if (validateType(type, param)) {
          body[rule] = processData(param)
        } else {
          errors.push(`${rule} is not ${type}`)
        }
      } else {
        if (rules.opcionalBody![rule] === 'string') {
          body[rule] = ''
        }
        if (rules.opcionalBody![rule] === 'string[]') {
          body[rule] = []
        }
      }
    })
  }
  if (rules?.query) {
    Object.keys(rules.query).forEach((rule) => {
      const param = query[rule]
      if (param !== undefined) {
        const type = rules.query![rule]
        if (validateType(type, param)) {
          query[rule] = processData(param)
        } else {
          errors.push(`${rule} is not ${type}`)
        }
      } else {
        errors.push(`${rule} is missing in query`)
      }
    })
  }
  if (rules?.opcionalQuery) {
    Object.keys(rules.opcionalQuery as object).forEach((rule) => {
      const param = query[rule]
      if (param !== undefined) {
        const type = rules.opcionalQuery![rule]
        if (validateType(type, param)) {
          query[rule] = processData(param)
        } else {
          errors.push(`${rule} is not ${type}`)
        }
      } else {
        query[rule] = ''
      }
    })
  }
  return errors.length === 0
}

export const requireSession = (token: string | undefined, requireAdmin: boolean) => {
  if (token === undefined) {
    return undefined
  }
  try {
    const session = jsonwebtoken.verify(token, process.env.SESSION_SECRET) as ISession | undefined
    if (session) {
      if (requireAdmin && !session.isAdmin) {
        return undefined
      }
      return session as ISession
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
}

const validateType = (type: requestTypes, value: string | any[]) => {
  if (type === 'string') {
    return typeof value === 'string'
  }
  if (type === 'string[]') {
    if (!Array.isArray(value)) return false
    return (value as any[]).every((v) => (typeof v === 'string'))
  }
}

const processData = (param: number | string | string[]) => {
  if (typeof param === 'string') {
    return param
  }
  if (Array.isArray(param)) {
    const array: string[] = []
    param.forEach((s) => {
      array.push(s)
    })
    return array
  }
  return param
}