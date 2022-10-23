import { DEVICE_STATUS, DEVICE_TYPE, renderProjectStatus } from '@constants/project'
import { STATE } from '@constants/common'
import { CardLink } from 'reactstrap'
import { Link } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'
import { numberWithCommas } from '@utils'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import moment from 'moment'
import HeaderName from '@src/views/common/table/HeaderName'

export const monitoringColumns = ({ intl, displayColumns }) => {
  return [
    {
      name: '',
      sortable: true,
      center: true,
      selector: 'status',
      omit: displayColumns.findIndex(column => column === 'status') === -1,
      cell: (row) => (
        row.id === 'projectTotalRow' ? '' : renderProjectStatus(row?.status, row?.id)
      ),
      minWidth: '50px',
      maxWidth: '50px',
      style: { position: 'sticky', left: 0, zIndex: 1 }
    },
    {
      name: intl.formatMessage({ id: 'Project code' }),
      sortable: true,
      center: true,
      selector: 'code',
      omit: displayColumns.findIndex(column => column === 'projectCode') === -1,
      cell: (row) => (
        row.id === 'projectTotalRow'
          ? ''
          : typeof row?.code === 'string'
            ? row?.code?.substring(0, 4)
            : ''
      ),
      minWidth: '100px',
      maxWidth: '100px',
      style: { position: 'sticky', left: '50px', zIndex: 1 }
    },
    {
      name: intl.formatMessage({ id: 'Project name' }),
      selector: 'name',
      omit: displayColumns.findIndex(column => column === 'projectName') === -1,
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          row?.state === STATE.ACTIVE
            ? (
              <CardLink
                tag={Link}
                className='text-primary'
                to={{
                  pathname: ROUTER_URL.PROJECT_OVERVIEW,
                  search: `projectId=${row.id}`
                }}
              >
                {row.name}
              </CardLink>
            )
            : (
              row.name
            )
        )
      },
      sortable: true,
      minWidth: '220px',
      maxWidth: '220px',
      style: { position: 'sticky', left: '150px', zIndex: 1 }
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'AC power' })} unit='(kW)' />,
      selector: 'wattageAC',
      sortable: true,
      center: true,
      omit: displayColumns.findIndex(column => column === 'wattageAC') === -1,
      cell: (row) => `${isNaN(Number(row.wattageAC)) ? 0 : numberWithCommas(row.wattageAC / 1000)}`,
      minWidth: '160px',
      maxWidth: '160px'
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'DC power' })} unit='(kWp)' />,
      selector: 'wattageDC',
      sortable: true,
      center: true,
      minWidth: '160px',
      maxWidth: '160px',
      omit: displayColumns.findIndex(column => column === 'wattageDC') === -1,
      cell: (row) => `${isNaN(Number(row.wattageDC)) ? 0 : numberWithCommas(row.wattageDC / 1000)}`
    },
    {
      name: intl.formatMessage({ id: 'Business model' }),
      selector: 'type',
      sortable: true,
      center: true,
      minWidth: '180px',
      maxWidth: '180px',
      wrap: true,
      omit: displayColumns.findIndex(column => column === 'businessModel') === -1,
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        if (row.id === 'projectTotalRow') {
          return row.type || ''
        } else {
          return row.type ? <FormattedMessage id={row.type} /> : ''
        }
      }
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'Realtime power' })} unit='(kW)' />,
      selector: 'todayActivePower',
      center: true,
      minWidth: '150px',
      omit: displayColumns.findIndex(column => column === 'realtimePower') === -1,
      cell: (row) => numberWithCommas(row?.todayActivePower / 1000)
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'Today yield' })} unit='(kWh)' />,
      selector: 'todayYield',
      minWidth: '160px',
      maxWidth: '160px',
      center: true,
      omit: displayColumns.findIndex(column => column === 'todayYield') === -1,
      cell: (row) => `${numberWithCommas((
        row?.todayYield / 1000
      ))}`
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'Total yield' })} unit='(MWh)' />,
      selector: 'totalYield',
      center: true,
      minWidth: '140px',
      maxWidth: '140px',
      omit: displayColumns.findIndex(column => column === 'totalYield') === -1,
      cell: (row) => `${numberWithCommas((
        row?.monthlyYield / 1000000
      ))}`
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'Equivalent hour' })} unit='(h)' />,
      selector: 'equivalentHour',
      center: true,
      minWidth: '120px',
      maxWidth: '120px',
      omit: displayColumns.findIndex(column => column === 'equivalentHour') === -1,
      cell: (row) => (
        row?.wattageDC ? numberWithCommas((
          row?.todayYield / row.wattageDC
        )) : 0
      )
    },
    {
      name: <HeaderName name={intl.formatMessage({ id: 'CF ratio' })} unit='(%)' />,
      selector: 'coefficientCF',
      center: true,
      omit: displayColumns.findIndex(column => column === 'coefficientCF') === -1,
      cell: (row) => (
        row?.wattageDC ? `${numberWithCommas((
          (
            row?.todayYield / row.wattageDC
          ) / 24 * 100
        ))}` : 0
      )
    },
    {
      name: intl.formatMessage({ id: 'Meter' }),
      selector: 'meter',
      center: true,
      omit: displayColumns.findIndex(column => column === 'meter') === -1,
      cell: (row) => {
        if (row.id === 'projectTotalRow' && row.meters?.length) {
          return row.meters.join(' / ')
        }

        if (row?.devices) {
          const meters = row.devices.filter((item) => item.typeDevice === DEVICE_TYPE.METER)
          const onlineMeters = meters.filter((item) => item.status !== DEVICE_STATUS.INACTIVE)

          return `${onlineMeters.length} / ${meters.length}`
        }

        return ''
      },
      minWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Inverter' }),
      selector: 'inverter',
      center: true,
      omit: displayColumns.findIndex(column => column === 'inverter') === -1,
      cell: (row) => {
        if (row.id === 'projectTotalRow' && row.inverters?.length) {
          return row.inverters.join(' / ')
        }

        if (row?.devices) {
          const inverters = row.devices.filter((item) => item.typeDevice === DEVICE_TYPE.INVERTER)
          const onlineInverters = inverters.filter((item) => item.status !== DEVICE_STATUS.INACTIVE)

          return `${onlineInverters.length} / ${inverters.length}`
        }

        return ''
      },
      minWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Investor' }),
      selector: 'investorName',
      cell: (row) => (
        row.id === 'projectTotalRow' ? '' : row?.investor?.name
      ),
      sortable: true,
      center: true,
      wrap: true,
      minWidth: '220px',
      maxWidth: '220px',
      omit: displayColumns.findIndex(column => column === 'investor') === -1
    },
    {
      name: intl.formatMessage({ id: 'Electricity' }),
      selector: 'electricityName',
      cell: (row) => (
        row.electricityCustomer ? row.electricityCustomer?.fullName : ''
      ),
      center: true,
      wrap: true,
      minWidth: '150px',
      omit: displayColumns.findIndex(column => column === 'eName') === -1
    },
    {
      name: intl.formatMessage({ id: 'Partner' }),
      selector: 'customer',
      center: true,
      omit: displayColumns.findIndex(column => column === 'partner') === -1,
      cell: (row) => (
        row.partner ? row.partner?.fullName : ''
      ),
      minWidth: '250px'
    }
  ]
}

export const informationColumns = ({ intl, displayColumns }) => {
  return [
    {
      name: '',
      sortable: true,
      center: true,
      selector: 'status',
      omit: displayColumns.findIndex(column => column === 'status') === -1,
      cell: (row) => (
        row.id === 'projectTotalRow' ? '' : renderProjectStatus(row?.status, row?.id)
      ),
      minWidth: '50px',
      maxWidth: '50px',
      style: { position: 'sticky', left: 0, zIndex: 1 }
    },
    {
      name: intl.formatMessage({ id: 'Project code' }),
      sortable: true,
      selector: 'code',
      omit: displayColumns.findIndex(column => column === 'projectCode') === -1,
      cell: (row) => (
        row.id === 'projectTotalRow'
          ? ''
          : typeof row?.code === 'string'
            ? row?.code?.substring(0, 4)
            : ''
      ),
      minWidth: '100px',
      maxWidth: '100px',
      style: { position: 'sticky', left: '50px', zIndex: 1 }
    },
    {
      name: intl.formatMessage({ id: 'Project name' }),
      selector: 'name',
      omit: displayColumns.findIndex(column => column === 'projectName') === -1,
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          row?.state === STATE.ACTIVE
            ? (
              <CardLink
                tag={Link}
                className='text-primary'
                to={{
                  pathname: ROUTER_URL.PROJECT_INFO_GENERAL,
                  search: `projectId=${row.id}`
                }}
              >
                {row.name}
              </CardLink>
            )
            : (
              row.name
            )
        )
      },
      sortable: true,
      minWidth: '220px',
      maxWidth: '220px',
      style: { position: 'sticky', left: '150px', zIndex: 1 }
    },
    {
      name: intl.formatMessage({ id: 'Date of commission' }),
      selector: 'startDate',
      sortable: true,
      minWidth: '160px',
      omit: displayColumns.findIndex(column => column === 'startDate') === -1,
      cell: (row) => (
        row.startDate ? moment(Number(row.startDate)).format('DD/MM/YYYY') : ''
      )
    },
    {
      name: intl.formatMessage({ id: 'Investor' }),
      selector: 'investorName',
      sortable: true,
      minWidth: '150px',
      omit: displayColumns.findIndex(column => column === 'investorName') === -1,
      cell: (row) => row?.investor?.name
    },
    {
      name: intl.formatMessage({ id: 'Partner' }),
      selector: 'partner',
      sortable: true,
      minWidth: '180px',
      omit: displayColumns.findIndex(column => column === 'partner') === -1,
      cell: (row) => row?.partner?.fullName
    },
    {
      name: intl.formatMessage({ id: 'Customer' }),
      selector: 'customer',
      sortable: true,
      minWidth: '180px',
      wrap: true,
      omit: displayColumns.findIndex(column => column === 'customer') === -1,
      cell: (row) => row?.partner?.fullName
    },
    {
      name: intl.formatMessage({ id: 'Electricity code' }),
      selector: 'electricityCode',
      sortable: true,
      minWidth: '160px',
      omit: displayColumns.findIndex(column => column === 'electricityCode') === -1,
      cell: (row) => row?.electricityCode
    },
    {
      name: intl.formatMessage({ id: 'Electricity name' }),
      selector: 'electricityName',
      sortable: true,
      minWidth: '140px',
      omit: displayColumns.findIndex(column => column === 'electricityName') === -1,
      cell: (row) => (row.electricityCustomer ? row.electricityCustomer?.fullName : '')
    },
    {
      name: intl.formatMessage({ id: 'Address' }),
      selector: 'address',
      sortable: true,
      minWidth: '120px',
      omit: displayColumns.findIndex(column => column === 'address') === -1,
      cell: (row) => <CardLink
        tag={Link}
        className='text-primary'
        to={{
          pathname: ROUTER_URL.PROJECT_INFO_MAP,
          search: `projectId=${row.id}`
        }}
      >
        {row?.address}
      </CardLink>
    }
  ]
}
