import {getConnection, IBookTable} from './Database'
import {getUserData} from '../models/User'
import {IUserData} from '../types/global.d'

export interface IAllBooksTable {
  id: string,
  title: string,
  author: string,
  categories: string,
  stock: number,
  borrowed: number,
  createAt: number,
  updateAt: number,
  hasImage: number
}

export interface ILibrary extends IUserData {
  books: IAllBooksTable[]
}

export const getLibraryProps = async (userID: string) => {
  const knex = getConnection()
  const userData = await getUserData(userID)
  const allBooks = await knex<IBookTable>('books').select(knex.raw(
    'books.id, title, author, categories, stock, createAt, updateAt, OCTET_LENGTH(image) > 0 as hasImage, COUNT(lendings.book) as borrowed')
  ).leftJoin(knex.raw('lendings on lendings.book = books.id')).groupBy('books.id')
    .orderBy([{
      column: 'createAt',
      order: 'asc'
    }, {
      column: 'title',
      order: 'asc'
    }])
  return {
    userData: {...userData},
    books: Object.values(JSON.parse(JSON.stringify(allBooks)))
  }
}