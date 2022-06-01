import React, {useState} from 'react'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useToasts} from 'react-toast-notifications'
import {Flex, Container, Button, Text, Table, Thead, Tbody, Th} from '@chakra-ui/react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {showAddPreAutorization} from '../../popups/AddPreAutorization'
import {requireSession} from '../../utils/request'
import {getUserProps, IUsersProps} from '../../models/UsersProps'
import {IDeletePreAuthorization} from '../api/deletePreAuthorization'
import {IDeleteUser} from '../api/deleteUser'

const Usuarios: React.FunctionComponent<IUsersProps> = (props) => {
  const [userProps, setUserProps] = useState<IUsersProps>(props)
  const {addToast} = useToasts()

  const refresh = () => {
    axios.get('/api/getUserProps').then((response) => {
      setUserProps(response.data)
    }).catch(() => {
      addToast('Houve um erro ao recuperar os usuários', {
        appearance: 'error'
      })
    })
  }

  const deletePreAuthorization = (email: string) => {
    Swal.fire({
      title: 'Você confirma a ação?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.delete<any, any, IDeletePreAuthorization>('/api/deletePreAuthorization', {
          data: {
            email: email
          }
        }).then(() => {
          refresh()
          return addToast('Autorização deletada com sucesso!', {
            appearance: 'success'
          })
        }).catch((reason) => {
          addToast(`Houve um erro ao deletar a autorização. Erro ${reason.response?.status}`, {
            appearance: 'error'
          })
        })
      }
    })
  }

  const deleteUser = (userID: string) => {
    Swal.fire({
      title: 'Você confirma a ação?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.delete<any, any, IDeleteUser>('/api/deleteUser', {
          data: {
            userID: userID
          }
        }).then(() => {
          refresh()
          return addToast('Usuário deletado com sucesso!', {
            appearance: 'success'
          })
        }).catch((reason) => {
          addToast(`Houve um erro ao deletar o usuário. Erro ${reason.response?.status}`, {
            appearance: 'error'
          })
        })
      }
    })
  }

  return (
    <>
      <Head>
        <title>Livrum - Editar usuários</title>
      </Head>
      <Flex
        as="div"
        flexDir="column"
        width="100%"
        flex="1"
      >
        <Container>
          <Navbar
            name={props.userData?.name}
            picture={props.userData?.picture}
            isAdmin={props.userData?.isAdmin}
          />
        </Container>
        <Flex
          id="background"
          flexDir="column"
          alignItems="center"
          width="100%"
          flex="1"
          backgroundColor="#F5F5F5">
          <Flex
            id="container"
            flexDir="column"
            width="95%"
            maxW="1800px"
            flex="1"
            marginTop="40px"
            marginBottom="40px"
          >
            <Text
              as="h1"
              fontSize="24px"
              marginBottom="25px"
              paddingLeft="1px"
            >
              Edição dos usuários
            </Text>
            <Flex
              sx={{
                '@media screen and (max-width: 664px)': {
                  flexDirection: 'column'
                }
              }}
            >
              <Text
                display="flex"
                alignItems="center"
              >
                {props.allUsers.length} usuários cadastrados
              </Text>
            </Flex>
            <Flex overflowX="auto">
              <Table
                width="100%"
                marginTop="10px"
                whiteSpace="nowrap"
                __css={{
                  '& thead': {
                    backgroundColor: '#009879'
                  },
                  '& th': {
                    paddingLeft: '10px'
                  },
                  '& td': {
                    padding: '16px',
                    color: '#1F1C1C'
                  },
                  '& tr:hover:not(#thead)': {
                    backgroundColor: '#E7E7E7'
                  }
                }}
              >
                <Thead
                  height="40px"
                  padding-left="15px"
                  fontSize="16px"
                  color="#ffffff"
                  text-align="left"
                  sx={{
                    '@media screen and (max-width: 614px)': {
                      '& th': {
                        paddingTop: '8px',
                        paddingBottom: '8px'
                      }
                    }
                  }}
                >
                  <tr id="thead">
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>É administrador</Th>
                    <Th>Criado em</Th>
                    <Th>Atualizado em</Th>
                    <Th width="250px">Ação</Th>
                  </tr>
                </Thead>
                <Tbody
                  fontSize="15px"
                  cursor="pointer"
                >
                  {userProps.allUsers.map(((user) => {
                    return (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'Sim' : 'Não'}</td>
                        <td>{new Date(user.createAt * 1000).toLocaleString()}</td>
                        <td>{new Date(user.updateAt * 1000).toLocaleString()}</td>
                        <td>
                          {(user.id !== props.userData.id) && (
                            <Flex flexDir="column">
                              <Button
                                width="100%"
                                height="30px"
                                backgroundColor="#CE505B"
                                border="0"
                                borderRadius="2px"
                                color="#ffffff"
                                padding="10px"
                                paddingLeft="20px"
                                paddingRight="20px"
                                onClick={() => deleteUser(user.id)}
                                _disabled={{
                                  backgroundColor: '#9B9191'
                                }}
                                _focus={{
                                  border: '1px solid #262A30',
                                  borderColor: '#262A30',
                                  boxShadow: '0 0 3px #262A30'
                                }}
                                _hover={{
                                  backgroundColor: '#DD5E69'
                                }}
                              >
                                Deletar usuário
                              </Button>
                            </Flex>
                          )}
                        </td>
                      </tr>
                    )
                  }))}
                </Tbody>
              </Table>
            </Flex>
            {(props.allUsers.length === 0) && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                Não há usuários cadastrados
              </Text>
            )}
            <hr />
            <Text
              as="h1"
              fontSize="24px"
              marginBottom="25px"
              marginTop="10px"
              paddingLeft="1px"
            >
              Edição de pré-autorizações
            </Text>
            <Flex
              sx={{
                '@media screen and (max-width: 664px)': {
                  flexDirection: 'column'
                }
              }}
            >
              <Button
                width="240px"
                height="34px"
                marginBottom="12px"
                backgroundColor="#009879"
                border="0"
                borderRadius="2px"
                color="#ffffff"
                padding="10px"
                onClick={() => showAddPreAutorization(() => {
                  refresh()
                })}
                sx={{
                  '@media screen and (max-width: 614px)': {
                    width: '100%',
                    height: '40px'
                  }
                }}
                _focus={{
                  border: '1px solid #262A30',
                  borderColor: '#262A30',
                  boxShadow: '0 0 3px #262A30'
                }}
                _hover={{
                  backgroundColor: '#03A786'
                }}
              >
                Cadastrar nova autorização
              </Button>
              <Text
                display="flex"
                alignItems="center"
                paddingLeft="10px"
                sx={{
                  '@media screen and (max-width: 664px)': {
                    paddingLeft: '0px'
                  }
                }}
              >
                {userProps.allPreAutorized.length} autorizações cadastradas
              </Text>
            </Flex>
            <Flex
              overflowX="auto"
            >
              <Table
                width="100%"
                marginTop="10px"
                whiteSpace="nowrap"
                __css={{
                  '& thead': {
                    backgroundColor: '#009879'
                  },
                  '& th': {
                    paddingLeft: '10px'
                  },
                  '& td': {
                    padding: '16px',
                    color: '#1F1C1C'
                  },
                  '& tr:hover:not(#thead)': {
                    backgroundColor: '#E7E7E7'
                  }
                }}
              >
                <Thead
                  height="40px"
                  padding-left="15px"
                  fontSize="16px"
                  color="#ffffff"
                  text-align="left"
                  sx={{
                    '@media screen and (max-width: 614px)': {
                      '& th': {
                        paddingTop: '8px',
                        paddingBottom: '8px'
                      }
                    }
                  }}
                >
                  <tr id="thead">
                    <Th>Email</Th>
                    <Th>Para um administrador?</Th>
                    <Th width="250px">Ação</Th>
                  </tr>
                </Thead>
                <Tbody
                  fontSize="15px"
                  cursor="pointer"
                >
                  {userProps.allPreAutorized.map(((preAutorized) => {
                    return (
                      <tr key={preAutorized.email}>
                        <td>{preAutorized.email}</td>
                        <td>{preAutorized.isAdmin ? 'Sim' : 'Não'}</td>
                        <td>
                          <Flex flexDir="column">
                            <Button
                              width="100%"
                              height="30px"
                              backgroundColor="#CE505B"
                              border="0"
                              borderRadius="2px"
                              color="#ffffff"
                              padding="10px"
                              paddingLeft="20px"
                              paddingRight="20px"
                              onClick={() => deletePreAuthorization(preAutorized.email)}
                              _disabled={{
                                backgroundColor: '#9B9191'
                              }}
                              _focus={{
                                border: '1px solid #262A30',
                                borderColor: '#262A30',
                                boxShadow: '0 0 3px #262A30'
                              }}
                              _hover={{
                                backgroundColor: '#DD5E69'
                              }}
                            >
                              Deletar autorização
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    )
                  }))}
                </Tbody>
              </Table>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = requireSession(context.req.cookies.session, false)
  if (session) {
    const UserProps = await getUserProps(session.userID)
    return {
      props: {
        ...UserProps
      }
    }
  } else {
    return {
      props: {},
      redirect: {
        destination: '/'
      }
    }
  }
}

export default Usuarios