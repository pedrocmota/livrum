import React from 'react'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

interface IActiveLink {
  href: string,
  children: any
}

const ActiveLink: React.FunctionComponent<IActiveLink> = ({href, children}) => {
  const router = useRouter()
  let className = children?.props?.className || ''

  if (router.pathname === href) {
    className = `${className} active`
  }

  return (
    <NextLink href={href}>
      {React.cloneElement(children, {className})}
    </NextLink>
  )
}

export default ActiveLink