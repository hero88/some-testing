import {
  FormattedMessage,
  FormattedHTMLMessage,
  injectIntl
} from 'react-intl'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardBody,
  Col,
  DropdownItem,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap'
import {
  AlertCircle,
  AlertOctagon,
  ChevronDown,
  MoreVertical,
  Plus
} from 'react-feather'
import DataTable from 'react-data-table-component'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import moment from 'moment'
import {
  ALERT_IS_READ,
  ALERT_STATUS,
  ALERT_TYPE,
  DISPLAY_DATE_FORMAT_CALENDAR,
  DISPLAY_DATE_TIME_FORMAT,
  ROWS_PER_PAGE_OPTIONS,
  STATE
} from '@constants/common'
import Badge from 'reactstrap/es/Badge'
import React, {
  useContext,
  useEffect,
  useState
} from 'react'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { Link } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'
import Select from 'react-select'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterMoment'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import classnames from 'classnames'
import { getAlertNotes } from '@src/views/alert/store/action'
import NoteDetail from '@src/views/alert/NoteDetail'
import { TYPE_MODEL } from '@constants/project'
import Tooltip from '@mui/material/Tooltip'
import { numberWithCommas } from '@utils'
import CP from '@src/views/common/pagination'
import { DateRangePicker } from 'element-react/next'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'

export const renderSMAFaultColor = (code, modelDevice = '') => {
  const [register, eventNumber] = code?.split('-')

  if (modelDevice === 'SMA25') {
    switch (code) {
      case '30247-101': // SMA 25 Error (RED)
      case '30247-102':
      case '30247-103':
      case '30247-202':
      case '30247-203':
      case '30247-301':
      case '30247-401':
      case '30247-402':
      case '30247-403':
      case '30247-404':
      case '30247-501':
      case '30247-601':
      case '30247-701':
      case '30247-1302':
      case '30247-1501':
      case '30247-3301':
      case '30247-3401':
      case '30247-3402':
      case '30247-3501':
        return ALERT_TYPE.ERROR

      case '30247-3302':// SMA 25 Alert (ORANGE)
      case '30247-3601':
      case '30247-3701':
      case '30247-3801':
      case '30247-3802':
      case '30247-8001':
        return ALERT_TYPE.ALERT

      default:
        return ALERT_TYPE.WARNING
    }
  }

  if (modelDevice === 'SMA50') {
    switch (code) {
      case '30247-101': // SMA 50 Error (RED)
      case '30247-301':
      case '30247-401':
      case '30247-501':
      case '30247-601':
      case '30247-801':
      case '30247-901':
      case '30247-3501':
      case '30247-3701':
        return ALERT_TYPE.ERROR

      case '30247-3401':// SMA 50 Alert (ORANGE)
      case '30247-3402':
      case '30247-3404':
      case '30247-3407':
      case '30247-3410':
      case '30247-3411':
      case '30247-3412':
      case '30247-3801':
      case '30247-3802':
      case '30247-3803':
      case '30247-3805':
      case '30247-3806':
      case '30247-3807':
      case '30247-3808':
      case '30247-6603':
      case '30247-6604':
        return ALERT_TYPE.ALERT

      default:
        return ALERT_TYPE.WARNING
    }
  }

  if (code.includes('40225')) {
    return ALERT_TYPE.ERROR
  }

  // SMA 100 Self-diagnosis => device disturbance
  if (register === '30247' && eventNumber >= '6001' && eventNumber <= '6438') {
    return ALERT_TYPE.ALERT
  }

  switch (code) {
    case '40228-0':
    case '40228-1':
    case '40228-2':
    case '40228-3':
    case '40228-4':
    case '40230-1':
    case '40230-7':
    case '40230-8':
    case '40230-9':
    case '40234-1':
    case '40236-2':
    case '40236-5':
    case '30247-101': // SMA 100 Error (RED)
    case '30247-102':
    case '30247-103':
    case '30247-105':
    case '30247-202':
    case '30247-203':
    case '30247-206':
    case '30247-301':
    case '30247-302':
    case '30247-401':
    case '30247-404':
    case '30247-501':
    case '30247-507':
    case '30247-601':
    case '30247-701':
    case '30247-1302':
    case '30247-1501':
    case '30247-3601':
    case '30247-3501':
    case '30247-3701':
    case '40111-1': // SMA 110 Error (RED)
    case '40111-2':
    case '40111-4':
    case '40111-8':
    case '40111-16':
    case '40111-64':
      return ALERT_TYPE.ERROR

    case '40230-26':
    case '40236-1':
    case '40236-3':
    case '30247-3302': // SMA 100 Alert (ORANGE)
    case '30247-3303':
    case '30247-3401':
    case '30247-6501':
    case '30247-6502':
    case '30247-8003':
    case '40111-32': // SMA 110 Alert (ORANGE)
    case '40111-256':
    case '40111-512':
    case '40111-1024':
    case '40111-2048':
      return ALERT_TYPE.ALERT

    default:
      return ALERT_TYPE.WARNING
  }
}

export const renderSunGrowFaultColor = (code) => {
  switch (code) {
    case '004':
    case '005':
    case '008':
    case '009':
    case '010':
    case '014':
    case '015':
    case '088':
      return ALERT_TYPE.ERROR

    case '007':
    case '016':
    case '017':
    case '023':
    case '039':
    case '106':
    case '542':
    case '543':
    case '544':
    case '545':
    case '546':
    case '547':
    case '548':
    case '549':
    case '550':
    case '551':
    case '552':
    case '553':
    case '554':
    case '555':
    case '556':
    case '557':
    case '558':
    case '559':
    case '560':
    case '561':
    case '562':
    case '563':
    case '564':
    case '565':
    case '566':
    case '567':
    case '568':
    case '569':
    case '570':
    case '571':
    case '1500':
    case '1501':
    case '1502':
    case '1503':
    case '1504':
    case '1505':
    case '1506':
    case '1507':
    case '1508':
    case '1509':
    case '1510':
    case '1511':
    case '1512':
    case '1513':
    case '1514':
    case '1515':
    case '1516':
    case '1517':
    case '1518':
    case '1519':
    case '1520':
    case '1521':
    case '1522':
    case '1523':
    case '1524':
    case '1525':
    case '1526':
    case '1527':
    case '1528':
    case '1529':
    case '1530':
    case '1531':
      return ALERT_TYPE.ALERT

    default:
      return ALERT_TYPE.WARNING
  }
}

export const renderAlertCode = ({ row }) => {
  if (row?.alertMessage?.dec) {
    return `${row?.alertMessage?.dec}`
  }

  if (row?.alertMessage?.registerNumber) {
    let result = row?.alertMessage?.registerNumber

    if (row?.alertMessage?.bit && Number(row.alertMessage.bit) > -1) {
      result += `-${row.alertMessage.bit}`
    }

    if (row?.alertMessage?.statusCode) {
      result += `-${row.alertMessage.statusCode}`
    }

    if (row?.alertMessage?.content) {
      result += `-${row.alertMessage.content}`
    }

    return result
  }

  return ''
}

export const renderAlertStatus = (status, isExport, intl) => {
  switch (status) {
    case ALERT_STATUS.NEW:
      return (
        isExport
          ? intl.formatMessage({ id: 'New' })
          : <Badge
            pill
            color='light-info'
          >
            <FormattedMessage id='New'/>
          </Badge>
      )
    case ALERT_STATUS.IN_PROGRESS:
      return (
        isExport
          ? intl.formatMessage({ id: 'In progress' })
          : <Badge
            pill
            color='light-warning'
          >
            <FormattedMessage id='In progress'/>
          </Badge>
      )
    case ALERT_STATUS.RESOLVED:
      return (
        isExport
          ? intl.formatMessage({ id: 'Resolved' })
          : <Badge
            pill
            color='light-success'
          >
            <FormattedMessage id='Resolved'/>
          </Badge>
      )
    case ALERT_STATUS.UN_RESOLVED:
      return (
        isExport
          ? intl.formatMessage({ id: 'Unresolved' })
          : <Badge
            pill
            color='light-danger'
          >
            <FormattedMessage id='Unresolved'/>
          </Badge>
      )
    default:
      return isExport
        ? ''
        : null
  }
}

export const AlertTypeWithTooltip = ({ icon, id, text, classname }) => {
  return (
    <Tooltip
      placement='top'
      title={<FormattedMessage id={text}/>}
      arrow
    >
      <span
        className={classname}
        id={`alert_${id}`}
      >
        {icon}
      </span>
    </Tooltip>
  )
}

AlertTypeWithTooltip.propTypes = {
  icon: PropTypes.node,
  id: PropTypes.any,
  text: PropTypes.string,
  classname: PropTypes.string
}

export const renderAlertType = ({ id, type }) => {
  switch (type) {
    case ALERT_TYPE.INSPECTION_EXPIRED:
    case ALERT_TYPE.UNSTABLE_NETWORK:
    case ALERT_TYPE.LOW_EFFICIENCY:
    case ALERT_TYPE.LOW_EFF_OF_EACH_INVERTER:
    case ALERT_TYPE.INVERTER_OFFLINE:
    case ALERT_TYPE.METER_OFFLINE:
    case ALERT_TYPE.FAULT_EVENT_OF_EACH_INVERTERS:
    case ALERT_TYPE.INVERTER_STRING_ALERT:
    case ALERT_TYPE.ERROR: {
      return <AlertTypeWithTooltip
        id={id}
        text='Critical error'
        icon={<AlertCircle/>}
        classname='text-danger'
      />
    }

    case ALERT_TYPE.DATA_NOT_SYNCED:
    case ALERT_TYPE.ASYNC_INVERTER:
    case ALERT_TYPE.RESEND_ALERT:
    case ALERT_TYPE.PUSH_TO_OPERATOR:
    case ALERT_TYPE.HAVE_DIFF_YIELD_BTW_PROJECT:
    case ALERT_TYPE.DIFF_BTW_INVERTER_AND_METER:
    case ALERT_TYPE.LOW_COS_PHI:
    case ALERT_TYPE.ALERT: {
      return <AlertTypeWithTooltip
        id={id}
        text='Quite critical error'
        icon={<AlertCircle/>}
        classname='text-warning'
      />
    }

    case ALERT_TYPE.YIELD_AT_LOW_COST_TIME:
    case ALERT_TYPE.INVERTER_OVERHEAT:
    case ALERT_TYPE.PV_SENSOR_OVERHEAT:
    case ALERT_TYPE.WARNING:
    default: {
      return <AlertTypeWithTooltip
        id={id}
        text='Noted error'
        icon={<AlertOctagon/>}
        classname='text-yellow'
      />
    }
  }
}

export const renderTypeIcon = (item) => {
  if (item.alertType === ALERT_TYPE.FAULT_EVENT_OF_EACH_INVERTERS) {
    if (item?.device?.typeModel === TYPE_MODEL.SMA) {
      return renderAlertType({
        id: item.id,
        type: renderSMAFaultColor(
          `${item?.alertMessage?.registerNumber}-${item?.alertMessage?.bit || item?.alertMessage?.content}`,
          item?.alertMessage?.modelDevice
        )
      })
    }

    if (item?.device?.typeModel === TYPE_MODEL.SUNGROW) {
      return renderAlertType({
        id: item.id,
        type: renderSunGrowFaultColor(item?.alertMessage?.dec)
      })
    }
  }

  return renderAlertType({
    id: item.id,
    type: item.alertType
  })
}

export const renderAlertMessage = ({ type, alertData }) => {
  switch (type) {
    case ALERT_TYPE.RESEND_ALERT:
      return (
        <span>
          <FormattedMessage id='Resend message'/>
        </span>
      )
    case ALERT_TYPE.INVERTER_OFFLINE:
      return (
        <span>
          <FormattedHTMLMessage
            id='Inverter is offline'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.INVERTER_OVERHEAT:
      return (
        <span>
          <FormattedHTMLMessage
            id='Inverter is overheat'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.LOW_EFFICIENCY:
      return (
        <span>
          <FormattedHTMLMessage
            id='Low efficiency message'
            values={{
              name: alertData?.project?.name,
              value: alertData?.alertValue || 0,
              settingValue: alertData?.settingValue || 0
            }}
          />
        </span>
      )
    case ALERT_TYPE.UNSTABLE_NETWORK:
      return (
        <span>
          <FormattedHTMLMessage
            id='Unstable network message'
            values={{ name: alertData?.project?.name }}
          />
        </span>
      )
    case ALERT_TYPE.DATA_NOT_SYNCED:
      return (
        <span>
          <FormattedHTMLMessage
            id='Data not synced message'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.LOW_COS_PHI:
      return (
        <span>
          <FormattedHTMLMessage
            id='Low cos phi message'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.METER_OFFLINE:
      return (
        <span>
          <FormattedHTMLMessage
            id='Meter is offline'
            values={{ name: alertData?.device?.name }}
          />
        </span>
      )
    case ALERT_TYPE.PUSH_TO_OPERATOR:
      return (
        <span>
          <FormattedHTMLMessage
            id='Push to operator message'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.FAULT_EVENT_OF_EACH_INVERTERS:
      return (
        <span>
          <FormattedHTMLMessage
            id='Fault event of each inverter message'
            values={{
              name: alertData?.device?.name,
              code: alertData?.alertMessage?.description || '',
              color: alertData?.device?.typeModel === TYPE_MODEL.SMA
                ? renderSMAFaultColor(`${alertData?.alertMessage?.registerNumber}-${alertData?.alertMessage?.bit
                || alertData?.alertMessage?.content}`, alertData?.alertMessage?.modelDevice)
                : renderSunGrowFaultColor(alertData?.alertMessage?.dec)
            }}
          />
        </span>
      )
    case ALERT_TYPE.DIFF_BTW_INVERTER_AND_METER:
      return (
        <span>
          <FormattedHTMLMessage
            id='Different between inverter and meter message'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.ASYNC_INVERTER:
      return (
        <span>
          <FormattedHTMLMessage
            id='Async inverter message'
            values={{ name: alertData?.device?.name, value: numberWithCommas(alertData?.alertValue, 0) || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.YIELD_AT_LOW_COST_TIME:
      return (
        <span>
          <FormattedHTMLMessage
            id='Yield at low cost time message'
            values={{
              name: alertData?.project?.name,
              value: numberWithCommas(alertData?.alertValue / 1000),
              meterType: alertData?.device?.meterNetworkPlace
            }}
          />
        </span>
      )
    case ALERT_TYPE.LOW_EFF_OF_EACH_INVERTER:
      return (
        <span>
          <FormattedHTMLMessage
            id='Low efficiency of each inverter message'
            values={{
              name: alertData?.device?.name,
              value: numberWithCommas(alertData?.alertValue, 0) || 0,
              settingValue: alertData?.settingValue || 0
            }}
          />
        </span>
      )
    case ALERT_TYPE.HAVE_DIFF_YIELD_BTW_PROJECT:
      return (
        <span>
          <FormattedHTMLMessage
            id='Have different yield between project message'
            values={{ name: alertData?.project?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.INSPECTION_EXPIRED:
      return (
        <span>
          <FormattedHTMLMessage
            id='Device inspection date will be expired'
            values={{ name: alertData?.device?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.PV_SENSOR_OVERHEAT:
      return (
        <span>
          <FormattedHTMLMessage
            id='Panel sensor is overheat'
            values={{ name: alertData?.project?.name, value: alertData?.alertValue || 0 }}
          />
        </span>
      )
    case ALERT_TYPE.INVERTER_STRING_ALERT:
      return (
        <span>
          <FormattedHTMLMessage
            id='Inverter lost string current'
            values={{
              value: (localStorage.getItem('language') === 'en'
                ? alertData?.alertMessage?.language?.en
                : alertData?.alertMessage?.language?.vi) || 0
            }}
          />
        </span>
      )
    default:
      return ''
  }
}

const AlertTable = ({
  intl,
  fetchData,
  updateAlert,
  tableData,
  picker,
  total,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  orderBy,
  setOrderBy,
  sortDirection,
  setSortDirection,
  searchValue,
  setSearchValue,
  isShowActiveList,
  filterByDate,
  isHistory,
  isHideProjectNameColumn,
  isHideDeviceNameColumn,
  setIsOpenFilter
}) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  const {
      layout: { skin },
      alert: { alertNotes }
    } = useSelector((state) => state),
    dispatch = useDispatch()

  const [disabledModal, setDisabledModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [alertNoteOptions, setAlertNoteOptions] = useState([])
  const [isOpenNoteModal, setIsOpenNoteModal] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchData({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData()
    }
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchData({ order: `${column.selector} ${direction}` })
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    fetchData({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchData({
      page: maxPage < currentPage
        ? maxPage
        : currentPage,
      rowsPerPage: perPage
    })
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(total / rowsPerPage)

    return (
      <CP
        totalRows={total || 1}
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0
          ? currentPage - 1
          : 0}
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
        displayUnit={intl.formatMessage({ id: 'Alert' }).toLowerCase()}
      />
    )
  }

  // ** Column header
  const serverSideColumns = [
    {
      name: '',
      selector: 'action',
      // eslint-disable-next-line react/display-name
      cell: (row) => (
        <Button.Ripple
          color='flat-primary'
          onClick={() => {
            setSelectedRow(row)
            setDisabledModal(true)

            if (row.from && !isNaN(row.from)) {
              setStartTime(moment(row.from))
            } else (
              setStartTime(null)
            )

            if (row.to && !isNaN(row.to)) {
              setEndTime(moment(row.to))
            } else {
              setEndTime(null)
            }
          }}
        >
          <MoreVertical
            size={14}
            className='cursor-pointer'
          />
        </Button.Ripple>
      ),
      center: true,
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Type' }),
      selector: 'alertType',
      cell: (row) => renderTypeIcon(row),
      sortable: true,
      center: true,
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Project name' }),
      selector: 'projectName',
      cell: (row) => (
        row?.project?.id && row?.project?.name
          ? <Link
            to={{
              pathname: ROUTER_URL.PROJECT_ALARM,
              search: `projectId=${row?.project?.id}&alertType=${isHistory
                ? 'historyAlert'
                : 'activeAlert'}`
            }}
          >
            {row?.project?.name}
          </Link>
          : ''
      ),
      wrap: true,
      minWidth: '80px',
      omit: isHideProjectNameColumn
    },
    {
      name: intl.formatMessage({ id: 'Device name' }),
      selector: 'deviceName',
      cell: (row) => (
        row?.device?.id && row?.device?.name
          ? row?.project?.id
            ? <Link
              to={{
                pathname: ROUTER_URL.PROJECT_ALARM,
                search: `projectId=${row?.project?.id}&alertType=${isHistory
                  ? 'historyAlert'
                  : 'activeAlert'}`
              }}
            >
              {row?.device?.name}
            </Link>
            : row?.device?.name
          : ''
      ),
      wrap: true,
      minWidth: '80px',
      omit: isHideDeviceNameColumn
    },
    {
      name: intl.formatMessage({ id: 'Alert message' }),
      selector: 'alertValue',
      /*eslint-disable */
      cell: (row) => renderAlertMessage({ type: row.alertType, alertData: row }),
      sortable: true,
      wrap: true,
      minWidth: '360px'
    },
    {
      name: intl.formatMessage({ id: 'Alert code' }),
      selector: 'alertCode',
      cell: (row) => renderAlertCode({ row }),
      wrap: true,
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Occurred date' }),
      selector: 'createDate',
      cell: (row) => moment(Number(row.createDate)).format(DISPLAY_DATE_TIME_FORMAT),
      sortable: true,
      minWidth: '150px'
    },
    {
      name: isHistory
        ? intl.formatMessage({ id: 'Restored date' })
        : intl.formatMessage({ id: 'Resolved date' }),
      selector: 'modifyDate',
      cell: (row) => (
        row.modifyDate
          ? moment(Number(row.modifyDate)).format(DISPLAY_DATE_TIME_FORMAT)
          : ''
      ),
      sortable: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Troubleshooter' }),
      selector: 'fullName',
      cell: (row) => row?.handler?.fullName || '',
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'status',
      cell: (row) => renderAlertStatus(row.status),
      sortable: true,
      center: true,
      minWidth: '60px'
    },
    {
      name: intl.formatMessage({ id: 'Note' }),
      selector: 'status',
      cell: (row) => row?.noteAlert?.content,
      center: true,
      minWidth: '60px'
    }
  ]

  const conditionalRowStyles = [
    {
      when: (row) => !row.isRead,
      style: {
        fontWeight: 900
      }
    }
  ]

  useEffect(() => {
    dispatch(getAlertNotes({
      state: [STATE.ACTIVE].toString(),
      rowsPerPage: -1
    }))
  }, [])

  useEffect(() => {
    const tempNotes = []
    alertNotes.forEach(note => {
      tempNotes.push({
        label: note.content,
        value: note.id
      })
    })

    setAlertNoteOptions(tempNotes)
  }, [alertNotes])

  return (
    <Card className='w-100 mb-0'>
      <CardBody className='py-0'>
        <Row className='mb-1'>
          <Col
            md='12'
            className='d-flex justify-content-between'
          >
            <DateRangePicker
              value={picker}
              placeholder={intl.formatMessage({ id: `Pick day` })}
              onChange={filterByDate}
              disabledDate={time => time.getTime() > Date.now()}
              format={DISPLAY_DATE_FORMAT_CALENDAR}
              firstDayOfWeek={1}
            />
            <div className='d-flex justify-content-end'>
              <Button.Ripple
                className='px-0'
                color='flat'
                onClick={() => setIsOpenFilter(true)}
              >
                <IconFilter/>
              </Button.Ripple>
              <Button.Ripple
                color='primary'
                className='add-project'
                onClick={() => fetchData()}
              >
                <FormattedMessage id='Refresh'/>
              </Button.Ripple>
            </div>
          </Col>
          <Col
            className='d-none align-items-center justify-content-sm-end mt-sm-0 mt-1'
            md='6'
          >
            <Label
              className='mr-1'
              for='search-input-alert-table'
            >
              <FormattedMessage id='Search'/>
            </Label>
            <Input
              className='dataTable-filter'
              type='search'
              bsSize='sm'
              id='search-input-alert-table'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({
                id: 'Name'
              })}, ${intl.formatMessage({ id: 'Phone' })}`}
            />
          </Col>
        </Row>
        <DataTable
          noHeader
          responsive
          pagination
          paginationServer
          className={classnames(
            'react-dataTable react-dataTable--alerts',
            { 'overflow-hidden': tableData?.length <= 0 }
          )}
          fixedHeader
          fixedHeaderScrollHeight='calc(100vh - 350px)'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10}/>}
          data={tableData}
          paginationComponent={CustomPagination}
          persistTableHead
          noDataComponent={''}
          onSort={customSort}
          sortServer
          defaultSortAsc={sortDirection === 'asc'}
          defaultSortField={orderBy}
          conditionalRowStyles={conditionalRowStyles}
        />
        <Modal
          isOpen={disabledModal}
          toggle={() => setDisabledModal(!disabledModal)}
          className='modal-dialog-centered modal-dialog__alert'
          backdrop={false}
        >
          <ModalHeader toggle={() => setDisabledModal(!disabledModal)}>
            {
              renderAlertMessage({ type: selectedRow?.alertType, alertData: selectedRow })
            }
          </ModalHeader>
          <ModalBody>
            <Row className='d-flex justify-content-center'>
              {
                (isShowActiveList && ability.can('manage', USER_ABILITY.CAN_UPDATE_ALERT_STATUS))
                && <Col md={4}>
                  <div
                    className='w-100 text-center'
                  >
                  <span className='align-middle'>
                    <FormattedMessage id='Status'/>
                  </span>
                  </div>
                  <DropdownItem divider/>
                  <Button.Ripple
                    className='w-100'
                    color='flat-primary'
                    onClick={() => {
                      updateAlert({
                        id: selectedRow.id,
                        status: ALERT_STATUS.IN_PROGRESS,
                        isRead: ALERT_IS_READ.YES
                      })
                      setDisabledModal(!disabledModal)
                    }}
                  >
                  <span className='mr-50 text-info'>
                    <i className='icofont-tools-alt-2'/>
                  </span>
                    <span className='align-middle'>
                    <FormattedMessage id='In progress'/>
                  </span>
                  </Button.Ripple>
                  <Button.Ripple
                    className='w-100'
                    color='flat-primary'
                    onClick={() => {
                      updateAlert({
                        id: selectedRow.id,
                        status: ALERT_STATUS.RESOLVED,
                        isRead: ALERT_IS_READ.YES
                      })
                      setDisabledModal(!disabledModal)
                    }}
                  >
                  <span className='mr-50 text-success'>
                    <i className='icofont-verification-check'/>
                  </span>
                    <span className='align-middle'>
                    <FormattedMessage id='Resolved'/>
                  </span>
                  </Button.Ripple>
                  <Button.Ripple
                    className='w-100'
                    color='flat-primary'
                    onClick={() => {
                      updateAlert({
                        id: selectedRow.id,
                        status: ALERT_STATUS.UN_RESOLVED,
                        isRead: ALERT_IS_READ.YES
                      })
                      setDisabledModal(!disabledModal)
                    }}
                  >
                  <span className='mr-50 text-danger'>
                    <i className='icofont-close'/>
                  </span>
                    <span className='align-middle'>
                    <FormattedMessage id='Unresolved'/>
                  </span>
                  </Button.Ripple>
                </Col>
              }

              <Col md={4}>
                <div
                  className='w-100 text-center'
                >
                  <span className='align-middle'>
                    <FormattedMessage id='Note'/>
                  </span>
                </div>
                <DropdownItem divider/>
                <Select
                  id='selectNote'
                  name='selectNote'
                  isClearable
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={
                    alertNoteOptions?.length && selectedRow?.noteAlert?.id
                      ? alertNoteOptions?.find((option) => option.value === selectedRow.noteAlert.id)
                      : null
                  }
                  options={alertNoteOptions}
                  onChange={(e) => {
                    updateAlert({
                      id: selectedRow.id,
                      isRead: ALERT_IS_READ.YES,
                      noteAlertId: e?.value
                        ? e.value
                        : 0
                    })
                    setSelectedRow(currentState => (
                      {
                        ...currentState,
                        noteAlert: {
                          id: e?.value
                            ? e.value
                            : 0
                        }
                      }
                    ))
                  }}
                />
                <Button.Ripple
                  className='w-100'
                  color='flat-primary'
                  onClick={() => setIsOpenNoteModal(true)}
                >
                  <Plus size={16}/>
                  <span className='align-middle'>
                    <FormattedMessage id='Add'/>
                  </span>
                </Button.Ripple>
              </Col>
              <Col md={4}>
                <div
                  className='w-100 text-center'
                >
                  <span className='align-middle'>
                    <FormattedMessage id='Time'/>
                  </span>
                </div>
                <DropdownItem divider/>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <TimePicker
                    label={intl.formatMessage({ id: 'Start time' })}
                    value={startTime}
                    maxTime={endTime}
                    onChange={(newValue) => {
                      setStartTime(newValue)
                    }}
                    onClose={() => {
                      updateAlert({
                        id: selectedRow.id,
                        isRead: ALERT_IS_READ.YES,
                        from: moment(startTime).valueOf()
                      })
                      setSelectedRow(currentState => (
                        {
                          ...currentState,
                          from: moment(startTime).valueOf()
                        }
                      ))
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={classnames({ ['alert-time-picker--dark']: skin === 'dark' })}
                      />
                    )}
                  />
                  <TimePicker
                    className='alert-time-picker'
                    label={intl.formatMessage({ id: 'End time' })}
                    value={endTime}
                    minTime={startTime}
                    onChange={(newValue) => {
                      setEndTime(newValue)
                    }}
                    onClose={() => {
                      updateAlert({
                        id: selectedRow.id,
                        isRead: ALERT_IS_READ.YES,
                        to: moment(endTime).valueOf()
                      })
                      setSelectedRow(currentState => (
                        {
                          ...currentState,
                          to: moment(endTime).valueOf()
                        }
                      ))
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={classnames({ ['alert-time-picker--dark']: skin === 'dark' })}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Col>
            </Row>
          </ModalBody>
          <NoteDetail
            isOpenModal={isOpenNoteModal}
            setIsOpenModal={setIsOpenNoteModal}
          />
        </Modal>
      </CardBody>
    </Card>
  )
}

AlertTable.propTypes = {
  intl: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  updateAlert: PropTypes.func,
  tableData: PropTypes.array.isRequired,
  picker: PropTypes.array.isRequired,
  setPicker: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  orderBy: PropTypes.string.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  sortDirection: PropTypes.string.isRequired,
  setSortDirection: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  isShowActiveList: PropTypes.bool,
  filterByDate: PropTypes.func,
  isHistory: PropTypes.bool,
  isHideProjectNameColumn: PropTypes.bool,
  isHideDeviceNameColumn: PropTypes.bool,
  setIsOpenFilter: PropTypes.func
}

export default injectIntl(AlertTable)
