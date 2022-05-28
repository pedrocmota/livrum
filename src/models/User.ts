import jsonwebtoken from 'jsonwebtoken'
import {getConnection, IUserTable, IPreAutorizedTable} from './Database'
import {treatName} from '../utils/data'
import {IGoogleUser} from '../types/global'
import {ISession} from '../types/global.d'

export const isAuthorized = async (email: string) => {
  const knex = getConnection()
  return await knex<IPreAutorizedTable>('preauthorized').select('*').where({
    email: email
  }).first()
}

export const getUserData = async (userID: string) => {
  const knex = getConnection()
  const userData = await knex<IUserTable>('users').select().where({
    id: userID
  }).first()
  return {
    isLogged: userData !== undefined,
    ...userData
  }
}

export const setUserData = async (userData: IGoogleUser, isAdmin: boolean) => {
  const knex = getConnection()
  const {fullName} = treatName(userData.name)
  await knex<IUserTable>('users').insert({
    id: userData.id,
    name: fullName,
    email: userData.email,
    picture: userData.picture,
    isAdmin: isAdmin,
    createAt: Date.now() / 1000,
    updateAt: Date.now() / 1000
  }).onConflict('id').ignore()
}

export const createSession = (userID: string, isAdmin: boolean) => {
  const sessionToken = jsonwebtoken.sign({
    userID: userID,
    isAdmin: isAdmin
  } as ISession, process.env.SESSION_SECRET, {
    expiresIn: parseInt(process.env.SESSION_LIFETIME)
  })
  return sessionToken
}