// ** Third Party Components
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import arrowRun from '@src/assets/images/singleline/arrow-down-run.svg'
import arrowOff from '@src/assets/images/singleline/arrow-down-off.svg'
import arrowWarning from '@src/assets/images/singleline/arrow-down-warning.svg'
import Media from 'reactstrap/es/Media'
import cn from 'classnames'
import imgMCCBACB from '@src/assets/images/singleline/MCCBACB.svg'
import imgMCCBACBOff from '@src/assets/images/singleline/MCCBACB-off.svg'

const InverterStatus = ({
  inverterSingle1,
  inverterSingle2,
  isShowInverterMultiline,
  numberOrder,
  isShowMCCBACB,
  isShowMCCBACBOff,
  classNameStatus,
  classNameInverter1,
  classNameInverter2,
  status,
  isShowArrowRun,
  isShowArrowOff,
  isShowArrowWarning,
  inverter1,
  inverter2
}) => {
  const [isShowInverterParams, setIsShowInverterParams] = useState(false)

  const renderArrowImage = () => {
    switch (true) {
      case isShowArrowRun === true:
        return arrowRun

      case isShowArrowWarning === true:
        return arrowWarning

      case isShowArrowOff === true:
      default:
        return arrowOff
    }
  }

  return (
    <Media className='inverter-status'>
      <div className='number'>
        <img
          id='singleLineArrowImage'
          className={cn('img-fluid', { ['rotate-180']: isShowInverterParams })}
          src={renderArrowImage()}
          alt='arrowRun'
          onClick={() => setIsShowInverterParams(!isShowInverterParams)}
        />

        <span className={cn('number-text mb', classNameInverter1)}>{inverter1}</span>
        <span className={cn('number-text', classNameInverter2)}>{inverter2}</span>

        {
          isShowInverterParams && isShowInverterMultiline && (
            <aside className='dropdown-text d-flex justify-content-center'>
              <div>{inverterSingle1}</div>
              <div>{inverterSingle2}</div>
            </aside>
          )
        }

      </div>

      <aside className='align-items-center'>
        <span className='number-order'>{numberOrder}</span>
        {isShowMCCBACB && !isShowMCCBACBOff && (
          <span className='line-run'>
            <img className='img-fluid' width='10' src={imgMCCBACB} alt='imgMCCBACB' />
          </span>
        )}

        {isShowMCCBACBOff && !isShowMCCBACB && (
          <span className='line-off'>
            <img className='img-fluid' width='14' src={imgMCCBACBOff} alt='imgMCCBACBOff' />
          </span>
        )}
        <span className={cn('number-text status-text', classNameStatus)}>{status}</span>
      </aside>
    </Media>
  )
}

InverterStatus.propTypes = {
  inverterSingle1: PropTypes.any,
  inverterSingle2: PropTypes.any,
  isShowInverterMultiline: PropTypes.any,
  numberOrder: PropTypes.any,
  isHideTextInverter: PropTypes.any,
  isShowMCCBACBOff: PropTypes.any,
  isShowMCCBACB: PropTypes.any,
  classNameInverter1: PropTypes.any,
  classNameInverter2: PropTypes.any,
  classNameStatus: PropTypes.any,
  status: PropTypes.any,
  isShowArrowRun: PropTypes.any,
  isShowArrowOff: PropTypes.any,
  isShowArrowWarning: PropTypes.any,
  inverter1: PropTypes.any,
  inverter2: PropTypes.any
}

export default InverterStatus
