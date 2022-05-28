import {getConnection, IBookTable} from '../models/Database'
import {getUserData} from '../models/User'
import {IUserData} from '../types/global.d'

export interface IBook {
  id: string,
  title: string,
  author: string,
  categories: string,
  stock: number,
  borrowed: number
}

export interface IIndexProps extends IUserData {
  multi: number,
  search: string,
  books: IBook[],
  nBooks: number
}

export const getIndexProps = async (userID: string, search: string, multi: number) => {
  const knex = getConnection()
  const allBooks = await (async () => {
    if (search.length > 0) {
      return await knex<IBookTable>('books').select(knex.raw(
        'books.id, title, author, categories, stock, COUNT(lendings.book) as borrowed')
      )
        .leftJoin(knex.raw('lendings on lendings.book = books.id and lendings.status = 0'))
        .whereRaw(`title like '%${search}%' or author like '%${search}%' or categories like '%${search}%'`)
        .groupBy('books.id')
        .orderByRaw('RAND()')
        .limit(10 * multi)
    } else {
      return await knex<IBookTable>('books').select(knex.raw(
        'books.id, title, author, categories, stock, COUNT(lendings.book) as borrowed')
      )
        .leftJoin(knex.raw('lendings on lendings.book = books.id and lendings.status = 0'))
        .groupBy('books.id')
        .orderByRaw('RAND()')
        .limit(10 * multi)
    }
  })()
  const nBooks = (await knex<IBookTable>('books').count('* as n').first() as any).n
  const userData = await getUserData(userID)
  return {
    userData: {...userData},
    books: Object.values(JSON.parse(JSON.stringify(allBooks))),
    nBooks: nBooks
  }
}