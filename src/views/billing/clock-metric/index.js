import { object } from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import PageHeader from './PageHeader'
import Table from '@src/views/common/table/CustomDataTable'
import { getClockMetricBySeri } from './store/actions'
import moment from 'moment'
import { numberWithCommas } from '@src/utility/Utils'
import { useState, useEffect } from 'react'
import { getAllContract, getContractById } from '../contract/store/actions'
import { RESET_DATA_METER_METRIC_REQUEST, ROWS_PER_PAGE_DEFAULT } from '@src/utility/constants'

const ClockMetric = ({ intl }) => {
  const dispatch = useDispatch()
  const { meterMetric, params, total } = useSelector((state) => state.billingMeter)
  const [isSearching, setIsSearching] = useState(false)
  const { pagination = {}, filterValue = {} } = params
  const [selectedClock, setSelectedClock] = useState(-1)
  const {
    projectContracts: { selectedContract: selectedContract }
  } = useSelector((state) => state)
  useEffect(() => {
    if (selectedClock !== -1 && selectedClock) dispatch(getContractById({ id: selectedClock }))
  }, [meterMetric])

  useEffect(() => {
    const initParamsToFetch = {
      pagination: {
        rowsPerPage: ROWS_PER_PAGE_DEFAULT,
        currentPage: 1
      },
      sortBy: 'code',
      sortDirection: 'asc'
    }
    dispatch(getAllContract())
    return () => {
      dispatch({
        type: RESET_DATA_METER_METRIC_REQUEST,
        payload: initParamsToFetch

      })
    }
  }, [])
  const fetchClockMetrics = (payload) => {
    dispatch(
      getClockMetricBySeri({
        ...params,
        ...payload
      })
    )
  }

  const handleChangePage = (e) => {
    fetchClockMetrics({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchClockMetrics({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleSort = (column, direction) => {
    fetchClockMetrics({
      sortBy: column.selector,
      sortDirection: direction,
      order: `${column.selector} ${direction}`
    })
  }
  const handleFilter = (value) => {
    setIsSearching(true)
    fetchClockMetrics({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      filterValue: value,
      isFilter: true
    })
  }
  const returnRushTime = (row) => {
    const newTime = moment(row.createDate)
    if (
      (newTime.diff(moment('09:30:00', 'HH:mm:ss'), 'second') > 0 &&
        newTime.diff(moment('11:30:00', 'HH:mm:ss'), 'second') < 0) ||
      (newTime.diff(moment('17:00:00', 'HH:mm:ss'), 'second') > 0 &&
        newTime.diff(moment('20:00:00', 'HH:mm:ss'), 'second') < 0)
    ) {
      return selectedContract.details?.unitPrice?.high
    } else if (
      (newTime.diff(moment('04:00:00', 'HH:mm:ss'), 'second') > 0 &&
        newTime.diff(moment('9:30:00', 'HH:mm:ss'), 'second') < 0) ||
      (newTime.diff(moment('11:30:00', 'HH:mm:ss'), 'second') > 0 &&
        newTime.diff(moment('17:00:00', 'HH:mm:ss'), 'second') < 0) ||
      (newTime.diff(moment('20:00:00', 'HH:mm:ss'), 'second') > 0 &&
        newTime.diff(moment('22:00:00', 'HH:mm:ss'), 'second') < 0)
    ) {
      return selectedContract?.details?.unitPrice?.medium
    } else {
      return selectedContract?.details?.unitPrice?.low
    }
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'Time' }),
      cell: (row) => moment(row.createDate).format('DD/MM/YYYY H:mm:ss'),
      minWidth: '200px',
      sortable: true,
      selector: 'createDate'
    },
    {
      name: intl.formatMessage({ id: 'meters' }),
      selector: 'modelDevice',
      sortable: true
    },
    {
      name: 'Seri',
      sortable: true,
      selector: 'serialNumber'
    },
    {
      name: intl.formatMessage({ id: 'Coefficient' }),
      center: true,
      cell: () => selectedContract.chargeRate
    },
    {
      name: intl.formatMessage({ id: 'Price list' }),
      selector: '',
      center: true,
      cell: (row) => returnRushTime(row)
    },
    {
      name: intl.formatMessage({ id: 'Index p delivered' }),
      selector: 'totalActiveEnergy',
      sortable: true,
      center: true,
      cell: (row) => numberWithCommas(row.totalActiveEnergy.value / 100)
    },
    {
      name: intl.formatMessage({ id: 'P index received' }),
      sortable: true,
      center: true,
      selector: 'totalActiveEnergySub',

      cell: (row) => numberWithCommas(row.totalActiveEnergySub.value / 100)
    },
    {
      name: intl.formatMessage({ id: 'Index q delivered' }),
      cell: (row) => numberWithCommas(row.totalReactiveEnergyPlusLag.value / 100),
      sortable: true,
      center: true,
      selector: 'totalReactiveEnergyPlusLag'
    },
    {
      name: intl.formatMessage({ id: 'Q index received' }),
      cell: (row) => numberWithCommas(row.totalReactiveEnergySubLead.value / 100),
      sortable: true,
      center: true,
      selector: 'totalReactiveEnergySubLead'
    },
    {
      name: intl.formatMessage({ id: 'P max' }),
      selector: 'totalActiveMdPlus',
      sortable: true,
      center: true,
      cell: (row) => numberWithCommas(row.totalActiveMdPlus.value / 100)
    },
    {
      name: intl.formatMessage({ id: 'Time P max' }),
      selector: '',
      sortable: true
    }
  ]
  return (
    <>
      <Row>
        <Col sm="12">
          <PageHeader onFilter={handleFilter} filterValue={filterValue} setSelectedClock={setSelectedClock} />

          <Table
            tableId="operation-unit"
            columns={columns}
            data={meterMetric}
            total={total}
            onPageChange={handleChangePage}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            isSearching={JSON.stringify({}) !== '{}'}
            {...pagination}
            noDataTitle={
              <FormattedMessage id={!isSearching ? 'No data metric' : 'Not found any result. Please try again'} />
            }
          />
        </Col>
      </Row>
    </>
  )
}

ClockMetric.propTypes = {
  intl: object.isRequired
}

export default injectIntl(ClockMetric)
