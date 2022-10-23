/* eslint no-unused-vars: 0 */  // --> OFF
// ** React Imports
import { useEffect, useState } from 'react'

// ** Third party components
import PropTypes from 'prop-types'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

const BlankLayout = ({ children, ...rest }) => {
  // ** Hooks
  const [skin, setSkin] = useSkin()

  // ** States
  const [isMounted, setIsMounted] = useState(false)

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className='blank-page'>
      <div className='app-content content'>
        <div className='content-wrapper'>
          <div className='content-body'>{children}</div>
        </div>
      </div>
    </div>
  )
}

BlankLayout.propTypes = {
  children: PropTypes.node
}

export default BlankLayout
