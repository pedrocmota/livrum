import {getConnection, ILendingsTable} from './Database'
import {getUserData} from './User'
import {IUserData} from '../types/global'

export interface IAllLending extends ILendingsTable {
  bookTitle: string,
  userName: string
}

export interface IAllLendings extends IUserData {
  lendings: IAllLending[]
}

export const getAllLendingProps = async (userID: string) => {
  const knex = getConnection()
  const userData = await getUserData(userID)
  const lendings = await knex<ILendingsTable>('lendings').select(knex.raw(
    'lendings.*, books.title as bookTitle, users.name as userName')
  )
    .leftJoin(knex.raw('books on lendings.book = books.id'))
    .leftJoin(knex.raw('users on users.id = lendings.user'))
    .orderByRaw('lendings.borrowedAt desc')
  return {
    userData: {...userData},
    lendings: Object.values(JSON.parse(JSON.stringify(lendings)))
  }
}