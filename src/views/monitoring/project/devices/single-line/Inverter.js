// ** Third Party Components
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Media from 'reactstrap/es/Media'
import inverterImg from '@src/assets/images/singleline/inverter.svg'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { useQuery } from '@hooks/useQuery'
import { numberWithCommas } from '@utils'
import { NORMAL_CHARACTER } from '@constants/regex'

const Inverter = ({ inverter }) => {
  const history = useHistory()
  const query = useQuery()
  const projectId = query.get('projectId')
  const [popoverOpen, setPopoverOpen] = useState(false)

  const validId = inverter.id.replaceAll(NORMAL_CHARACTER, '')

  return (
    <Media className='inverter'>
      <img
        id={`inverter_${validId}`}
        className='img-fluid up cursor-pointer'
        src={inverterImg}
        alt='arrowUp'
        onClick={() => {
          history.push({
            pathname: ROUTER_URL.PROJECT_INVERTER_DETAIL,
            search: `projectId=${projectId}&deviceId=${inverter.id}&typeModel=${inverter.typeModel}`
          })
        }}
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
      />
      <Popover
        placement='top'
        target={`inverter_${validId}`}
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(!popoverOpen)}
      >
        <PopoverHeader>
          {inverter.name}
        </PopoverHeader>
        <PopoverBody>
          <div><FormattedMessage id='Device S/N' />: {inverter.serialNumber}</div>
          <div><FormattedMessage id='Manufacturer' />: {inverter?.inverterType?.manufacturer}</div>
          <div><FormattedMessage id='Model' />: {inverter?.inverterType?.inverterModel}</div>
          <div><FormattedMessage id='Power' />: {numberWithCommas(inverter?.inverterType?.power / 1000, 0)} (kW)</div>
        </PopoverBody>
      </Popover>
    </Media>
  )
}

Inverter.propTypes = {
  textPV: PropTypes.any,
  inverter: PropTypes.object
}

export default Inverter
