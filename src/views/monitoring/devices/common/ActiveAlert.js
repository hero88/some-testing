// ** React Imports
import { useEffect, useState } from 'react'

// ** Import 3rd party components
import { Row, Col } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { ALERT_STATUS } from '@constants/common'
import { getAlerts, updateAlertById } from '@src/views/alert/store/action'
import AlertTable from '@src/views/alert/AlertTable'
import PropTypes from 'prop-types'

const ActiveAlert = ({ filterData, setIsShowSideBar, isHideProjectNameColumn, isHideDeviceNameColumn }) => {
  const dispatch = useDispatch(),
    {
      alert: { active: activeAlert }
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
        fk: '*',
        state: '*',
        projectIds: filterData?.type === 'project' ? [filterData?.id].toString() : undefined,
        deviceIds: filterData?.type === 'device' ? [filterData?.id].toString() : undefined,
        userId: filterData?.userId,
        statuses: [ALERT_STATUS.NEW, ALERT_STATUS.IN_PROGRESS, ALERT_STATUS.UN_RESOLVED].toString(),
        ...queryParam
      }

      await dispatch(getAlerts(initParam))
    }
  }

  // Update alert
  const updateAlert = (data) => {
    dispatch(updateAlertById({ data, params: activeAlert.params }))
  }

  useEffect(async () => {
    if (setIsShowSideBar) {
      setIsShowSideBar(true)
    }
    await fetchAlerts()
  }, [])

  return (
    <>
      <Row className='alert-active'>
        <Col md={12}>
          <AlertTable
            fetchData={fetchAlerts}
            updateAlert={updateAlert}
            tableData={activeAlert.data}
            picker={picker}
            setPicker={setPicker}
            total={activeAlert.total}
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
            isShowActiveList
            isHideProjectNameColumn={isHideProjectNameColumn}
            isHideDeviceNameColumn={isHideDeviceNameColumn}
          />
        </Col>
      </Row>
    </>
  )
}

ActiveAlert.propTypes = {
  filterData: PropTypes.object.isRequired,
  setIsShowSideBar: PropTypes.func,
  isHideProjectNameColumn: PropTypes.bool,
  isHideDeviceNameColumn: PropTypes.bool
}

export default ActiveAlert
