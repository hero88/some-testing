// ** Third Party Components
import React, {} from "react"
import PropTypes from 'prop-types'
import Media from "reactstrap/es/Media"

const GridPV = ({textPV}) => {

  return (
    <Media className='grid-PV'>
      {/*<span className='line'/>*/}
      <span className='text'>{textPV}</span>
    </Media>
  )
}

GridPV.propTypes = {
  textPV: PropTypes.any
}

export default GridPV