import {useState} from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Button, Input, Text, Textarea} from '@chakra-ui/react'
import DatePicker from 'react-datepicker'
// import {useRouter} from 'next/router'
import {toasts, router} from '../pages/_app'
import ptBR from 'date-fns/locale/pt-BR'
import {IBook} from '../models/IndexProps'
import {IUserDataObject} from '../types/global.d'
import {IAddLending} from '../pages/api/addLending'
import 'react-datepicker/dist/react-datepicker.css'

export const showMakeLending = (userData: IUserDataObject, book: IBook) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Realizar empréstimo',
    html: <MakeLending userData={userData} book={book} />,
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

interface IMakeLending {
  userData: IUserDataObject,
  book: IBook
}

const MakeLending: React.FunctionComponent<IMakeLending> = (props) => {
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(new Date())
  const [indefiniteDate, setIndefiniteDate] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const {addToast} = toasts
  const {push} = router

  const valid = (() => {
    if (!indefiniteDate) {
      return deliveryDate !== null
    }
    return true
  })()

  const sendLending = async () => {
    setLoading(true)
    await axios.post<any, any, IAddLending>('/api/addLending', {
      bookID: props.book.id,
      maxDate: (deliveryDate ? deliveryDate.getTime() / 1000 : '0').toString(),
      notes: notes.split('\n').join('<br>')
    }).then(() => {
      setLoading(false)
      Swal.close()
      push('/emprestimos/meus')
      addToast('Empréstimo realizado com sucesso!', {
        appearance: 'success'
      })
    }).catch((reason) => {
      setLoading(false)
      addToast(`Houve um erro ao fazer o empréstimo. Erro ${reason.response?.status}`, {
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
      <Flex
        width="100%"
        flexDirection="column"
        justifyContent="left"
      >
        <Text
          textAlign="left"
        >
          Livro: <b>{props.book.title}</b>
        </Text>
        <Flex
          alignItems="center"
        >
          <Input
            type="checkbox"
            checked={indefiniteDate}
            id="undefinedDate"
            name="undefinedDate"
            width="20px"
            height="20px"
            marginRight="8px"
            onChange={(e) => {
              setIndefiniteDate(e.currentTarget.checked)
              if (e.currentTarget.checked) {
                setDeliveryDate(null)
              }
            }}
          />
          <label htmlFor="undefinedDate">Data máxima indefinida</label>
        </Flex>
      </Flex>
      <DatePicker
        placeholderText="Data máxima de entrega"
        dateFormat="dd/MM/yyyy"
        selected={deliveryDate}
        minDate={new Date()}
        onChange={(date) => setDeliveryDate(date)}
        locale={ptBR}
        disabled={indefiniteDate}
        customInput={
          <Input
            id="date"
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
          />
        }
      />
      <Textarea
        placeholder="Notas adicionais"
        value={notes}
        width="100%"
        height="120px"
        padding="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        resize="none"
        marginTop="10px"
        onChange={(e) => setNotes(e.currentTarget.value)}
      />
      <Flex
        width="100%"
        justifyContent="center"
        marginTop="15px"
        sx={{
          '@media screen and (max-width: 476px)': {
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
          disabled={!valid || loading}
          onClick={(e) => {
            e.preventDefault()
            sendLending()
          }}
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
          Finalizar empréstimo
        </Button>
        <Button
          width="190px"
          height="35px"
          backgroundColor="#CE505B"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          disabled={loading}
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
          Cancelar
        </Button>
      </Flex>
    </Flex>
  )
}