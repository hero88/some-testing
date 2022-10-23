// ** Icons Import
import packageJson from '@src/../package.json'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'

const Footer = () => {
  const history = useHistory()
  return (
    (
      history.location.pathname === ROUTER_URL.LOGIN
      || history.location.pathname === ROUTER_URL.HOME
      || history.location.pathname === ROUTER_URL.MAP
    )
    && <>
      <span className=''>
        Copyright © {new Date().getFullYear()}{' '}
        <a href='https://www.reecorp.com/' target='_blank' rel='noopener noreferrer'>
          REE Corp
        </a>
        <span className='d-none d-sm-inline-block'>&nbsp;- All rights Reserved</span>
      </span>
      <span className='d-none d-md-block'>
        &nbsp; - Version: {packageJson.version}
        {
          process.env.REACT_APP_ENVIRONMENT !== 'PRODUCTION'
            ? ` - ${process.env.REACT_APP_ENVIRONMENT}`
            : ''
        }
      </span>
    </>
  )
}

export default Footer
