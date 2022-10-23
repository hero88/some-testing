// ** Third Party Components
import React, {} from "react"
import PropTypes from 'prop-types'
import Media from "reactstrap/es/Media"

const NoteItem = ({textNote, imgSrc}) => {

  return (
    <Media className='note-item'>
      <span className='img'><img className='img-fluid' src={imgSrc} alt='imgSrc'/></span>
      <span>{textNote}</span>
    </Media>
  )
}

NoteItem.propTypes = {
  imgSrc: PropTypes.any,
  textNote: PropTypes.any
}

export default NoteItem