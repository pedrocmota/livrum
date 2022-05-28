import type {NextApiRequest, NextApiResponse} from 'next'
import axios from 'axios'
import querystring from 'querystring'
import Cookies from 'cookies'
import {createSession, getUserData, isAuthorized} from '../../models/User'
import {setUserData} from '../../models/User'
import {IGoogleUser} from '../../types/global'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const code = (req.query.code || '') as string
  try {
    const tokenRequest = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_SESSION_URI,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const {id_token, access_token} = tokenRequest.data
    const googleUser = (await axios
      .get<IGoogleUser>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      })).data
    const [authorized, isAdmin] = await (async () => {
      const userData = await getUserData(googleUser.id)
      if (userData.id) {
        return [true, Number(userData.isAdmin!)]
      } else {
        const auth = await isAuthorized(googleUser.email)
        return [auth !== undefined, auth?.isAdmin || 0]
      }
    })()
    if (!authorized) {
      return res.redirect('/forbidden')
    }
    await setUserData(googleUser, Boolean(isAdmin))
    const sessionToken = createSession(googleUser.id, Boolean(isAdmin))
    const cookies = new Cookies(req, res)
    cookies.set('session', sessionToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_LIFETIME) * 1000
    })
    res.redirect('/')
  } catch (error) {
    res.status(500).send('Erro ao processar a solicitação. Tente novamente')
  }
}