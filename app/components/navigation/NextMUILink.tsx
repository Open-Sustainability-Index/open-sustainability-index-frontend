import NextLink from 'next/link'
import MUILink from '@mui/material/Link'

interface NextMUILinkProps {
  href: string
  children: React.ReactNode
  [key: string]: any
}

const NextMUILink = ({ href, children, ...props }: NextMUILinkProps): React.ReactElement => {
  return (
    <NextLink href={href} passHref>
      <MUILink component='span' {...props}>{children}</MUILink>
    </NextLink>
  )
}

export default NextMUILink
