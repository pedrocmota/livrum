import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Image, Text, Table, Tbody, Tr, Td} from '@chakra-ui/react'
import {showMakeLending} from './MakeLending'
import {IBook} from '../models/IndexProps'
import {IUserDataObject} from '../types/global.d'

export const showBook = (userData: IUserDataObject, book: IBook) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: '',
    html: <ShowBook userData={userData} book={book} />,
    showDenyButton: false,
    showConfirmButton: false,
    showClass: {
      popup: 'animate__animated animate__zoomIn'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut'
    }
  })
}

interface IShowBook {
  userData: IUserDataObject,
  book: IBook
}

const ShowBook: React.FunctionComponent<IShowBook> = ({userData, book}) => {
  return (
    <Flex
      as="form"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      marginTop="15px"
    >
      <Box
        position="relative"
        marginBottom="20px"
      >
        <Image
          id="bookImage"
          src={`/api/getBookImage?bookID=${book.id}`}
          width="110px"
          height="130px"
          backgroundColor="#F1F1F1"
        />
      </Box>
      <Box
        width="100%"
        marginTop="20px"
      >
        <Text as="h1"
          fontSize="25px"
          fontWeight="bold"
        >
          {book.title}
        </Text>
        <Flex
          width="100%"
          overflowX="auto"
          marginBottom="20px"
        >
          <Table
            width="100%"
            marginTop="10px"
            whiteSpace="nowrap"
            __css={{
              '& .left': {
                textAlign: 'left'
              },
              '& .right': {
                textAlign: 'right'
              },
              '& tr': {
                height: '40px'
              }
            }}
          >
            <Tbody>
              <Tr>
                <Td className="left">Autor:</Td>
                <Td className="right">{book.author}</Td>
              </Tr>
              <Tr>
                <Td className="left">Categoria(s):</Td>
                <Td className="right">{book.categories}</Td>
              </Tr>
              <Tr>
                <Td className="left">Estoque total:</Td>
                <Td className="right">{book.stock}</Td>
              </Tr>
              <Tr>
                <Td className="left">Quantidade emprestada:</Td>
                <Td className="right">{book.borrowed}</Td>
              </Tr>
              <Tr>
                <Td className="left">Quantidade disponível:</Td>
                <Td className="right">{book.stock - book.borrowed}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Flex>
        <Flex
          width="100%"
          justifyContent="center"
          sx={{
            '@media screen and (max-width: 462px)': {
              flexDirection: 'column',
              '& button': {
                width: '100%',
                marginLeft: '0px',
                marginTop: '10px'
              }
            }
          }}
        >
          <Button
            type="submit"
            width="190px"
            height="35px"
            backgroundColor="#009879"
            border="0"
            borderRadius="2px"
            color="#ffffff"
            disabled={!userData.isLogged || (book.stock - book.borrowed === 0)}
            onClick={() => showMakeLending(userData, book)}
            _disabled={{
              backgroundColor: '#9B9191 !important'
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
            Pegar emprestado
          </Button>
          <Button
            width="190px"
            height="35px"
            backgroundColor="#CE505B"
            border="0"
            borderRadius="2px"
            color="#ffffff"
            marginLeft="10px"
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
            onClick={() => Swal.close()}
          >
            Fechar
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}