import {IUserTable} from '../models/Database'

export interface IGoogleUser {
  id: string,
  email: string,
  verified_email: string,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  locale: string,
  hd: string
}

export interface ISession {
  userID: string,
  isAdmin: boolean
}

export interface IUserData {
  userData: IUserDataObject
}

export interface IUserDataObject extends Partial<IUserTable> {
  isLogged: boolean
}