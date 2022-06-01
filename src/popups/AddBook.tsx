import {useState} from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Image, Input} from '@chakra-ui/react'
import Categories from '../components/Categories'
import {toasts} from '../pages/_app'
import {IAddBook as IAddBookType} from '../pages/api/addBook'

export const showAddBook = (closeCallback: () => void) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Adicionar livro',
    html: <EditBook closeCallback={closeCallback} />,
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

interface IAddBook {
  closeCallback: () => void
}

const EditBook: React.FunctionComponent<IAddBook> = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [categories, setCategories] = useState('')
  const [stock, setStock] = useState(0)
  const [img, setImg] = useState('')
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
    if (!Number.isInteger(stock) || isNaN(stock) || stock <= 0) {
      return false
    }
    return true
  })()
  const {addToast} = toasts

  const fileInputUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      }).then(async (data) => {
        setImg(data)
      }).catch(() => {
        addToast('Houve um erro ao enviar o arquivo', {
          appearance: 'error'
        })
      })
    }
  }

  const addBook = async () => {
    setLoading(true)
    await axios.post<any, any, IAddBookType>('/api/addBook', {
      title: title,
      author: author,
      categories: categories,
      stock: stock.toString() as any,
      image: img
    }).then(() => {
      setLoading(false)
      addToast('Livro adicionado com sucesso!', {
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
          onChange={(e) => fileInputUpload(e)}
        />
        <Image
          id="bookImage"
          src={img.length > 0 ? img : '/noPhoto.png'}
          width="150px"
          height="180px"
          backgroundColor="#F1F1F1"
          onError={() => {
            setImg('')
            addToast('Arquivo inválido', {
              appearance: 'error'
            })
          }}
        />
        {(img.length > 0 && (
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
              setImg('')
            }}
          >
            X
          </Button>
        ))}
      </Box>
      <Input
        id="bookName"
        type="text"
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
        autoFocus
        onChange={(e) => {setTitle(e.target.value)}}
      />
      <Input
        id="authorName"
        type="text"
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
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key) || event.currentTarget.value.length > 6) {
            event.preventDefault()
          }
        }}
        onChange={(e) => {setStock(parseInt(e.target.value))}}
      />

      <Box marginTop="20px">
        <Button
          type="submit"
          width="150px"
          height="35px"
          backgroundColor="#009879"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          disabled={!validButton}
          onClick={addBook}
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
          Adicionar livro
        </Button>
        <Button
          width="150px"
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
      </Box>
    </Flex>
  )
}