// ** React Imports
import React, { useContext, useState } from 'react'
// import { useHistory } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'

import {
  getDeviceTypeInverters
} from '@src/views/settings/device-types/inverter/store/actions'
import {
  getDeviceTypePanels
} from '@src/views/settings/device-types/panel/store/actions'

import { Input, Row, Col, Button, UncontrolledTooltip } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

// Custom components
import { USER_ABILITY } from '@constants/index'
import { AbilityContext } from '@src/utility/context/Can'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroup from 'reactstrap/es/InputGroup'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'

const InverterTable = ({ intl, addInverter, addPanel, deviceType }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch()

  const {
    deviceTypeInverter: data,
    deviceTypePanel: panel
  } = useSelector(state => state)

  const [searchValue, setSearchValue] = useState(data?.params?.q || ''),
    currentPage = 1,
    rowsPerPage = 10

  const fetchInverters = async (queryParam) => {
    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${data.params.order}`,
      state: 'ACTIVE',
      ...queryParam
    }
    await dispatch(getDeviceTypeInverters(initParam))
  }

  const fetchPanels = async (queryParam) => {
    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${panel.params.order}`,
      state: 'ACTIVE',
      ...queryParam
    }
    await dispatch(getDeviceTypePanels(initParam))
  }

  // ** Change search value
  const handleChangeInverterSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchInverters({ q: value })
    }
  }

  const handleChangePanelSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchPanels({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterInverterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchInverters()
    }
  }
  const handleFilterPanelKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchPanels()
    }
  }

  return (
    <Row>
      <Col lg={8} md='7'>
        <InputGroup className='input-group-merge'>
          <Input
            className=''
            type='search'
            bsSize='sm'
            id='search-input'
            value={searchValue}
            onChange={deviceType === 'Device types add new inverter' ? handleChangeInverterSearch : handleChangePanelSearch}
            onKeyPress={deviceType === 'Device types add new inverter' ? handleFilterInverterKeyPress : handleFilterPanelKeyPress}
            placeholder={`${intl.formatMessage({ id: 'Device type search text' })}`}
          />
          <InputGroupAddon addonType='append'>
            <InputGroupText>
              <IconSearch/>
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <UncontrolledTooltip placement='top' target={`search-input`}>
          {`${intl.formatMessage({ id: 'Device type search text' })}`}
        </UncontrolledTooltip>
      </Col>

      <Col lg={4} md='5' className='my-md-0 my-1'>
        {
          ability.can('manage', USER_ABILITY.MANAGE_INVERTER) &&
          <Button.Ripple
            color='primary'
            onClick={deviceType === 'Device types add new inverter' ? addInverter : addPanel}
            className='w-100'
          >
            <FormattedMessage
              id={deviceType === 'Device types add new inverter' ? 'Device types add new inverter' : 'Device types add new panel'}/>
          </Button.Ripple>
        }
      </Col>
    </Row>
  )
}

InverterTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addInverter: PropTypes.func.isRequired,
  addPanel: PropTypes.func.isRequired,
  deviceType: PropTypes.string.isRequired
}

export default injectIntl(InverterTable)
