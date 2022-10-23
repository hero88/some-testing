// ** Third Party Components
import React, {} from 'react'
import PropTypes from 'prop-types'
import imgMCCBACB from '@src/assets/images/singleline/MCCBACB.svg'
import GridSolar from './GridSolar'
import cn from 'classnames'

const MCCBACB = (
  {
    title,
    className,
    classNameOther,
    isShowLeftLine,
    isShowRightLine,
    singleNo1,
    singleNo2,
    bottomText,
    totalActiveEnergy,
    totalActiveEnergySub,
    realActivePower3SubphaseTotal,
    isShowNode
  }
) => {

  return (
    isShowNode
    ? <div className='MCCBACB-group'>
      {isShowRightLine && (
        <span className={cn('left-line-grid', classNameOther)} />
      )}

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
        className={className}
        totalActiveEnergy={totalActiveEnergy}
        totalActiveEnergySub={totalActiveEnergySub}
        realActivePower3SubphaseTotal={realActivePower3SubphaseTotal}
      />

      {isShowLeftLine && (
        <span className='right-line-grid'/>
      )}

      <div className='MCCBACB-line'>
        <span className='line'/>
        <img className='img-fluid' src={imgMCCBACB} alt='arrowUp'/>
        {/*<span className='line'/>*/}
      </div>

    </div>
    : <div className='empty-node'>&nbsp;</div>
  )
}

MCCBACB.propTypes = {
  title: PropTypes.any,
  className: PropTypes.any,
  classNameOther: PropTypes.any,
  isShowLeftLine: PropTypes.any,
  isShowRightLine: PropTypes.any,
  singleNo1: PropTypes.string,
  singleNo2: PropTypes.string,
  bottomText: PropTypes.string,
  totalActiveEnergy: PropTypes.string,
  totalActiveEnergySub: PropTypes.string,
  realActivePower3SubphaseTotal: PropTypes.string,
  isShowNode: PropTypes.bool
}

export default MCCBACB
