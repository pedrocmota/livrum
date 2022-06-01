import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import {format} from 'date-fns'
import {Flex, Box, Button, Image, Text, Table, Tbody, Tr, Td, Textarea} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import {IMyLending} from '../models/MyLendingProps'
import {IUserDataObject} from '../types/global.d'
import {IFinishLending} from '../pages/api/finishLending'

export const showLending = (
  userData: IUserDataObject, lending: IMyLending, isDeletable: boolean, closeCallback: () => void
) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: '',
    html: <ShowLending userData={userData} lending={lending} isDeletable={isDeletable} closeCallback={closeCallback} />,
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

interface IShowLending {
  userData: IUserDataObject,
  lending: IMyLending,
  isDeletable: boolean,
  closeCallback: () => void
}

const ShowLending: React.FunctionComponent<IShowLending> = (props) => {
  const {addToast} = toasts

  const finishLending = () => {
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
        axios.post<any, any, IFinishLending>('/api/finishLending', {
          lendingID: props.lending.id
        }).then(() => {
          Swal.close()
          props.closeCallback()
          return addToast('Empréstimo finalizado com sucesso!', {
            appearance: 'success'
          })
        }).catch((reason) => {
          addToast(`Houve um erro ao finalizar o empréstimo. Erro ${reason.response?.status}`, {
            appearance: 'error'
          })
        })
      }
    })
  }

  const deleteLending = () => {
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
        axios.delete<any, any, IFinishLending>('/api/deleteLending', {
          data: {
            lendingID: props.lending.id
          }
        }).then(() => {
          Swal.close()
          props.closeCallback()
          return addToast('Empréstimo deletado com sucesso!', {
            appearance: 'success'
          })
        }).catch((reason) => {
          addToast(`Houve um erro ao deletar o empréstimo. Erro ${reason.response?.status}`, {
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
        <Image
          id="bookImage"
          src={`/api/getBookImage?bookID=${props.lending.book}`}
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
          {props.lending.bookTitle}
        </Text>
        <Flex
          width="100%"
          overflowX="auto"
          {...((props.lending.notes.length === 0) && {
            marginBottom: '20px'
          })}
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
                <Td className="left">Pego em:</Td>
                <Td className="right">{format(props.lending.borrowedAt * 1000, 'dd/MM/yyyy HH:mm')}</Td>
              </Tr>
              <Tr>
                <Td className="left">Data prevista p. devolução:</Td>
                <Td className="right">
                  {(props.lending.maxDate === 0) && (
                    'Indefinida'
                  )}
                  {(props.lending.maxDate > 0) && (
                    <>{format(props.lending.maxDate * 1000, 'dd/MM/yyyy')}</>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Td className="left">Estado:</Td>
                <Td className="right">
                  {(props.lending.status === 0) && (
                    'Ativo'
                  )}
                  {(props.lending.status === 1) && (
                    'Finalizado'
                  )}
                </Td>
              </Tr>
              {(props.lending.notes.length > 0) && (
                <Tr>
                  <Td className="left">Notas:</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Flex>
        {(props.lending.notes.length > 0) && (
          <Textarea
            placeholder="Notas adicionais"
            defaultValue={props.lending.notes.replaceAll('<br>', '\n')}
            readOnly={true}
            width="100%"
            height="120px"
            padding="6px"
            border="1px solid #DADADA"
            borderRadius="3px"
            resize="none"
            marginTop="2px"
            marginBottom="15px"
          />
        )}
        <Flex
          width="100%"
          justifyContent="center"
          {...((props.isDeletable && props.userData.isAdmin) && {
            flexDirection: 'column',
            sx: {
              '& button': {
                width: '100%',
                marginLeft: '0px',
                marginTop: '8px'
              }
            }
          })}
          {...(!(props.isDeletable && props.userData.isAdmin) && {
            sx: {
              ...((props.isDeletable && props.userData.isAdmin) && {
                flexDirection: 'column'
              }),
              '@media screen and (max-width: 462px)': {
                flexDirection: 'column',
                '& button': {
                  width: '100%',
                  marginLeft: '0px',
                  marginTop: '10px'
                }
              }
            }
          })}
        >
          {(props.lending.user === props.userData.id && props.lending.status === 0) && (
            <Button
              type="submit"
              width="200px"
              height="35px"
              backgroundColor="#009879"
              border="0"
              borderRadius="2px"
              color="#ffffff"
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
              onClick={() => finishLending()}
            >
              Finalizar empréstimo
            </Button>
          )}
          {(props.isDeletable && Boolean(props.userData.isAdmin)) && (
            <Button
              width="200px"
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
              onClick={() => deleteLending()}
            >
              Apagar empréstimo
            </Button>
          )}
          <Button
            width="200px"
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