import {useState} from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Image, Input} from '@chakra-ui/react'
import Categories from '../components/Categories'
import {toasts} from '../pages/_app'
import {INewIBookTable} from '../pages/api/getAllBooks'

export const showEditBook = (book: INewIBookTable, closeCallback: () => void) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Editar livro',
    html: <EditBook book={book} closeCallback={closeCallback} />,
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

interface IEditBook {
  book: INewIBookTable,
  closeCallback: () => void
}

const EditBook: React.FunctionComponent<IEditBook> = (props) => {
  const [book, setBook] = useState(props.book)
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [categories, setCategories] = useState(book.categories)
  const [stock, setStock] = useState(book.stock)
  const [loading, setLoading] = useState(false)
  const validButton = (() => {
    if (loading) {
      return false
    }
    if ((title.length < 3 || title.length > 400)) {
      return false
    }
    if ((author.length < 3 || author.length > 400)) {
      return false
    }
    if ((categories.length < 3 || categories.length > 400)) {
      return false
    }
    if (!Number.isInteger(stock)) {
      return false
    }
    if (
      book.title === title &&
      book.author === author &&
      book.categories === categories &&
      book.stock === stock) {
      return false
    }
    return true
  })()
  const {addToast} = toasts

  const getFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const file = files[0]
      if (file?.size > 800000) { //800KB
        return addToast('O tamanho do arquivo é inválido', {
          appearance: 'error'
        })
      }
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      }).then(async (src) => {
        sendFile(src, false)
      }).catch(() => {
        addToast('Houve um erro ao ler o arquivo', {
          appearance: 'error'
        })
      })
    }
  }

  const sendFile = (src: string, removed: boolean) => {
    axios.post('/api/sendBookImage', {
      bookID: book.id,
      data: src
    }).then(() => {
      const img = document.getElementById('bookImage') as any
      img!.src = img!.src + '&' + new Date().getTime()
      if (removed) {
        setBook({
          ...book,
          hasImage: 0
        })
        props.closeCallback()
        return addToast('Imagem removida com sucesso!', {
          appearance: 'success'
        })
      } else {
        setBook({
          ...book,
          hasImage: 1
        })
        props.closeCallback()
        return addToast('Imagem enviada com sucesso!', {
          appearance: 'success'
        })
      }
    }).catch(() => {
      addToast('Houve um erro ao enviar o arquivo', {
        appearance: 'error'
      })
    })
  }

  const editBook = async () => {
    setLoading(true)
    await axios.post<any, any, Omit<INewIBookTable, 'hasImage'>>('/api/editBookData', {
      id: book.id,
      title: title,
      author: author,
      categories: categories,
      stock: stock.toString() as any
    }).then(() => {
      setLoading(false)
      addToast('Livro atualizado com sucesso!', {
        appearance: 'success'
      })
      props.closeCallback()
      Swal.close()
    }).catch(() => {
      setLoading(false)
      addToast('Houve um erro ao atualizar o livro', {
        appearance: 'error'
      })
    })
  }

  const deleteBook = async () => {
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
        axios.delete('/api/deleteBook', {
          data: {
            id: book.id
          }
        }).then(() => {
          addToast('Livro deletado com sucesso!', {
            appearance: 'success'
          })
          props.closeCallback()
        }).catch(() => {
          addToast('Houve um erro ao deletar o livro', {
            appearance: 'error'
          })
        })
      }
    })
  }

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
        <Input
          type="file"
          name="fileInput"
          position="absolute"
          width="100%"
          height="100%"
          opacity="0%"
          cursor="pointer"
          onChange={(e) => getFile(e)}
        />
        <Image
          id="bookImage"
          src={`/api/getBookImage?bookID=${book.id}`}
          width="150px"
          height="180px"
          backgroundColor="#F1F1F1"
          alt={`Imagem de ${book.title}`}
        />
        {((book.hasImage === 1) && (
          <Button
            position="absolute"
            right="10px"
            top="10px"
            width="30px"
            height="30px"
            backgroundColor="rgba(0, 0, 0, 0.40)"
            color="#ffffff"
            border="none"
            borderRadius="50%"
            aria-label="Apagar imagem"
            onClick={() => {
              sendFile('DELETE', true)
            }}
          >
            X
          </Button>
        ))}
      </Box>
      <Input
        id="bookName"
        type="text"
        defaultValue={book.title}
        placeholder="Título do livro"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setTitle(e.target.value)}}
      />
      <Input
        id="authorName"
        type="text"
        defaultValue={book.author}
        placeholder="Nome do autor"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setAuthor(e.target.value)}}
      />
      <Input
        id="categories"
        name="categories"
        type="text"
        defaultValue={book.categories}
        placeholder="Categoria(s)"
        list="categories_list"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setCategories(e.target.value)}}
      />

      <Categories />

      <Input
        id="stock"
        type="number"
        placeholder="Estoque"
        defaultValue={book.stock}
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setStock(parseInt(e.target.value))}}
      />

      <Box marginTop="20px">
        <Button
          type="submit"
          width="140px"
          height="35px"
          backgroundColor="#009879"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          disabled={!validButton}
          onClick={editBook}
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
          Editar livro
        </Button>
        <Button
          width="140px"
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
          onClick={deleteBook}
        >
          Deletar livro
        </Button>
        <Button
          width="140px"
          height="35px"
          backgroundColor="#CE505B"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          marginLeft="10px"
          _disabled={{
            backgroundColor: '#9B9191'
          }}
          _hover={{
            backgroundColor: '#DD5E69'
          }}
          sx={{
            '@media screen and (max-width: 518px)': {
              width: '290px',
              marginTop: '10px',
              marginLeft: '0px'
            }
          }}
          onClick={() => Swal.close()}
        >
          Fechar
        </Button>
      </Box>
    </Flex>
  )
}