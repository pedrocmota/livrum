import React, {useState, createRef} from 'react'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import axios from 'axios'
import {useRouter} from 'next/router'
import {useToasts} from 'react-toast-notifications'
import {format} from 'date-fns'
import {Flex, Container, Button, Text, Input, Select, Table, Thead, Tbody, Th} from '@chakra-ui/react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {filter} from '../../utils/data'
import {showLending} from '../../popups/ShowLending'
import {requireSession} from '../../utils/request'
import {getAllLendingProps, IAllLendings} from '../../models/AllLendingProps'

const TodosEmprestimos: React.FunctionComponent<IAllLendings> = (props) => {
  const router = useRouter()
  const [showOnly, setShowOnly] = useState((router.query.showOnly as string) || '')
  const [storageLendings, setStorageLendings] = useState(props.lendings)
  const table = createRef<HTMLTableElement>()
  const {addToast} = useToasts()

  const lendings = (() => {
    if (showOnly === 'ativos') {
      return storageLendings.filter((lending) => lending.status === 0)
    }
    if (showOnly === 'finalizados') {
      return storageLendings.filter((lending) => lending.status === 1)
    }
    return storageLendings
  })()

  const refresh = () => {
    axios.get('/api/getAllLendings').then((response) => {
      setStorageLendings(response.data)
    }).catch(() => {
      addToast('Houve um erro ao recuperar os empréstimos', {
        appearance: 'error'
      })
    })
  }

  return (
    <>
      <Head>
        <title>Livrum - Todos os empréstimos</title>
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
              marginBottom="20px"
              paddingLeft="1px"
            >
              Todos os empréstimos
            </Text>
            <Flex
              display="flex"
              __css={{
                '& select': {
                  paddingRight: '0px'
                },
                '@media screen and (max-width: 520px)': {
                  flexDirection: 'column',
                  '& .chakra-select__wrapper': {
                    width: '100%',
                    marginLeft: '0px',
                    marginTop: '10px'
                  }
                }
              }}
            >
              <Input
                type="search"
                placeholder="Pesquisar"
                flexGrow="1"
                height="36px"
                fontSize="16px"
                paddingLeft="6px"
                border="1px solid #DADADA"
                borderRadius="3px"
                paddingRight="10px"
                _placeholder={{
                  color: '#212529'
                }}
                sx={{
                  '@media screen and (max-width: 614px)': {
                    height: '40px'
                  }
                }}
                onChange={(e) => {filter(e.target.value, table.current)}}
              />
              <Select
                value={showOnly}
                width="250px"
                height="34px"
                backgroundColor="#ffffff"
                border="1px solid #DADADA"
                borderRadius="3px"
                marginLeft="10px"
                sx={{
                  '@media screen and (max-width: 614px)': {
                    height: '40px'
                  }
                }}
                onChange={(e) => {
                  const sOnly = e.currentTarget.value
                  setShowOnly(sOnly)
                  const urlSearch = new URLSearchParams(window.location.search)
                  if (sOnly.length > 0) {
                    urlSearch.set('showOnly', sOnly)
                  } else {
                    urlSearch.delete('showOnly')
                  }
                  const path = window.location.pathname + (sOnly.length > 0 ? '?' : '') + urlSearch.toString()
                  history.pushState(null, '', path)
                }}
              >
                <option value="">Mostrar todos</option>
                <option value="ativos">Mostrar apenas os ativos</option>
                <option value="finalizados">Mostrar apenas os finalizados</option>
              </Select>
            </Flex>
            <Flex overflowX="auto">
              <Table ref={table}
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
                    <Th>Livro</Th>
                    <Th>Usuário</Th>
                    <Th>Pego em</Th>
                    <Th>Data prevista p. devolução</Th>
                    <Th>Estado</Th>
                    <Th width="250px">Ação</Th>
                  </tr>
                </Thead>
                <Tbody
                  fontSize="15px"
                  cursor="pointer"
                >
                  {lendings.map(((lending) => {
                    return (
                      <tr key={lending.id} onDoubleClick={() => {
                        showLending(props.userData, lending, true, () => {
                          refresh()
                        })
                      }}>
                        <td>{lending.bookTitle}</td>
                        <td>{lending.userName}</td>
                        <td>{format(lending.borrowedAt * 1000, 'dd/MM/yyyy HH:mm')}</td>
                        <td>
                          {(lending.maxDate === 0) && (
                            'Indefinida'
                          )}
                          {(lending.maxDate > 0) && (
                            <>{format(lending.maxDate * 1000, 'dd/MM/yyyy')}</>
                          )}
                        </td>
                        <td>
                          {(lending.status === 0) && (
                            'Ativo'
                          )}
                          {(lending.status === 1) && (
                            'Finalizado'
                          )}
                        </td>
                        <td>
                          <Flex flexDir="column">
                            <Button
                              width="100%"
                              height="30px"
                              backgroundColor="#009879"
                              border="0"
                              borderRadius="2px"
                              color="#ffffff"
                              padding="10px"
                              paddingLeft="20px"
                              paddingRight="20px"
                              onClick={() => showLending(props.userData, lending, true, () => {
                                refresh()
                              })}
                              _disabled={{
                                backgroundColor: '#9B9191'
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
                              Detalhar
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    )
                  }))}
                </Tbody>
              </Table>
            </Flex>
            {(lendings.length === 0) && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                Não há empréstimos cadastrados
              </Text>
            )}
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
    const LendingProps = await getAllLendingProps(session.userID)
    return {
      props: {
        ...LendingProps
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

export default TodosEmprestimos