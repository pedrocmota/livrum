import React, {useState, createRef} from 'react'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import {Flex, Container, Button, Text, Input, Table, Thead, Tbody, Th} from '@chakra-ui/react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {filter} from '../../utils/data'
import {showEditBook} from '../../popups/EditBook'
import {showAddBook} from '../../popups/AddBook'
import {requireSession} from '../../utils/request'
import {getLibraryProps, ILibrary, IAllBooksTable} from '../../models/LibraryProps'

const Biblioteca: React.FunctionComponent<ILibrary> = (props) => {
  const [books, setBooks] = useState<IAllBooksTable[]>(props.books)
  const table = createRef<HTMLTableElement>()
  const {addToast} = useToasts()

  const refresh = () => {
    axios.get('/api/getAllBooks').then((response) => {
      setBooks(response.data)
    }).catch(() => {
      addToast('Houve um erro ao recuperar os livros', {
        appearance: 'error'
      })
    })
  }

  return (
    <>
      <Head>
        <title>Livrum - Editar biblioteca</title>
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
              Edição da biblioteca
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
                onClick={() => showAddBook(() => {
                  refresh()
                })}
                sx={{
                  '@media screen and (max-width: 614px)': {
                    width: '100%',
                    height: '40px'
                  }
                }}
                _hover={{
                  backgroundColor: '#03A786'
                }}
              >
                Cadastrar novo livro
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
                {books.length} livros cadastrados
              </Text>
            </Flex>
            <Flex
              display="flex"
              __css={{
                '& select': {
                  paddingRight: '0px'
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
                    <Th>Título</Th>
                    <Th>Autor</Th>
                    <Th>Categoria(as)</Th>
                    <Th>Estoque</Th>
                    <Th>Emprestados</Th>
                    <Th>Disponíveis</Th>
                    <Th>Com foto</Th>
                    <Th>Criado em</Th>
                    <Th>Última edição</Th>
                    <Th width="250px">Ação</Th>
                  </tr>
                </Thead>
                <Tbody
                  fontSize="15px"
                  cursor="pointer"
                >
                  {books.map(((book) => {
                    return (
                      <tr key={book.id} onDoubleClick={() => showEditBook(book, () => {
                        refresh()
                      })}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.categories}</td>
                        <td>{book.stock}</td>
                        <td>{book.borrowed}</td>
                        <td>{book.stock - book.borrowed}</td>
                        <td>{book.hasImage ? 'Sim' : 'Não'}</td>
                        <td>{new Date(book.createAt * 1000).toLocaleString()}</td>
                        <td>{new Date(book.updateAt * 1000).toLocaleString()}</td>
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
                              onClick={() => showEditBook(book, () => {
                                refresh()
                              })}
                              _disabled={{
                                backgroundColor: '#9B9191'
                              }}
                              _hover={{
                                backgroundColor: '#03A786'
                              }}
                            >
                              Editar livro
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    )
                  }))}
                </Tbody>
              </Table>
            </Flex>
            {(books.length === 0) && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                Não há livros cadastrados
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
    const LibraryProps = await getLibraryProps(session.userID)
    return {
      props: {
        ...LibraryProps
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

export default Biblioteca