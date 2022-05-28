import {getConnection, ILendingsTable} from './Database'
import {getUserData} from './User'
import {IUserData} from '../types/global'

export interface IMyLending extends ILendingsTable {
  bookTitle: string
}

export interface IMyLendings extends IUserData {
  lendings: IMyLending[]
}

export const getMyLendingProps = async (userID: string) => {
  const knex = getConnection()
  const userData = await getUserData(userID)
  const lendings = await knex<ILendingsTable>('lendings').select(knex.raw(
    'lendings.*, books.title as bookTitle')
  )
    .leftJoin(knex.raw('books on lendings.book = books.id'))
    .whereRaw(`lendings.user = '${userData.id}'`)
    .orderByRaw('lendings.borrowedAt desc')
  return {
    userData: {...userData},
    lendings: Object.values(JSON.parse(JSON.stringify(lendings)))
  }
}