import {getConnection} from './Database'
import {getUserData} from './User'
import {IUserData} from '../types/global'
import {IUserTable, IPreAutorizedTable} from '../models/Database'

export interface IUsersProps extends IUserData {
  allUsers: IUserTable[],
  allPreAutorized: IPreAutorizedTable[]
}

export const getUserProps = async (userID: string) => {
  const knex = getConnection()
  const userData = await getUserData(userID)
  const allUsers = await knex<IUserTable>('users').select('*').orderBy([
    {column: 'isAdmin', order: 'desc'},
    {column: 'createAt', order: 'asc'}
  ])
  const allPreAutorized = (await (knex<IPreAutorizedTable>('preauthorized').select('*')))
  return {
    userData: {...userData},
    allUsers: Object.values(JSON.parse(JSON.stringify(allUsers))),
    allPreAutorized: Object.values(JSON.parse(JSON.stringify(allPreAutorized)))
  }
}