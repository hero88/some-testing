import {
  useEffect,
  useState
} from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'

// ** React Imports
import { Row } from 'reactstrap'
import ActiveSidebar from '@src/views/alert/Sidebar'
import moment from 'moment'

import {
  getHistoryAlerts,
  updateAlertById
} from '@src/views/alert/store/action'
import AlertTable from '@src/views/alert/AlertTable'
import {
  ALERT_STATUS,
  ROWS_PER_PAGE_DEFAULT
} from '@constants/common'
import { ROUTER_URL } from '@constants/router'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@hooks/useQuery'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'

const AlertHistory = () => {
  const history = useHistory()
  const query = useQuery()
  const projectId = query.get('projectId')
  const dispatch = useDispatch(),
    {
      alert: { history: historyAlert }
    } = useSelector((state) => state)

  // ** States
  const [picker, setPicker] = useState([new Date(), new Date()]),
    [currentPage, setCurrentPage] = useState(1),
    [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_DEFAULT),
    [searchValue, setSearchValue] = useState(''),
    [orderBy, setOrderBy] = useState('createDate'),
    [sortDirection, setSortDirection] = useState('desc'),
    [selectedProjectIds, setSelectedProjectIds] = useState([]),
    [selectedDeviceIds, setSelectedDeviceIds] = useState([]),
    [selectedOthers, setSelectedOthers] = useState([]),
    [isOpenFilter, setIsOpenFilter] = useState(false)

  // Fetch alert data
  const fetchAlerts = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      fromDate: moment(picker[0]).format('YYYY-MM-DD'),
      toDate: moment(picker[1]).format('YYYY-MM-DD'),
      fk: '*',
      state: '*',
      deviceIds: selectedDeviceIds.length > 0
        ? selectedDeviceIds.toString()
        : undefined,
      projectIds: projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM
        ? projectId
        : selectedProjectIds.length > 0
          ? selectedProjectIds.toString()
          : undefined,
      alertTypes: selectedOthers.length > 0
        ? selectedOthers.toString()
        : undefined,
      statuses: [ALERT_STATUS.RESOLVED].toString(),
      ...queryParam
    }

    dispatch(getHistoryAlerts(initParam))
  }

  // Update alert
  const updateAlert = (data) => {
    // Calculate page in case change status
    let tempPage = currentPage
    const totalRows = historyAlert?.total

    if (tempPage > 1 && totalRows % rowsPerPage === 1) {
      tempPage -= 1
    }

    dispatch(updateAlertById({
      data,
      params: { ...historyAlert?.params, page: tempPage },
      isHistory: true
    }))
  }

  useEffect(() => {
    if (projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM) {
      fetchAlerts({ projectId })
      dispatch(
        getProjectById({
          id: projectId,
          fk: '*'
        })
      )
    } else {
      fetchAlerts()
    }
  }, [projectId])

  // Filter
  const onFilter = () => {
    const tempParam = {
      deviceIds: '',
      projectIds: '',
      alertTypes: ''
    }

    setCurrentPage(1)
    tempParam.page = 1

    if (selectedProjectIds.length) {
      tempParam.projectIds = selectedProjectIds.toString()
    }

    if (selectedDeviceIds.length) {
      tempParam.deviceIds = selectedDeviceIds.toString()
    }

    if (selectedOthers.length) {
      tempParam.alertTypes = selectedOthers.toString()
    }

    fetchAlerts(tempParam)
  }

  // Reset all filter
  const resetFilter = () => {
    setSelectedProjectIds([])
    setSelectedDeviceIds([])
    setSelectedOthers([])
  }

  const filterByDate = async (date) => {
    const validDate = date || [new Date(), new Date()]
    setPicker(validDate)

    if (validDate) {
      const fromDate = moment(validDate[0]).format('YYYY-MM-DD')
      const toDate = moment(validDate[1]).format('YYYY-MM-DD')

      await fetchAlerts({
        fromDate,
        toDate
      })
    }
  }

  return (
    <Row className='alert-active'>
      <ActiveSidebar
        isOpen={isOpenFilter}
        setIsOpen={setIsOpenFilter}
        selectedProjectIds={selectedProjectIds}
        setSelectedProjectIds={setSelectedProjectIds}
        selectedDeviceIds={selectedDeviceIds}
        setSelectedDeviceIds={setSelectedDeviceIds}
        selectedOthers={selectedOthers}
        setSelectedOthers={setSelectedOthers}
        onFilter={onFilter}
        resetFilter={resetFilter}
        isHideProjectFilter={projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM}
      />
      <AlertTable
        fetchData={fetchAlerts}
        updateAlert={updateAlert}
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
        setIsOpenFilter={setIsOpenFilter}
        isHistory
        isHideProjectNameColumn={projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM}
      />
    </Row>
  )
}

AlertHistory.propTypes = {}

export default AlertHistory
