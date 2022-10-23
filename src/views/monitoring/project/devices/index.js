// ** Import react component
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Import Third party components
import DeviceCard from '@src/views/common/DeviceCard'
import { Col, Input, Label, Nav, NavLink, NavItem, Row, Button, ButtonGroup, UncontrolledTooltip } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import PropTypes from 'prop-types'
import { FilePlus, Grid, List, Loader, PlusSquare } from 'react-feather'

// ** Import custom components
import { getMeters } from '@src/views/monitoring/project/devices/meters/store/actions'
import { getInverters, getInverterTypes } from '@src/views/monitoring/project/devices/inverters/store/actions'
import Inverters from '@src/views/monitoring/project/devices/inverters'
import Meters from '@src/views/monitoring/project/devices/meters'
import Panels from '@src/views/monitoring/project/devices/panels'
import DeviceDetail from '@src/views/monitoring/project/devices/DeviceDetail'
import {
  DEVICE_TYPE,
  METER_TYPE_MODEL_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  TYPE_MODEL_OPTIONS
} from '@constants/project'
import { useQuery } from '@hooks/useQuery'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import SingleLine from '@src/views/monitoring/project/devices/single-line'
import CreatePanelByFile from '@src/views/monitoring/project/devices/panels/CreatePanelByFile'
import { STATE } from '@constants/common'
import { getPanelTypes } from '@src/views/monitoring/project/devices/panels/store/actions'

const Devices = ({ intl, setIsShowSideBar }) => {
  const dispatch = useDispatch(),
    query = useQuery()

  const projectId = query.get('projectId')

  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store
  const { inverter, meter, customerProject: { selectedProject } } = useSelector((state) => state)

  // ** States
  const [searchValue, setSearchValue] = useState(''),
    [active, setActive] = useState(DEVICE_TYPE.INVERTER),
    [isShowList, setIsShowList] = useState(false),
    [isShowDeviceModal, setIsShowDeviceModal] = useState(false),
    [isEditDevice] = useState(false),
    [currentDevice] = useState(null),
    [isShowSolarPanelList, setIsShowSolarPanelList] = useState(false),
    [statusFilter, setStatusFilter] = useState(undefined),
    [typeModelFilter, setTypeModelFilter] = useState(undefined),
    [isShowCreatePanelByFile, setIsShowCreatePanelByFile] = useState(false),
    [isShowSingleLine, setIsShowSingleLine] = useState(false)

  // Nav item
  const navItems = [
    { label: 'Inverters', value: DEVICE_TYPE.INVERTER },
    { label: 'Meters', value: DEVICE_TYPE.METER },
    { label: 'Single line', value: DEVICE_TYPE.SINGLE_LINE }
  ]

  // Fetch device APIs
  const fetchDevices = async (queryParam) => {
    const initParam = {
      q: searchValue,
      state: '*',
      fk: '*',
      projectId,
      ...queryParam
    }

    // ** Set data to store
    await Promise.all([dispatch(getInverters(initParam)), dispatch(getMeters(initParam))])
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([
      fetchDevices(),
      dispatch(getInverterTypes({ rowsPerPage: -1, state: STATE.ACTIVE })),
      dispatch(getPanelTypes({ rowsPerPage: -1, state: STATE.ACTIVE }))
    ])

    const isAddDevice = query.get('isAddDevice')

    if (isAddDevice) {
      setIsShowDeviceModal(true)
    }
  }, [])

  // ** Checking inverter and meter to show Single line
  useEffect(() => {
    if (selectedProject?.devices?.length > 0) {
      const tempInverters1 = []
      const dtuIds = []

      selectedProject.devices.forEach((device) => {
        if (device.dtuId && !dtuIds.some(item => item === device.dtuId)) {
          dtuIds.push(device.dtuId)
        }

        if (device.typeDevice === DEVICE_TYPE.INVERTER && device.state === STATE.ACTIVE) {
          if (device.dtuId === dtuIds[0]) {
            tempInverters1.push(device)
          }
        }
      })

      setIsShowSingleLine(tempInverters1.length > 0)
    }

  }, [selectedProject])

  const renderDevices = (items) => {
    return isShowList
           ? 'Table here'
           : items.map((item, index) => (
        <Col key={index} md={3}>
          <DeviceCard
            item={item}
            setIsShowSolarPanelList={setIsShowSolarPanelList}
            projectId={selectedProject?.id}
          />
        </Col>
      ))
  }

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchDevices({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await Promise.all([fetchDevices()])
    }
  }

  // ** Select change
  const onChangeSelect = async (option, event) => {
    const tempValue = option ? option.value : undefined

    if (event.name === 'status') setStatusFilter(tempValue)
    if (event.name === 'typeModel') setTypeModelFilter(tempValue)

    fetchDevices({
      status: event.name === 'status' ? tempValue : statusFilter,
      typeModel: event.name === 'typeModel' ? tempValue : typeModelFilter
    })
  }

  const toggle = (tab) => {
    setActive(tab)
  }

  useEffect(() => {
    // Don't show side bar while entering single line page
    setIsShowSideBar(active !== DEVICE_TYPE.SINGLE_LINE)
  }, [active])

  // ** Render nav items
  const renderNavItems = () => {
    return navItems.map((item) => {
      if (item.value === DEVICE_TYPE.SINGLE_LINE && !isShowSingleLine) {
        return null
      } else {
        return (
          <NavItem key={item.value}>
            <NavLink
              active={active === item.value}
              onClick={() => {
                toggle(item.value)
              }}
            >
              <FormattedMessage id={item.label} />
            </NavLink>
          </NavItem>
        )
      }
    })
  }

  return (
    <>
      <Row className='mb-2'>
        <Col md={2}>
          <ButtonGroup>
            {ability.can('manage', USER_ABILITY.MANAGE_DEVICE) && (
              <>
                <Button.Ripple
                  id='btnAddNewDevice'
                  className='btn-icon'
                  outline
                  color='primary'
                  onClick={() => setIsShowDeviceModal(true)}
                >
                  <PlusSquare size={18} />
                </Button.Ripple>
                <UncontrolledTooltip placement='top' target={'btnAddNewDevice'}>
                  <FormattedMessage id='Add new device' />
                </UncontrolledTooltip>
                <Button.Ripple
                  id='btnAddPanelCSV'
                  className='btn-icon'
                  outline
                  color='primary'
                  onClick={() => setIsShowCreatePanelByFile(true)}
                >
                  <FilePlus size={18} />
                </Button.Ripple>
                <UncontrolledTooltip placement='top' target={'btnAddPanelCSV'}>
                  <FormattedMessage id='Add panels' />
                </UncontrolledTooltip>
              </>
            )}
            <Button.Ripple
              id='btnToggleView'
              className='btn-icon'
              outline
              color='primary'
              onClick={() => setIsShowList(!isShowList)}
            >
              {isShowList ? <Grid size={18} /> : <List size={18} />}
            </Button.Ripple>
          </ButtonGroup>
          <UncontrolledTooltip placement='top' target={'btnToggleView'}>
            <FormattedMessage id={isShowList ? 'Display grid' : 'Display list'} />
          </UncontrolledTooltip>
        </Col>
        <Col md={5}>
          <Nav pills>{renderNavItems()}</Nav>
        </Col>
        {(active === DEVICE_TYPE.INVERTER || active === DEVICE_TYPE.METER) && (
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm={5}>
            <Label className='mr-1 d-none' for='search-input'>
              <FormattedMessage id='Search' />
            </Label>
            <Input
              className='dataTable-filter'
              type='search'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={intl.formatMessage({ id: 'Name, Device S/N' })}
            />
            <CreatableSelect
              name='status'
              options={PROJECT_STATUS_OPTIONS}
              className='react-select project-select'
              classNamePrefix='select'
              isClearable
              placeholder={<FormattedMessage id='Device status' />}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              onChange={onChangeSelect}
            />
            <CreatableSelect
              name='typeModel'
              options={active === DEVICE_TYPE.INVERTER ? TYPE_MODEL_OPTIONS : METER_TYPE_MODEL_OPTIONS}
              className='react-select project-select'
              classNamePrefix='select'
              isClearable
              placeholder={<FormattedMessage id='Type' />}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              onChange={onChangeSelect}
            />
          </Col>
        )}
      </Row>
      <Row>
        {active === DEVICE_TYPE.INVERTER && !isShowList && renderDevices(inverter.data)}
        {active === DEVICE_TYPE.INVERTER && isShowList && (
          <Col>
            <Inverters setIsShowSolarPanelList={setIsShowSolarPanelList} />
          </Col>
        )}
        {active === DEVICE_TYPE.METER && !isShowList && renderDevices(meter.data)}
        {active === DEVICE_TYPE.METER && isShowList && (
          <Col>
            <Meters />
          </Col>
        )}
        {active === DEVICE_TYPE.SINGLE_LINE && isShowSingleLine && <SingleLine />}
      </Row>
      <Row className='text-center d-none'>
        <Col>
          <Button.Ripple color='primary' outline>
            <Loader size={14} />
            <span className='align-middle ml-25'>
              <FormattedMessage id='Loading' />
            </span>
          </Button.Ripple>
        </Col>
      </Row>
      {isShowDeviceModal && (
        <DeviceDetail
          isShowDeviceModal={isShowDeviceModal}
          setIsShowDeviceModal={setIsShowDeviceModal}
          deviceDetailTitle={isEditDevice ? 'Edit device' : 'Add new device'}
          currentDevice={isEditDevice ? currentDevice : null}
          isEditDevice={isEditDevice}
          active={active}
          setActive={setActive}
        />
      )}
      {isShowSolarPanelList && (
        <Panels isShowSolarPanelList={isShowSolarPanelList} setIsShowSolarPanelList={setIsShowSolarPanelList} />
      )}
      {isShowCreatePanelByFile && (
        <CreatePanelByFile
          isShowCreatePanelByFile={isShowCreatePanelByFile}
          setIsShowCreatePanelByFile={setIsShowCreatePanelByFile}
        />
      )}
    </>
  )
}

Devices.propTypes = {
  intl: PropTypes.object.isRequired,
  setIsShowSideBar: PropTypes.func
}

export default injectIntl(Devices)
