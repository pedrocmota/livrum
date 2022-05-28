import {knex, Knex} from 'knex'
import KnexConfig from './Knexfile'

let cachedConnection: Knex<any, unknown[]> | null = null

export const getConnection = () => {
  if (cachedConnection) {
    return cachedConnection
  }
  cachedConnection = knex(KnexConfig)
  return cachedConnection
}

export interface IUserTable {
  id: string,
  name: string,
  email: string,
  picture: string,
  isAdmin: boolean,
  createAt: number,
  updateAt: number
}

export interface IBookTable {
  id: string,
  title: string,
  author: string,
  categories: string,
  stock: number,
  image: string,
  createAt: number,
  updateAt: number
}

export interface ILendingsTable {
  id: string,
  user: string,
  book: string,
  borrowedAt: number,
  maxDate: number,
  notes: string,
  status: number
}

export interface IPreAutorizedTable {
  email: string,
  isAdmin: number
}