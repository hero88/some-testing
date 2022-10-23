import React, { useEffect, useState } from 'react'

// ** Third party components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import {
  ButtonDropdown,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import classnames from 'classnames'
import { DateRangePicker } from 'element-react/next'

// ** Custom components
import { useQuery } from '@hooks/useQuery'
import { getMonitoringMeters } from '@src/views/monitoring/devices/meter/store/actions'
import { numberToFixed, numberWithCommas } from '@utils'
import { DISPLAY_DATE_FORMAT_CALENDAR, DISPLAY_DATE_TIME_FORMAT, ROWS_PER_PAGE_OPTIONS } from '@constants/common'
import CP from '@src/views/common/pagination'
import { ReactComponent as IconColumn } from '@src/assets/images/svg/table/ic-column.svg'
import { METER_MODEL } from '@constants/project'
import HeaderName from '@src/views/common/table/HeaderName'

const MeterTable = ({ intl }) => {
  const requiredKeys = [
    'totalActiveEnergy',
    'rate_1ActiveEnergyPlus',
    'rate_2ActiveEnergyPlus',
    'rate_3ActiveEnergyPlus',
    'totalActiveEnergySub',
    'rate_1ActiveEnergySub',
    'rate_2ActiveEnergySub',
    'rate_3ActiveEnergySub',
    'totalReactiveEnergyPlusLag',
    'rate_1ReactiveEnergyPlusLag',
    'rate_2ReactiveEnergyPlusLag',
    'rate_3ReactiveEnergyPlusLag',
    'totalReactiveEnergySubLead',
    'rate_1ReactiveEnergySubLead',
    'rate_2ReactiveEnergySubLead',
    'rate_3ReactiveEnergySubLead',
    'totalRatePositiveApparentEnergy',
    'rate_1PositiveApparentEnergy',
    'rate_2PositiveApparentEnergy',
    'rate_3PositiveApparentEnergy',
    'totalRateReactiveApparentEnergy',
    'rate_1ReactiveApparentEnergy',
    'rate_2ReactiveApparentEnergy',
    'rate_3ReactiveApparentEnergy',
    'totalOneQuadrantReactiveEnergy',
    'rate_1OneQuadrantReactiveEnergy',
    'rate_2OneQuadrantReactiveEnergy',
    'rate_3OneQuadrantReactiveEnergy',
    'totalTwoQuadrantReactiveEnergy',
    'rate_1TwoQuadrantReactiveEnergy',
    'rate_2TwoQuadrantReactiveEnergy',
    'rate_3TwoQuadrantReactiveEnergy',
    'totalThreeQuadrantReactiveEnergy',
    'rate_1ThreeQuadrantReactiveEnergy',
    'rate_2ThreeQuadrantReactiveEnergy',
    'rate_3ThreeQuadrantReactiveEnergy',
    'totalFourQuadrantReactiveEnergy',
    'rate_1FourQuadrantReactiveEnergy',
    'rate_2FourQuadrantReactiveEnergy',
    'rate_3FourQuadrantReactiveEnergy',
    'totalActiveMdPlus',
    'rate_1ActiveMdPlus',
    'rate_2ActiveMdPlus',
    'rate_3ActiveMdPlus',
    'totalActiveMdSub',
    'rate_1ActiveMdSub',
    'rate_2ActiveMdSub',
    'rate_3ActiveMdSub',
    'totalReactiveMdPlus',
    'rate_1ReactiveMdPlus',
    'rate_2ReactiveMdPlus',
    'rate_3ReactiveMdPlus',
    'totalReactiveMdSub',
    'rate_1ReactiveMdSub',
    'rate_2ReactiveMdSub',
    'rate_3ReactiveMdSub',
    'currentPhaseA',
    'currentPhaseB',
    'currentPhaseC',
    'voltagePhaseA',
    'voltagePhaseB',
    'voltagePhaseC',
    'realActivePower_3SubphaseTotal',
    'realActivePowerPhaseA',
    'realActivePowerPhaseB',
    'realActivePowerPhaseC',
    'realReactivePower_3SubphaseTotal',
    'realReactivePowerPhaseA',
    'realReactivePowerPhaseB',
    'realReactivePowerPhaseC',
    'phaseAPowerFactor',
    'phaseBPowerFactor',
    'phaseCPowerFactor',
    'totalPowerFactor',
    'phaseAApparentPower',
    'phaseBApparentPower',
    'phaseCApparentPower',
    'totalApparentPower',
    'frequency',
    'ctRatioPrimary',
    'ctRatioSecondary',
    'ptRatioPrimary',
    'ptRatioSecondary',
    'idMeter',
    'meterStatus'
  ]

  const requiredElsterKeys = [
    'totalActiveEnergy',
    'rate_1ActiveEnergyPlus',
    'rate_2ActiveEnergyPlus',
    'rate_3ActiveEnergyPlus',
    'totalActiveEnergySub',
    'rate_1ActiveEnergySub',
    'rate_2ActiveEnergySub',
    'rate_3ActiveEnergySub',
    'totalReactiveEnergyPlusLag',
    'totalReactiveEnergySubLead',
    'totalActiveMdPlus',
    'md4DateTime',
    'rate_1ActiveMdPlus',
    'md1DateTime',
    'rate_2ActiveMdPlus',
    'md2DateTime',
    'rate_3ActiveMdPlus',
    'md3DateTime',
    'totalActiveMdSub',
    'md8DateTime',
    'rate_1ActiveMdSub',
    'md5DateTime',
    'rate_2ActiveMdSub',
    'md6DateTime',
    'rate_3ActiveMdSub',
    'md7DateTime',
    'totalReactiveMdPlus',
    'totalReactiveMdSub',
    'currentPhaseA',
    'currentPhaseB',
    'currentPhaseC',
    'voltagePhaseA',
    'voltagePhaseB',
    'voltagePhaseC',
    'realActivePower_3SubphaseTotal',
    'realActivePowerPhaseA',
    'realActivePowerPhaseB',
    'realActivePowerPhaseC',
    'realReactivePower_3SubphaseTotal',
    'realReactivePowerPhaseA',
    'realReactivePowerPhaseB',
    'realReactivePowerPhaseC',
    'phaseAPowerFactor',
    'phaseBPowerFactor',
    'phaseCPowerFactor',
    'totalPowerFactor',
    'totalApparentPower',
    'frequency',
    'ctRatioPrimary',
    'ctRatioSecondary',
    'ptRatioPrimary',
    'phaseRotation',
    'vtErrorMagnitude',
    'ctErrorMagnitude',
    'reverseRunEventCount'
  ]
  const textKeys = [
    'totalPowerFactor',
    'idMeter',
    'md1DateTime',
    'md2DateTime',
    'md3DateTime',
    'md4DateTime',
    'md5DateTime',
    'md6DateTime',
    'md7DateTime',
    'md8DateTime',
    'phaseRotation',
    'vtErrorMagnitude',
    'ctErrorMagnitude',
    'reverseRunEventCount'
  ]

  // ** Store Vars
  const dispatch = useDispatch(),
    query = useQuery(),
    deviceId = query.get('deviceId'),
    {
      monitoringMeter: store
    } = useSelector((state) => state)

  const [currentPage, setCurrentPage] = useState(store?.params?.page),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage),
    [searchValue] = useState(store?.params?.q),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[0] : 'createDate'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[1] : 'desc'
    ),
    [picker, setPicker] = useState([new Date(), new Date()]),
    [fromDateFilter, setFromDateFilter] = useState(store?.param?.fromDate || moment().startOf('d').format(
      'YYYY-MM-DD HH:mm:ss')),
    [toDateFilter, setToDateFilter] = useState(store?.param?.toDate || moment()
      .endOf('d')
      .format('YYYY-MM-DD HH:mm:ss')),
    [displayColumns, setDisplayColumns] = useState(requiredKeys),
    [dropdownOpen, setDropdownOpen] = useState(false),
    [selectAll, setSelectAll] = useState(false),
    [validKeys, setValidKeys] = useState(requiredKeys)

  // Fetch monitoring meter API
  const fetchMonitoringMeters = (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      state: '*',
      fk: '["project"]',
      fromDate: fromDateFilter,
      toDate: toDateFilter,
      monitoringType: 'sungrowMeter',
      ...queryParam,
      deviceId
    }

    // ** Set data to store
    dispatch(getMonitoringMeters(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchMonitoringMeters()])
  }, [deviceId])

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1)
    fetchMonitoringMeters({ page: page.selected + 1 })
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchMonitoringMeters({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
  }

  // ** Checking display columns
  const checkDisplayColumns = ({ selectedData, item, isChecked }) => {
    const columns = [...selectedData]
    const index = columns.findIndex((column) => column === item)

    if (isChecked && index === -1) {
      columns.push(item)
    } else if (!isChecked && index > -1) {
      columns.splice(index, 1)
    }

    return columns
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)

    return (
      <CP
        totalRows={store.total || 1}
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={'pagination react-paginate'}
        pageRange={2}
        nextPagesClassName={'page-item next'}
        nextPagesLinkClassName={'page-link double'}
        nextPagesLabel={''}
        previousPagesClassName={'page-item prev'}
        previousPagesLinkClassName={'page-link double'}
        previousPagesLabel={''}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        handlePerPage={handlePerPage}
        displayUnit={intl.formatMessage({ id: 'rows' }).toLowerCase()}
      />
    )
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchMonitoringMeters({ order: `${column.selector} ${direction}` })
  }

  // Filter by date
  const filterByDate = (date) => {
    setPicker(date)

    if (date) {
      const fromDate = moment(date[0]).startOf('d').format('YYYY-MM-DD HH:mm:ss')
      const toDate = moment(date[1]).endOf('d').format('YYYY-MM-DD HH:mm:ss')
      setFromDateFilter(fromDate)
      setToDateFilter(toDate)
      fetchMonitoringMeters({
        fromDate,
        toDate,
        order: 'createDate desc'
      })
    }
  }

  // Set dropdown menu on/off
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Render meter properties column
  const renderRequiredColumns = () => {
    return validKeys.map((key) => (
      {
        name: <HeaderName
          name={intl.formatMessage({ id: key })}
          unit={store?.data?.length > 0 && store.data[0][key]?.originUnit ? `(${store.data[0][key]?.originUnit})` : ''}
        />,
        selector: `${key}`,
        center: true,
        sortable: true,
        omit: displayColumns.findIndex(column => column === key) === -1,
        minWidth: '180px',
        // eslint-disable-next-line react/display-name
        cell: (row) => {
          let value = row[key]?.value ? row[key].value : 0

          if ((key === 'totalActiveMdPlus'
            || key === 'rate_1ActiveMdPlus'
            || key === 'rate_2ActiveMdPlus'
            || key === 'rate_3ActiveMdPlus'
            || key === 'totalActiveMdSub'
            || key === 'rate_1ActiveMdSub'
            || key === 'rate_2ActiveMdSub'
            || key === 'rate_3ActiveMdSub'
          ) && row.modelDevice === METER_MODEL.ELSTER) {
            value = numberToFixed(value / 1000000)
          } else if (
            key !== 'totalPowerFactor'
            && key !== 'idMeter'
            && (
              key.includes('Active')
              || key.includes('Reactive')
              || key.includes('ApparentPower')
            )
          ) {
            value = numberToFixed(value / 1000)
          }

          return (
            <>
              {
                textKeys.includes(key)
                  ? <div>{`${value}`}</div>
                  : <div>{`${numberWithCommas(numberToFixed(value))}`}</div>
              }
            </>
          )
        }
      }
    ))
  }

  // ** Column header
  const columns = [
    {
      name: intl.formatMessage({ id: 'Date' }),
      selector: 'createDate',
      sortable: true,
      minWidth: '180px',
      cell: (row) => moment(Number(row.createDate)).format(DISPLAY_DATE_TIME_FORMAT),
      style: { position: 'sticky', left: 0, zIndex: 1 }
    },
    ...renderRequiredColumns()
  ]

  useEffect(() => {
    if (store?.data?.length) {
      setValidKeys(store.data[0].modelDevice === METER_MODEL.ELSTER ? requiredElsterKeys : requiredKeys)
      setDisplayColumns(store.data[0].modelDevice === METER_MODEL.ELSTER ? requiredElsterKeys : requiredKeys)
      setSelectAll(true)
    }
  }, [store])

  return (
    <>
      <Row className='mx-0 mt-1'>
        <Col sm='6' className='px-0 mb-1'>
          <DateRangePicker
            value={picker}
            placeholder={intl.formatMessage({ id: `Pick day` })}
            onChange={filterByDate}
            disabledDate={time => time.getTime() > Date.now()}
            format={DISPLAY_DATE_FORMAT_CALENDAR}
            firstDayOfWeek={1}
          />
        </Col>
        <Col sm={6} className='d-flex justify-content-end px-0'>
          <ButtonDropdown
            className='show-column'
            direction='left'
            isOpen={dropdownOpen}
            toggle={toggleDropdown}
          >
            <DropdownToggle
              id='showHideColumnsButton'
              style={{ padding: 7, borderRadius: 5 }}
              color='primary'
              outline
            >
              <IconColumn/>
              <span><FormattedMessage id='Display columns'/></span>
            </DropdownToggle>
            <DropdownMenu style={{ height: 500, overflow: 'auto' }}>
              <div
                style={{ width: 250 }}
                className='px-1'
              >
                <CustomInput
                  type='checkbox'
                  className='custom-control-Primary mr-1'
                  checked={selectAll}
                  value={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked)
                    setDisplayColumns(e.target.checked ? validKeys : [])
                  }}
                  id={`ckbSelectAll`}
                  label={intl.formatMessage({ id: 'Select all' })}
                />
              </div>
              <DropdownItem divider/>
              {
                validKeys.map((key, index) => {
                  return <div
                    key={index}
                    style={{ width: 250 }}
                    className='px-1'
                  >
                    <CustomInput
                      type='checkbox'
                      className='custom-control-Primary mr-1'
                      checked={displayColumns.findIndex(column => column === key) > -1}
                      value={key}
                      onChange={(e) => {
                        const tempDisplayColumns = checkDisplayColumns({
                          selectedData: displayColumns,
                          item: key,
                          isChecked: e.target.checked
                        })

                        setDisplayColumns(tempDisplayColumns)
                        setSelectAll(tempDisplayColumns.length === validKeys.length)
                      }}
                      id={`ckb_${key}`}
                      label={intl.formatMessage({ id: key })}
                    />
                  </div>
                })
              }
            </DropdownMenu>
          </ButtonDropdown>
          <UncontrolledTooltip placement='top' target='showHideColumnsButton'>
            <FormattedMessage id='Display or hide columns'/>
          </UncontrolledTooltip>
        </Col>
      </Row>
      <DataTable
        noHeader
        pagination
        paginationServer
        className={classnames(
          'react-dataTable react-dataTable--projects react-dataTable--meters__chart react-dataTable--monitoring-meter hover',
          { 'overflow-hidden': store?.data?.length <= 0 }
        )}
        columns={columns}
        sortIcon={<ChevronDown size={10}/>}
        paginationComponent={CustomPagination}
        data={store.data}
        persistTableHead
        noDataComponent={''}
        onSort={customSort}
        sortServer
        defaultSortAsc={sortDirection === 'asc'}
        defaultSortField={orderBy}
      />
    </>
  )
}

MeterTable.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(MeterTable)
