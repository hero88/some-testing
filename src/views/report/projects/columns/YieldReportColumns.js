import {
  getUnionCode,
  numberWithCommas
} from '@utils'
import HeaderName from '@src/views/common/table/HeaderName'
import { renderNote } from '@src/views/report/projects/YieldReportTable'
import { FormattedMessage } from 'react-intl'
import React from 'react'

export const YIELD_REPORT_COLUMNS = [
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
export const renderYieldReportColumns = ({ intl, displayColumns }) => {
  return [
    {
      name: '#',
      cell: (row, index) => (index > 0
        ? index
        : ''),
      style: { position: 'sticky', left: 0, zIndex: 1 },
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: 'ID',
      omit: displayColumns.findIndex(column => column.key === 'ID') === -1,
      cell: (row, index) => (
        typeof row?.code === 'string' && index > 0
          ? row?.code?.substring(0, 4)
          : ''
      ),
      style: { position: 'sticky', left: '50px', zIndex: 1 },
      minWidth: '80px',
      maxWidth: '80px'
    },
    {
      name: intl.formatMessage({ id: 'Project code' }),
      omit: displayColumns.findIndex(column => column.key === 'projectCode') === -1,
      cell: (row, index) => (
        index > 0
          ? getUnionCode([row.provinceCode, row.partnerCode, row.electricityCode])
          : ''
      ),
      style: { position: 'sticky', left: '130px', zIndex: 1 },
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'Project name' }),
      omit: displayColumns.findIndex(column => column.key === 'projectName') === -1,
      cell: (row, index) => (index > 0
        ? row.name
        : intl.formatMessage({ id: row.name })),
      style: { position: 'sticky', left: '230px', zIndex: 1 },
      minWidth: '250px',
      maxWidth: '250px'
    },
    {
      name: intl.formatMessage({ id: 'Business model' }),
      omit: displayColumns.findIndex(column => column.key === 'businessModel') === -1,
      cell: (row) => (row.type ? <FormattedMessage id={row.type} /> : ''),
      minWidth: '100px'
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'AC power' })}
        unit='(kW)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'wattageAC') === -1,
      selector: 'wattageAC',
      minWidth: '150px',
      cell: (row) => `${isNaN(Number(row.installWattageAc))
        ? 0
        : numberWithCommas(row.installWattageAc / 1000, 0)}`,
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'DC power' })}
        unit='(kWp)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'wattageDC') === -1,
      selector: 'wattageDC',
      minWidth: '150px',
      cell: (row) => `${isNaN(Number(row.installWattageDc))
        ? 0
        : numberWithCommas(row.installWattageDc / 1000, 0)}`,
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'AC/DC ratio' })}
        unit='(%)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'acDCRatio') === -1,
      selector: 'acDCRatio',
      minWidth: '150px',
      cell: (row) => (
        (
          row.installWattageAc
        ) && (
          row.installWattageDc
        )
          ? `${numberWithCommas(row.installWattageAc / row.installWattageDc * 100)}`
          : '0'
      ),
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Production yield' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'productionYield') === -1,
      cell: (row) => numberWithCommas(row.totalYieldProduction / 1000, 0),
      minWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'CF' })}
        unit='(%)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'cf') === -1,
      cell: (row) => numberWithCommas(row.cf * 100, 1) || (
        0
      ).toFixed(1),
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Average Sunshine Hours' })}
        unit={`(${intl.formatMessage({ id: 'hours' })})`}
      />,
      omit: displayColumns.findIndex(column => column.key === 'sunshine') === -1,
      cell: (row) => numberWithCommas(row.sunshine),
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Performance' })}
        unit='(%)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'performance') === -1,
      cell: (row) => numberWithCommas(row.performance, 1),
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Yield reduction by not maintenance' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'totalYieldDecreasedLowPerformance') === -1,
      selector: 'totalYieldDecreasedLowPerformance',
      minWidth: '140px',
      cell: (row) => `${numberWithCommas((
        row?.totalYieldDecreasedLowPerformance / 1000
      ), 0)}`,
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Yield reduction by device faults' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'totalYieldDecreasedDeviceError') === -1,
      selector: 'totalYieldDecreasedEvnCut',
      minWidth: '140px',
      cell: (row) => `${numberWithCommas((
        row?.totalYieldDecreasedEvnCut / 1000
      ), 0)}`,
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Yield reduction by EVN' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'totalYieldDecreasedEvnCut') === -1,
      selector: 'totalYieldDecreasedDeviceError',
      minWidth: '140px',
      cell: (row) => `${numberWithCommas((
        row?.totalYieldDecreasedDeviceError / 1000
      ), 0)}`,
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Inverter yield' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'totalYieldInverter') === -1,
      cell: (row) => `${numberWithCommas((
        row?.totalYieldInverter / 1000
      ), 0)}`,
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Meter yield' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'totalYieldMeter') === -1,
      cell: (row) => `${numberWithCommas((
        row?.totalYieldMeter / 1000
      ), 0)}`,
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Deviation' })}
        unit='(%)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'deviation') === -1,
      cell: (row) => numberWithCommas(row.diffTotalYieldInverterAndMeter),
      minWidth: '100px',
      maxWidth: '100px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Yield sold to EVN' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'saleToEVN') === -1,
      cell: (row) => `${numberWithCommas((
        row?.saleToEVN / 1000
      ), 0)}`,
      minWidth: '200px',
      maxWidth: '200px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Yield sold to customer' })}
        unit='(kWh)'
      />,
      omit: displayColumns.findIndex(column => column.key === 'saleToCustomer') === -1,
      cell: (row) => `${numberWithCommas((
        row?.saleToCustomer / 1000
      ), 0)}`,
      minWidth: '200px',
      maxWidth: '200px',
      right: true
    },
    {
      name: intl.formatMessage({ id: 'Power factor' }),
      omit: displayColumns.findIndex(column => column.key === 'cosphi') === -1,
      cell: (row) => `${numberWithCommas((row?.cosphi), 2)}`,
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: <HeaderName
        name={intl.formatMessage({ id: 'Cos forfeit' })}
        unit={`(${intl.formatMessage({ id: 'VND' })})`}
      />,
      omit: displayColumns.findIndex(column => column.key === 'fineCost') === -1,
      cell: (row) => `${numberWithCommas((
        row?.fineCost
      ))}`,
      minWidth: '150px',
      maxWidth: '150px',
      right: true
    },
    {
      name: intl.formatMessage({ id: 'Note' }),
      omit: displayColumns.findIndex(column => column.key === 'note') === -1,
      cell: (row) => renderNote({ project: row, intl }),
      minWidth: '300px',
      maxWidth: '300px'
    }
  ]
}
