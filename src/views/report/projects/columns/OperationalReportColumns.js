import { renderProjectBusinessModel, TYPE_MODEL } from '@constants/project'
import {
  getUnionCode,
  numberWithCommas
} from '@utils'
import moment from 'moment'
import {
  renderAlertMessage,
  renderAlertStatus,
  renderSMAFaultColor,
  renderSunGrowFaultColor
} from '@src/views/alert/AlertTable'
import { ALERT_TYPE, DISPLAY_DATE_TIME_FORMAT } from '@constants/common'
import HeaderName from '@src/views/common/table/HeaderName'
import CustomTable from '@src/views/common/table/CustomTable'

export const OPERATIONAL_REPORT_COLUMNS = [
  'ordinalNumber',
  'id',
  'code',
  'projectName',
  'businessModel',
  'wattageAC',
  'wattageDC',
  'acDCRatio',
  'totalYieldTheory',
  'coefficientCF',
  'equivalentHour',
  'efficiency',
  'performance',
  'yieldDecreasedNoMaintenanceYet',
  'yieldDecreasedError',
  'yieldDecreasedEvnCut',
  'meter',
  'inverter',
  'investor',
  'eName',
  'customer'
]

export const renderExportAlertMessage = ({ type, alertData, intl }) => {
  switch (type) {
    case ALERT_TYPE.RESEND_ALERT:
      return (
        {
          message: intl.formatMessage({ id: 'Resend message' }),
          type: ALERT_TYPE.WARNING
        }
      )
    case ALERT_TYPE.INVERTER_OFFLINE:
      return (
        {
          message: intl.formatMessage(
            { id: 'Inverter is offline export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.INVERTER_OVERHEAT:
      return (
        {
          message: intl.formatMessage(
            { id: 'Inverter is overheat export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.WARNING
        }
      )
    case ALERT_TYPE.LOW_EFFICIENCY:
      return (
        {
          message: intl.formatMessage(
            { id: 'Low efficiency message export' },
            {
              name: alertData?.project?.name,
              value: alertData?.alertValue || 0,
              settingValue: alertData?.settingValue || 0
            }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.UNSTABLE_NETWORK:
      return (
        {
          message: intl.formatMessage(
            { id: 'Unstable network message export' },
            { name: alertData?.project?.name }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.DATA_NOT_SYNCED:
      return (
        {
          message: intl.formatMessage(
            { id: 'Data not synced message export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.LOW_COS_PHI:
      return (
        {
          message: intl.formatMessage(
            { id: 'Low cos phi message export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ALERT
        }
      )
    case ALERT_TYPE.METER_OFFLINE:
      return (
        {
          message: intl.formatMessage(
            { id: 'Meter is offline export' },
            { name: alertData?.device?.name }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.PUSH_TO_OPERATOR:
      return (
        {
          message: intl.formatMessage(
            { id: 'Push to operator export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.FAULT_EVENT_OF_EACH_INVERTERS:
      return (
        {
          message: intl.formatMessage(
            { id: 'Fault event of each inverter message export' },
            {
              name: alertData?.device?.name,
              code: alertData?.alertMessage?.description || '',
              color: alertData?.device?.typeModel === TYPE_MODEL.SMA
                ? renderSMAFaultColor(`${alertData?.alertMessage?.registerNumber}-${alertData?.alertMessage?.bit || alertData?.alertMessage?.content}`)
                : renderSunGrowFaultColor(alertData?.alertMessage?.dec)
            }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.DIFF_BTW_INVERTER_AND_METER:
      return (
        {
          message: intl.formatMessage(
            { id: 'Different between inverter and meter message export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ALERT
        }
      )
    case ALERT_TYPE.ASYNC_INVERTER:
      return (
        {
          message: intl.formatMessage(
            { id: 'Async inverter message export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ALERT
        }
      )
    case ALERT_TYPE.YIELD_AT_LOW_COST_TIME:
      return (
        {
          message: intl.formatMessage(
            { id: 'Yield at low cost time message export' },
            {
              name: alertData?.project?.name,
              value: numberWithCommas(alertData?.alertValue / 1000),
              meterType: alertData?.device?.meterNetworkPlace
            }
          ),
          type: ALERT_TYPE.WARNING
        }
      )
    case ALERT_TYPE.LOW_EFF_OF_EACH_INVERTER:
      return (
        {
          message: intl.formatMessage(
            { id: 'Low efficiency of each inverter message export' },
            {
              name: alertData?.device?.name,
              value: alertData?.alertValue || 0,
              settingValue: alertData?.settingValue || 0
            }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    case ALERT_TYPE.HAVE_DIFF_YIELD_BTW_PROJECT:
      return (
        {
          message: intl.formatMessage(
            { id: 'Have different yield between project message export' },
            { name: alertData?.project?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ALERT
        }
      )
    case ALERT_TYPE.INSPECTION_EXPIRED:
      return (
        {
          message: intl.formatMessage(
            { id: 'Device inspection date will be expired export' },
            { name: alertData?.device?.name, value: alertData?.alertValue || 0 }
          ),
          type: ALERT_TYPE.ERROR
        }
      )
    default:
      return {
        message: '',
        type: ALERT_TYPE.WARNING
      }
  }
}

export const renderDeviceColumns = ({ intl, name = 'Inverter' }) => {
  return [
    {
      name: intl.formatMessage({ id: name }),
      selector: 'deviceName',
      cell: row => row?.device?.name || '',
      minWidth: '80px',
      maxWidth: '80px',
      wrap: true
    },
    {
      name: intl.formatMessage({ id: 'Operation report occurred date' }),
      selector: 'occurredDate',
      cell: row => moment(row.createDateTS).format(DISPLAY_DATE_TIME_FORMAT),
      minWidth: '150px',
      maxWidth: '150px',
      wrap: true
    },
    {
      name: intl.formatMessage({ id: 'Operation report alert message' }),
      selector: 'message',
      cell: row => renderAlertMessage({ type: row.alertType, alertData: row }),
      minWidth: '250px',
      maxWidth: '250px',
      wrap: true
    },
    {
      name: intl.formatMessage({ id: 'Evaluate' }),
      cell: row => [
        renderAlertStatus(row.status, true, intl),
        row?.noteAlert?.content
      ].join('. '),
      minWidth: '94px',
      maxWidth: '94px',
      wrap: true
    }
  ]
}

export const renderSystemColumns = (intl) => {
  return [
    {
      name: intl.formatMessage({ id: 'Operation report occurred date' }),
      selector: 'occurredDate',
      cell: row => moment(row.createDateTS).format(DISPLAY_DATE_TIME_FORMAT),
      minWidth: '80px',
      wrap: true
    },
    {
      name: intl.formatMessage({ id: 'Alert message project' }),
      selector: 'message',
      cell: row => renderAlertMessage({ type: row.alertType, alertData: row }),
      minWidth: '80px',
      wrap: true
    },
    {
      name: intl.formatMessage({ id: 'Evaluate' }),
      cell: row => [
        renderAlertStatus(row.status, true, intl),
        row?.noteAlert?.content
      ].join('. '),
      minWidth: '80px',
      wrap: true
    }
  ]
}

export const renderYieldColumns = (intl) => {
  return [
    {
      name: intl.formatMessage({ id: 'Reduction time' }),
      selector: 'occurredDate',
      cell: row => `${intl.formatMessage({ id: 'From' })} ${row?.from
        ? moment(row?.from).format('HH:mm:ss')
        : ''}${row?.to
        ? `- ${moment(row?.to).format('HH:mm:ss')}`
        : ''}`,
      minWidth: '80px',
      wrap: true
    },
    {
      name: intl.formatMessage({ id: 'Inverter or percentage reduction power' }),
      selector: 'message',
      cell: row => row?.inverterNum || 0,
      minWidth: '250px',
      wrap: true,
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Reduction yield' }),
      cell: row => row?.totalYieldDecreased || 0,
      minWidth: '80px',
      wrap: true,
      center: true
    }
  ]
}

export const renderOperationalReportColumns = ({ intl, displayColumns }) => {
  return [
    {
      name: '#',
      cell: (row, index) => (index > 0 ? index : ''),
      style: { position: 'sticky', left: 0, zIndex: 1 },
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: 'ID',
      omit: displayColumns.findIndex(column => column.key === 'ID') === -1,
      cell: (row, index) => (
        typeof row?.code === 'string' && index > 0 ? row?.code?.substring(0, 4) : ''
      ),
      style: { position: 'sticky', left: '50px', zIndex: 1 },
      minWidth: '80px',
      maxWidth: '80px'
    },
    {
      name: intl.formatMessage({ id: 'Project code' }),
      omit: displayColumns.findIndex(column => column.key === 'projectCode') === -1,
      cell: (row, index) => (
        index > 0 ? getUnionCode([row.provinceCode, row.partnerCode, row.electricityCode]) : ''
      ),
      style: { position: 'sticky', left: '130px', zIndex: 1 },
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'Project name' }),
      omit: displayColumns.findIndex(column => column.key === 'projectName') === -1,
      cell: (row, index) => (index > 0 ? row.name : intl.formatMessage({ id: row.name })),
      style: { position: 'sticky', left: '230px', zIndex: 1 },
      minWidth: '250px',
      maxWidth: '250px'
    },
    {
      name: intl.formatMessage({ id: 'Business model' }),
      omit: displayColumns.findIndex(column => column.key === 'businessModel') === -1,
      cell: (row) => renderProjectBusinessModel(row?.type),
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'AC power' })} unit='(kW)'/>,
      omit: displayColumns.findIndex(column => column.key === 'wattageAC') === -1,
      selector: 'wattageAC',
      minWidth: '150px',
      maxWidth: '150px',
      center: true,
      cell: (row) => `${isNaN(Number(row.wattageAC)) ? 0 : numberWithCommas(row.wattageAC / 1000, 0)}`
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'DC power' })} unit='(kWp)'/>,
      omit: displayColumns.findIndex(column => column.key === 'wattageDC') === -1,
      selector: 'wattageDC',
      minWidth: '150px',
      maxWidth: '150px',
      center: true,
      cell: (row) => `${isNaN(Number(row.wattageDC)) ? 0 : numberWithCommas(row.wattageDC / 1000, 0)}`
    },
    {
      name: intl.formatMessage({ id: 'Total errors' }),
      omit: displayColumns.findIndex(column => column.key === 'totalErrors') === -1,
      selector: 'totalErrors',
      minWidth: '80px',
      maxWidth: '150px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Total warnings' }),
      omit: displayColumns.findIndex(column => column.key === 'totalWarning') === -1,
      selector: 'totalWarning',
      minWidth: '80px',
      maxWidth: '150px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Total notes' }),
      omit: displayColumns.findIndex(column => column.key === 'totalNoted') === -1,
      selector: 'totalNoted',
      minWidth: '100px',
      maxWidth: '250px',
      center: true,
      cell: row => `${row.totalNoted}/${row.totalErrors}`
    },
    {
      name: <>
        <div style={{ display: 'inline-block', minWidth: '80px' }}>{intl.formatMessage({ id: 'Meter' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '150px' }}
        >{intl.formatMessage({ id: 'Operation report occurred date' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '240px' }}
        >{intl.formatMessage({ id: 'Operation report alert message' })}</div>
        <div style={{ display: 'inline-block', minWidth: '94px' }}>{intl.formatMessage({ id: 'Evaluate' })}</div>
      </>,
      omit: displayColumns.findIndex(column => column.key === 'meters') === -1,
      selector: 'meters',
      style: { alignItems: 'flex-start' },
      cell: row => {
        return (
          row.meters?.length > 0
            ? <CustomTable
              noHeader
              noTableHead
              responsive
              fixedHeader
              fixedHeaderScrollHeight='300px'
              className='react-dataTable react-dataTable--operation mt-1'
              columns={renderDeviceColumns({ intl, name: 'Meter' })}
              data={row.meters}
            />
            : ''
        )
      },
      minWidth: '600px',
      maxWidth: '600px',
      center: true
    },
    {
      name: <>
        <div style={{ display: 'inline-block', minWidth: '80px' }}>{intl.formatMessage({ id: 'Inverter' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '150px' }}
        >{intl.formatMessage({ id: 'Operation report occurred date' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '240px' }}
        >{intl.formatMessage({ id: 'Operation report alert message' })}</div>
        <div style={{ display: 'inline-block', minWidth: '94px' }}>{intl.formatMessage({ id: 'Evaluate' })}</div>
      </>,
      omit: displayColumns.findIndex(column => column.key === 'inverters') === -1,
      selector: 'inverters',
      style: { alignItems: 'flex-start' },
      cell: row => {
        return (
          row.inverters?.length > 0
            ? <CustomTable
              noHeader
              noTableHead
              responsive
              fixedHeader
              fixedHeaderScrollHeight='300px'
              className='react-dataTable react-dataTable--operation mt-1'
              columns={renderDeviceColumns({ intl, name: 'Inverter' })}
              data={row.inverters}
            />
            : ''
        )
      },
      minWidth: '610px',
      maxWidth: '610px',
      center: true
    },
    {
      name: <>
        <div
          style={{ display: 'inline-block', minWidth: '150px' }}
        >{intl.formatMessage({ id: 'Operation report occurred date' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '240px' }}
        >{intl.formatMessage({ id: 'Alert message project' })}</div>
        <div style={{ display: 'inline-block', minWidth: '94px' }}>{intl.formatMessage({ id: 'Evaluate' })}</div>
      </>,
      omit: displayColumns.findIndex(column => column.key === 'project') === -1,
      selector: 'system',
      style: { alignItems: 'flex-start' },
      cell: row => {
        return (
          row.system?.length > 0
            ? <CustomTable
              noHeader
              noTableHead
              responsive
              fixedHeader
              fixedHeaderScrollHeight='300px'
              className='react-dataTable react-dataTable--operation mt-1'
              columns={renderSystemColumns(intl)}
              data={row.system}
            />
            : ''
        )
      },
      minWidth: '600px',
      maxWidth: '600px',
      center: true
    },
    {
      name: <>
        <div style={{ display: 'inline-block', minWidth: '150px' }}>{intl.formatMessage({ id: 'Reduction time' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '240px' }}
        >{intl.formatMessage({ id: 'Inverter or percentage reduction power' })}</div>
        <div
          style={{ display: 'inline-block', minWidth: '160px' }}
        >{intl.formatMessage({ id: 'Reduction yield' })}</div>
      </>,
      omit: displayColumns.findIndex(column => column.key === 'reductionYield') === -1,
      selector: 'reductionYield',
      style: { alignItems: 'flex-start' },
      cell: row => {
        return (
          row.system?.length > 0
            ? <CustomTable
              noHeader
              noTableHead
              responsive
              fixedHeader
              fixedHeaderScrollHeight='300px'
              className='react-dataTable react-dataTable--operation mt-1'
              columns={renderYieldColumns(intl)}
              data={row.system}
            />
            : ''
        )
      },
      minWidth: '600px',
      maxWidth: '600px',
      center: true
    }
  ]
}
