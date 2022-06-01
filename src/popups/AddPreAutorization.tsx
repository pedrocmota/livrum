import {useState} from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Button, Input} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import {validateEmail} from '../utils/data'
import {IAddPreAuthorization} from '../pages/api/addPreAuthorization'

export const showAddPreAutorization = (callback: () => void) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Adicionar e-mail',
    html: <MakeLending callback={callback} />,
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

interface IAddPreAutorization {
  callback: () => void
}

const MakeLending: React.FunctionComponent<IAddPreAutorization> = (props) => {
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const {addToast} = toasts

  const sendPreAutorization = async () => {
    setLoading(true)
    await axios.post<any, any, IAddPreAuthorization>('/api/addPreAuthorization', {
      email: email,
      isAdmin: Number(isAdmin).toString()
    }).then(() => {
      setLoading(false)
      addToast('Autorização registrada com sucesso!', {
        appearance: 'success'
      })
      props.callback()
      Swal.close()
    }).catch((reason) => {
      setLoading(false)
      const status = reason.response?.status
      if (status === 409) {
        addToast('Esse e-mail já está autorizado', {
          appearance: 'error'
        })
      } else {
        addToast(`Houve um erro ao adicionar a autorização. Erro ${reason.response?.status}`, {
          appearance: 'error'
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
      <Input
        id="email"
        type="email"
        placeholder="Email"
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
        onChange={(e) => {setEmail(e.target.value)}}
      />
      <Flex
        width="100%"
        alignItems="center"
        marginTop="12px"
        marginBottom="6px"
      >
        <Input
          type="checkbox"
          checked={isAdmin}
          id="isAdmin"
          name="isAdmin"
          width="20px"
          height="20px"
          marginRight="8px"
          onChange={(e) => {
            setIsAdmin(e.currentTarget.checked)
          }}
        />
        <label htmlFor="isAdmin">É um adminstrador?</label>
      </Flex>
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
          disabled={!validateEmail(email) || loading}
          onClick={(e) => {
            e.preventDefault()
            sendPreAutorization()
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
          Adicionar e-mail
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