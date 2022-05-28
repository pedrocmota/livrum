import React from 'react'
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap'
import {Flex, Image, Link as A} from '@chakra-ui/react'
import Link from 'next/link'
import ActiveLink from './ActiveLink'
import {treatName} from '../utils/data'

interface IMenubar {
  name?: string,
  picture?: string,
  isAdmin?: boolean
}

const Menubar: React.FunctionComponent<IMenubar> = (props) => {
  const {firstName, lastName} = treatName(props.name || '')
  const url = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_SESSION_URI}&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email`
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link href="/">
            <a>GSECEE Livrum</a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {(props.name) && (
              <>
                <Nav.Link as="span">
                  <ActiveLink href="/emprestimos">
                    <a>Todos os empréstimos</a>
                  </ActiveLink>
                </Nav.Link>
                <Nav.Link as="span">
                  <ActiveLink href="/emprestimos/meus">
                    <a>Meus empréstimos</a>
                  </ActiveLink>
                </Nav.Link>
                {(props.isAdmin == true) && (
                  <>
                    <Nav.Link as="span">
                      <ActiveLink href="/editar/biblioteca">
                        <a>Editar biblioteca</a>
                      </ActiveLink>
                    </Nav.Link>
                    <Nav.Link as="span">
                      <ActiveLink href="/editar/usuarios">
                        <a>Editar usuários</a>
                      </ActiveLink>
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
          <Nav>
            <>
              {(props.name) && (
                <>
                  <NavDropdown title={(
                    <Flex
                      alignItems="center"
                    >
                      <Image
                        src={props.picture}
                        width="34px"
                        height="34px"
                        borderRadius="50%"
                        marginRight="10px"
                      />
                      <div>{firstName} {lastName}</div>
                    </Flex>
                  )} id="collasible-nav-dropdown">
                    <NavDropdown.Item as="div">
                      <Link href="/api/logout">
                        Deslogar
                      </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              {(!props.name) && (
                <>
                  <A
                    href={url}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="160px"
                    height="32px"
                    backgroundColor="transparent"
                    border="1px solid #E2E2E2"
                    color="#ffffff"
                    borderRadius="3px"
                    cursor="pointer"
                    marginTop="9px"
                    marginBottom="9px"
                    _hover={{
                      color: '#ffffff !important'
                    }}
                  >
                    Fazer login
                  </A>
                </>
              )}
            </>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menubar