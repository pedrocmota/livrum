import React from 'react'
import Head from 'next/head'
import {Flex, Text, Link as A} from '@chakra-ui/react'

const NotFound: React.FunctionComponent = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_SESSION_URI}&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email`
  return (
    <>
      <Head>
        <title>Livrum - Acesso negado</title>
      </Head>
      <Flex
        width="100%"
        height="100%"
        backgroundColor="#f5f5f5"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          as="h1"
          fontSize="50px"
          textAlign="center"
        >
          Acesso negado
        </Text>
        <Text
          as="h2"
          fontSize="26px"
          textAlign="center"
          marginTop="15px"
          paddingLeft="15px"
          paddingRight="15px"
        >
          A sua conta do Google não foi autorizada
        </Text>
        <A
          href={url}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="160px"
          height="42px"
          backgroundColor="transparent"
          border="1px solid #242020"
          color="#242020"
          borderRadius="3px"
          cursor="pointer"
          marginTop="15px"
          textDecoration="none"
          _hover={{
            color: '#242020'
          }}
        >
          Tentar novamente
        </A>
      </Flex>
    </>
  )
}

export default NotFound