// ** React Imports
import { Row, Col } from 'reactstrap'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { ALERT_STATUS } from '@constants/common'
import { getHistoryAlerts } from '@src/views/alert/store/action'
import AlertTable from '@src/views/alert/AlertTable'
import PropTypes from 'prop-types'

const HistoryAlert = ({ filterData, isHideDeviceNameColumn }) => {
  const dispatch = useDispatch(),
    {
      alert: { history: historyAlert }
    } = useSelector((state) => state)

  // ** States
  const [picker, setPicker] = useState([new Date(), new Date()]),
    [currentPage, setCurrentPage] = useState(1),
    [rowsPerPage, setRowsPerPage] = useState(10),
    [searchValue, setSearchValue] = useState(''),
    [orderBy, setOrderBy] = useState('createDate'),
    [sortDirection, setSortDirection] = useState('desc')

  // Fetch alert data
  const fetchAlerts = async (queryParam) => {
    if (filterData?.userId) {
      const initParam = {
        page: currentPage,
        rowsPerPage,
        q: searchValue,
        order: `${orderBy} ${sortDirection}`,
        fromDate: moment(picker[0]).startOf('d').valueOf(),
        toDate: moment(picker[1]).endOf('d').valueOf(),
        fk: '*',
        state: '*',
        userId: filterData?.userId,
        projectIds: filterData?.type === 'project' ? [filterData?.id].toString() : undefined,
        deviceIds: filterData?.type === 'device' ? [filterData?.id].toString() : undefined,
        statuses: [ALERT_STATUS.RESOLVED].toString(),
        ...queryParam
      }

      dispatch(getHistoryAlerts(initParam))
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const filterByDate = async () => {
    if (picker && picker.length === 2) {
      fetchAlerts()
    }
  }

  return (
    <Row className="alert-history">
      <Col md={12}>
        <AlertTable
          fetchData={fetchAlerts}
          tableData={historyAlert.data}
          picker={picker}
          setPicker={setPicker}
          total={historyAlert.total}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          filterByDate={filterByDate}
          isHideDeviceNameColumn={isHideDeviceNameColumn}
        />
      </Col>
    </Row>
  )
}

HistoryAlert.propTypes = {
  filterData: PropTypes.object.isRequired,
  isHideDeviceNameColumn: PropTypes.bool
}

export default HistoryAlert
