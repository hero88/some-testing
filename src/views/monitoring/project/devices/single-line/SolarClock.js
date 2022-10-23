// ** Third Party Components
import React from 'react'
import PropTypes from 'prop-types'
import Media from 'reactstrap/es/Media'
import cn from 'classnames'
import customer from '@src/assets/images/singleline/customer.svg'
import lineCustomer from '@src/assets/images/singleline/line-customer.svg'
import imgMCCBACB from '@src/assets/images/singleline/MCCBACB.svg'
import GridSolar from './GridSolar'

const SolarClock = ({
  title,
  classNameLeftLine,
  textCustomer,
  isShowLeftLine,
  className,
  singleNo1,
  singleNo2,
  bottomText,
  totalActiveEnergy,
  totalActiveEnergySub,
  realActivePower3SubphaseTotal,
  isSolarMeter,
  isShowNode,
  isShowCustomer
}) => {
  return (
    <Media className={cn('solar-clock', className, { 'solar-clock--not-show-customer': !isShowCustomer })}>

      {/* line-customer */}
      {
        isShowCustomer &&
        <div className='line-customer'>
          <div className='mask-bg'/>
          <img
            className='img-fluid img-line'
            src={lineCustomer}
            alt='lineCustomer'
          />
          <div className='customer'>
            <img
              className='img-fluid'
              src={customer}
              alt='Customer'
            />
            <span className='title mb'>{textCustomer}</span>
          </div>
        </div>
      }

      {/* right line */}
      <div className='line-wrapper'>
        <img
          className='img-fluid width-auto img-mccb'
          src={imgMCCBACB}
          alt='imgMCCBACB'
        />
        <div className={cn('vertical-line-right', { ['vertical-line-right--not-show-customer']: !isShowCustomer })}/>
        <div className={cn('right-line', { ['right-line--hide']: !isShowNode && isSolarMeter })}/>
      </div>

      <GridSolar
        isShowNode={isShowNode}
        isShowInverterLeft
        isShowMultiRight
        isShowArrowRight
        title={title}
        singleNo1={singleNo1}
        singleNo2={singleNo2}
        isShowCos
        bottomText={bottomText}
        totalActiveEnergy={totalActiveEnergy}
        totalActiveEnergySub={totalActiveEnergySub}
        realActivePower3SubphaseTotal={realActivePower3SubphaseTotal}
        isSolarMeter={isSolarMeter}
      />

      {/* left line */}
      {isShowLeftLine && (
        <div className='line-wrapper'>
          <div className={cn('left-line', classNameLeftLine)}/>
          <div className='vertical-line'/>
        </div>
      )}
    </Media>
  )
}

SolarClock.propTypes = {
  title: PropTypes.any,
  classNameLeftLine: PropTypes.any,
  classNameGroup: PropTypes.any,
  textCustomer: PropTypes.any,
  singleNo1: PropTypes.any,
  singleNo2: PropTypes.any,
  isShowNumberSingleLeft: PropTypes.any,
  isShowNumberSingleRight: PropTypes.any,
  isShowLeftLine: PropTypes.any,
  isShowMCCBACB: PropTypes.any,
  className: PropTypes.any,
  isShowCos: PropTypes.any,
  isShowNumberClockRight: PropTypes.any,
  isShowNumberClockLeft: PropTypes.any,
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
  isShowNode: PropTypes.bool,
  isShowCustomer: PropTypes.bool
}

export default SolarClock
