// ** Third Party Components
import React, {} from "react"
import PropTypes from 'prop-types'
import arrow from '@src/assets/images/singleline/arrow.svg'
import Media from "reactstrap/es/Media"

const NumberClock = ({textNumberClock, isShowArrowLeftNumberClock, isShowArrowRightNumberClock}) => {

  return (
    <Media className='number-clock'>
      {isShowArrowLeftNumberClock &&
      <img className='img-fluid up-arrow' src={arrow} alt='arrowGreen'/>
      }

      <span className='bottom-text'>{textNumberClock}</span>

      {isShowArrowRightNumberClock &&
      <img className='img-fluid down-arrow' src={arrow} alt='arrowGreen'/>
      }
    </Media>
  )
}

NumberClock.propTypes = {
  isShowArrowRightNumberClock: PropTypes.any,
  isShowArrowLeftNumberClock: PropTypes.any,
  textNumberClock: PropTypes.any
}

export default NumberClock