// ** Third Party Components
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Media from 'reactstrap/es/Media'
import solarClock from '@src/assets/images/singleline/solar-clock.svg'
import arrowGreen from '@src/assets/images/singleline/arrow-down-run.svg'
import CardText from 'reactstrap/es/CardText'
import NumberClock from './NumberClock'
import cn from 'classnames'

const GridSolar = (
  {
    className,
    singleNo1,
    singleNo2,
    isShowMultiLeft,
    isShowMultiRight,
    isShowCos,
    title,
    isShowInverterLeft,
    isShowInverterRight,
    bottomText,
    isShowArrowRight,
    isShowArrowLeft,
    totalActiveEnergy,
    totalActiveEnergySub,
    realActivePower3SubphaseTotal,
    isSolarMeter,
    isShowNode
  }
) => {
  const [isShowLeftDropdown, setIsShowLeftDropdown] = useState(true)
  const [isShowRightDropdown, setIsShowRightDropdown] = useState(false)

  return (
    isShowNode
    ? <div className={cn('solar-clock', className)}>
      {/* number left */}
      <CardText tag='div' className='number-clock-wrapper'>
        {
          isShowInverterLeft && (isShowLeftDropdown || isSolarMeter)
          ? <>
            <NumberClock isShowArrowLeftNumberClock textNumberClock={`${totalActiveEnergy} kWh`} />
            <NumberClock isShowArrowRightNumberClock textNumberClock={`${totalActiveEnergySub} kWh`} />
            <NumberClock isShowArrowLeftNumberClock textNumberClock={`${realActivePower3SubphaseTotal} kW`} />
          </>
          : <>&nbsp;</>
        }
      </CardText>
      {/* number single right */}
      {isShowMultiLeft && (
        <div className='bottom-text mr-single-no d-flex flex-column'>
          <span>{singleNo1}</span>
          <span>{singleNo2}</span>
        </div>
      )}
      {/* clock */}
      <Media className='img-clock-wrapper'>
        {
          isShowArrowLeft &&
          <img
            className={
              cn('img-fluid arrow cursor-pointer', { [`rotate-180`]: isShowLeftDropdown })
            }
            src={arrowGreen} alt='arrowGreen'
            onClick={() => setIsShowLeftDropdown(!isShowLeftDropdown)}
          />
        }
        <div className='img-clock'>
          <div className='title'>{title}</div>
          <img className='img-fluid large' src={solarClock} alt='solarClock' />
          {isShowCos && !isSolarMeter && (
            <aside className='cos'>
              <span>Cos φ</span>
              <span className='bottom-text'>{bottomText}</span>
            </aside>
          )}
        </div>
        {
          isShowArrowRight &&
          <img
            className={
              cn('img-fluid arrow cursor-pointer', { [`rotate-180`]: isShowRightDropdown })
            }
            src={arrowGreen} alt='arrowGreen'
            onClick={() => setIsShowRightDropdown(!isShowRightDropdown)}
          />
        }
      </Media>

      {/* number single right */}
      {
        isShowMultiRight && isShowRightDropdown
        ? <div className='bottom-text ml-single-no d-flex flex-column'>
          <div>{singleNo1}</div>
          <div>{singleNo2}</div>
          {
            isSolarMeter && <div>{bottomText}</div>
          }
        </div>
        : <div className='right-place-holder'>&nbsp;</div>
      }

      {isShowInverterRight && (
        <CardText tag='div' className='number-clock-wrapper'>
          <NumberClock isShowArrowLeftNumberClock textNumberClock='50 kWh' />
          <NumberClock isShowArrowRightNumberClock textNumberClock='300 kWh' />
          <NumberClock isShowArrowLeftNumberClock textNumberClock='80 kWh' />
        </CardText>
      )}
    </div>
    : isSolarMeter
      ? <div className='empty-node__solar'>&nbsp;</div>
      : <div className='empty-node'>&nbsp;</div>
  )
}

GridSolar.propTypes = {
  classNameLeftLine: PropTypes.any,
  classNameGroup: PropTypes.any,
  textCustomer: PropTypes.any,
  isShowCustomer: PropTypes.any,
  singleNo1: PropTypes.any,
  singleNo2: PropTypes.any,
  isShowMultiLeft: PropTypes.any,
  isShowMultiRight: PropTypes.any,
  isShowLeftLine: PropTypes.any,
  isShowMCCBACB: PropTypes.any,
  className: PropTypes.any,
  isShowCos: PropTypes.any,
  title: PropTypes.any,
  isShowInverterRight: PropTypes.any,
  isShowInverterLeft: PropTypes.any,
  imgClock: PropTypes.any,
  imgClockSmall: PropTypes.any,
  isShowArrowRight: PropTypes.any,
  isShowArrowLeft: PropTypes.any,
  bottomText: PropTypes.any,
  imgSrc: PropTypes.any,
  rightText: PropTypes.any,
  totalActiveEnergy: PropTypes.string,
  totalActiveEnergySub: PropTypes.string,
  realActivePower3SubphaseTotal: PropTypes.string,
  isSolarMeter: PropTypes.bool,
  isShowNode: PropTypes.bool
}

export default GridSolar
