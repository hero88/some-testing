// ** React Imports
import { useEffect, useState } from 'react'

// ** Import 3rd party components
import { Row } from 'reactstrap'
import ActiveSidebar from '@src/views/alert/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

// ** Custom components
import AlertTable from '@src/views/alert/AlertTable'
import { getAlerts, updateAlertById } from '@src/views/alert/store/action'
import {
  ALERT_STATUS,
  ROWS_PER_PAGE_DEFAULT
} from '@constants/common'
import { useQuery } from '@hooks/useQuery'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'

const AlertActive = () => {
  const history = useHistory()
  const query = useQuery()
  const projectId = query.get('projectId')
  const dispatch = useDispatch(),
    {
      alert: { active: activeAlert }
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
    [selectedStatuses, setSelectedStatuses] = useState([]),
    [selectedOthers, setSelectedOthers] = useState([]),
    [isOpenFilter, setIsOpenFilter] = useState(false)

  // Fetch alert data
  const fetchAlerts = (queryParam) => {
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
      deviceIds: selectedDeviceIds.length > 0 ? selectedDeviceIds.toString() : undefined,
      projectIds: projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM
        ? projectId
        : selectedProjectIds.length > 0 ? selectedProjectIds.toString() : undefined,
      alertTypes: selectedOthers.length > 0 ? selectedOthers.toString() : undefined,
      statuses:
        selectedStatuses.length > 0
          ? selectedStatuses.toString()
          : [
            ALERT_STATUS.NEW,
            ALERT_STATUS.IN_PROGRESS,
            ALERT_STATUS.UN_RESOLVED
          ].toString(),
      ...queryParam
    }

    dispatch(getAlerts(initParam))
  }

  // Update alert
  const updateAlert = (data) => {
    // Calculate page in case change status
    let tempPage = currentPage
    const totalRows = activeAlert?.total

    if (tempPage > 1 && totalRows % rowsPerPage === 1) {
      tempPage -= 1
    }

    dispatch(updateAlertById({ data, params: { ...activeAlert?.params, page: tempPage } }))
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

    if (selectedStatuses.length) {
      tempParam.statuses = selectedStatuses.toString()
    }

    fetchAlerts(tempParam)
  }

  // Reset all filter
  const resetFilter = () => {
    setSelectedProjectIds([])
    setSelectedDeviceIds([])
    setSelectedStatuses([])
    setSelectedOthers([])
  }

  // Filter by date
  const filterByDate = (date) => {
    const validDate = date || [new Date(), new Date()]
    setPicker(validDate)

    if (validDate) {
      const fromDate = moment(validDate[0]).format('YYYY-MM-DD')
      const toDate = moment(validDate[1]).format('YYYY-MM-DD')

      fetchAlerts({
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
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedOthers={selectedOthers}
        setSelectedOthers={setSelectedOthers}
        onFilter={onFilter}
        resetFilter={resetFilter}
        isHideProjectFilter={projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM}
      />
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
        filterByDate={filterByDate}
        setIsOpenFilter={setIsOpenFilter}
        isShowActiveList
        isHideProjectNameColumn={projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM}
      />
    </Row>
  )
}

AlertActive.propTypes = {}

export default AlertActive
