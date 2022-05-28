declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string,
      SERVER_PRIVATE_KEY: string,
      SERVER_CERTIFICATE: string

      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string,
      GOOGLE_CLIENT_SECRET: string,
      SERVER_URI: string,
      NEXT_PUBLIC_REDIRECT_SESSION_URI: string,

      SESSION_SECRET: string,
      SESSION_LIFETIME: string,

      DATABASE_IP: string,
      DATABASE_PORT: string,
      DATABASE_USERNAME: string,
      DATABASE_PASSWORD: string,
      DATABASE_NAME: string,

      MAX_UPLOAD_SIZE: string
    }
  }
}

export interface IpublicRuntimeConfig {
  version: string
}