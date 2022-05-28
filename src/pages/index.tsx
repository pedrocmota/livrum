import {useState, useRef} from 'react'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import {useRouter} from 'next/router'
import axios from 'axios'
import {Flex, Container, Image, Button, Text, Input, Table, Thead, Tbody, Th} from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Spinner from '../../public/spinner.svg'
import {useToasts} from 'react-toast-notifications'
import {requireSession} from '../utils/request'
import {showBook} from '../popups/ShowBook'
import {getIndexProps, IIndexProps} from '../models/IndexProps'
import {IGetBooks} from '../pages/api/getBooks'

const Index: React.FunctionComponent<IIndexProps> = (props) => {
  const [books, setBooks] = useState(props.books)
  const [loading, setLoading] = useState(false)
  const {addToast} = useToasts()
  const router = useRouter()
  const multi = useRef(1)
  const search = useRef((router.query.search as string) || '')

  const refresh = (callback?: () => void) => {
    setLoading(true)
    axios.get<any, any, IGetBooks>('/api/getBooks', {
      params: {
        multi: multi.current.toString(),
        search: search.current
      }
    }).then((response) => {
      setBooks(response.data)
      setLoading(false)
      if (callback) {
        callback()
      }
    }).catch(() => {
      setLoading(false)
      addToast('Houve um erro ao recuperar os livros', {
        appearance: 'error'
      })
    })
  }

  return (
    <>
      <Head>
        <title>Livrum</title>
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
            marginTop="20px"
            marginBottom="40px"
          >
            <Flex>
              <Input
                type="search"
                defaultValue={search.current}
                placeholder="Pesquisar nome, autor ou categoria"
                flexGrow="1"
                height="42px"
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
                onKeyUp={(e) => {
                  if (e.key == 'Enter') {
                    const searchText = e.currentTarget.value
                    search.current = searchText
                    multi.current = 1
                    const urlSearch = new URLSearchParams(window.location.search)
                    if (searchText.length > 0) {
                      urlSearch.set('search', searchText)
                    } else {
                      urlSearch.delete('search')
                    }
                    const path = window.location.pathname +
                      (searchText.length > 0 ? '?' : '') + urlSearch.toString()
                    history.pushState(null, '', path)
                    refresh()
                  }
                }}
              />
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
                  '& tr:nth-of-type(even)': {
                    backgroundColor: '#F1EFEF'
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
                    <Th width="250px">Ação</Th>
                  </tr>
                </Thead>
                <Tbody
                  fontSize="17px"
                  cursor="pointer"
                >
                  {books.map(((book) => {
                    return (
                      <tr key={book.id} onDoubleClick={() => showBook(props.userData, book)}>
                        <td>
                          <Image
                            src={`/api/getBookImage?bookID=${book.id}`}
                            width="80px"
                            height="100px"
                            marginRight="25px"
                          />
                          <Text
                            as="b"
                            fontSize="20px"
                          >
                            {book.title}
                          </Text>
                        </td>
                        <td>{book.author}</td>
                        <td>{book.categories}</td>
                        <td>{book.stock}</td>
                        <td>{book.borrowed}</td>
                        <td>{book.stock - book.borrowed}</td>
                        <td>
                          <Flex flexDir="column">
                            <Button
                              width="100%"
                              height="35px"
                              backgroundColor="#009879"
                              border="0"
                              borderRadius="2px"
                              color="#ffffff"
                              padding="10px"
                              paddingLeft="20px"
                              paddingRight="20px"
                              onClick={() => showBook(props.userData, book)}
                              _disabled={{
                                backgroundColor: '#9B9191'
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
            <Flex
              justifyContent="center"
            >
              {(books.length >= 10 && (props.nBooks / multi.current >= 10)) && (
                <Button
                  width="300px"
                  height="38px"
                  backgroundColor="transparent"
                  border="1px solid #201D1D"
                  borderRadius="3px"
                  marginTop="20px"
                  onClick={() => {
                    multi.current = multi.current + 1
                    refresh(() => {
                      window.scrollTo(0, document.body.scrollHeight)
                    })
                  }}
                >
                  {(!loading) && 'Carregar mais'}
                  {(loading) && (
                    <img src={Spinner.src} width="30px" height="30px" />
                  )}
                </Button>
              )}
              {(books.length === 0 && search.current.length > 0) && (
                <Text
                  fontSize="25px"
                  marginTop="25px"
                >
                  Nenhum livro fora encontrado
                </Text>
              )}
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
  const search = context.query.search?.toString() || ''
  const multi = (() => {
    const n = parseInt(context.query.multi?.toString() || '')
    return n > 0 ? n : 1
  })()
  const IndexProps = await getIndexProps(session?.userID || '', search, multi)
  return {
    props: {
      ...IndexProps,
      multi: multi,
      search: search
    }
  }
}

export default Index