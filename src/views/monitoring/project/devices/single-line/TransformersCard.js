// ** Third Party Components
import React, {} from 'react'
import PropTypes from 'prop-types'
import Media from 'reactstrap/es/Media'
import cn from 'classnames'
import arrowUp from '@src/assets/images/singleline/arrow-up.svg'
import EVNimg from '@src/assets/images/singleline/EVN.svg'
import solarClock from '@src/assets/images/singleline/solar-clock.svg'

const TransformersCard = ({
  className2Clock,
  className,
  leftText,
  imgSrc,
  rightText,
  isShow2ndTransformer,
  isShow2ndGroup,
  connectedPoint
}) => {
  return (
    <div className={cn('branch-main', className2Clock)}>
      <Media className={cn('evn-grid', className)}>
        <img className='img-fluid evn' src={EVNimg} alt='EVNimg' />
        <img className='img-fluid up' src={arrowUp} alt='arrowUp' />
        {connectedPoint && <span className='right-text'>{connectedPoint}</span>}
      </Media>
      <div className='env-clock'>
        <div className='evn-img'>
          <span className='title'>EVN</span>
          <img className='img-fluid' width='45px' src={solarClock} alt='solarClock' />
        </div>
        <div className='line' />
      </div>
      <Media className='transformers-card'>
        <div className='transformers-card-wrapper'>
          <div className='mask' />
          <Media className='card-left'>
            <span className='left-text'>{leftText}</span>
            <div className='line-clock'>
              <span className='line' />
              <img className='img-fluid' src={imgSrc} alt='imgSrc' />
              <span className='line' />
            </div>
          </Media>
          <Media className={cn('card-right', { ['d-none']: !isShow2ndTransformer })}>
            <div className='top-line' />
            <div className='line-clock'>
              {/*<span className='line' />*/}
              <img className='img-fluid' src={imgSrc} alt='imgSrc' />
              {
                isShow2ndGroup &&
                <span className='line' />
              }
            </div>
            <span className='right-text'>{rightText}</span>
          </Media>
        </div>
      </Media>
      {/*<div className='mask2' />*/}
    </div>
  )
}

TransformersCard.propTypes = {
  title: PropTypes.any,
  className2Clock: PropTypes.any,
  className: PropTypes.any,
  leftText: PropTypes.any,
  imgSrc: PropTypes.any,
  rightText: PropTypes.any,
  isShow2ndTransformer: PropTypes.bool,
  isShow2ndGroup: PropTypes.bool,
  connectedPoint: PropTypes.string
}

export default TransformersCard
