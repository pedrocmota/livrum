import React from 'react'
import Head from 'next/head'
import {SSRProvider} from 'react-bootstrap'
import {ToastProvider, useToasts} from 'react-toast-notifications'
import {useRouter, NextRouter} from 'next/router'
import '../styles/global.css'
import '../styles/animations.css'
import type {AppProps} from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = ({Component, pageProps}: AppProps) => {
  return (
    <SSRProvider>
      <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
        <Wrapper>
          <Head>
            <meta charSet="utf-8" />
            <link rel="icon" href="/icon.png" />
          </Head>
          <Component {...pageProps} />
        </Wrapper>
      </ToastProvider>
    </SSRProvider>
  )
}

export let toasts: ReturnType<typeof useToasts> = null as any
export let router: NextRouter

const Wrapper: React.FunctionComponent<any> = (props) => {
  toasts = useToasts()
  router = useRouter()
  return (
    <>
      {props.children}
    </>
  )
}

export default App