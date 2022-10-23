import DeviceStatus from '@src/views/common/DeviceStatus'
import { v4 as uuidV4 } from 'uuid'
import { FormattedMessage } from 'react-intl'
import { ReactComponent as IconConnect } from '@src/assets/images/svg/table/ic-connect.svg'
import { ReactComponent as IconDisconnect } from '@src/assets/images/svg/table/ic-disconnect.svg'
import { ReactComponent as IconWarning } from '@src/assets/images/svg/table/ic-warning.svg'
import { ReactComponent as IconError } from '@src/assets/images/svg/table/ic-error.svg'
import { Button } from 'reactstrap'
import React from 'react'

export const PROJECT_STATUS = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  WARNING: 'WARNING',
  DANGER: 'DANGER'
}

export const PROJECT_STATUS_OPTIONS = [
  { label: 'Disconnected', value: PROJECT_STATUS.INACTIVE },
  { label: 'Connected', value: PROJECT_STATUS.ACTIVE },
  { label: 'Warning', value: PROJECT_STATUS.WARNING },
  { label: 'Danger', value: PROJECT_STATUS.DANGER }
]

export const PROJECT_BUSINESS_MODEL = {
  EVN: {
    value: 'EVN',
    text: 'EVN'
  },
  CUSTOMER_EVN: {
    value: 'CUSTOMER_EVN',
    text: 'Customer & EVN'
  },
  CUSTOMER: {
    value: 'CUSTOMER',
    text: 'Customer'
  },
  CUSTOMER_INDUSTRIAL_AREA: {
    value: 'CUSTOMER_INDUSTRIAL_AREA',
    text: 'Customer & Industrial Area'
  }
}

export const renderProjectBusinessModel = (type) => {
  switch (type) {
    case PROJECT_BUSINESS_MODEL.EVN.value:
      return <FormattedMessage id={PROJECT_BUSINESS_MODEL.EVN.text} />

    case PROJECT_BUSINESS_MODEL.CUSTOMER.value:
      return <FormattedMessage id={PROJECT_BUSINESS_MODEL.CUSTOMER.text} />

    case PROJECT_BUSINESS_MODEL.CUSTOMER_INDUSTRIAL_AREA.value:
      return <FormattedMessage id={PROJECT_BUSINESS_MODEL.CUSTOMER_INDUSTRIAL_AREA.text} />

    case PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.value:
      return <FormattedMessage id={PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.text} />

    default:
      return ''
  }
}

export const getBusinessModels = (intl) => {
  return Object.values(PROJECT_BUSINESS_MODEL).map((model) => (
      {
        id: model.value,
        name: intl.formatMessage({ id: model.text })
      }
    )
  )
}

export const PROJECT_BUSINESS_MODEL_OPTIONS = [
  { value: PROJECT_BUSINESS_MODEL.EVN.value, label: PROJECT_BUSINESS_MODEL.EVN.text },
  { value: PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.value, label: PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.text },
  { value: PROJECT_BUSINESS_MODEL.CUSTOMER.value, label: PROJECT_BUSINESS_MODEL.CUSTOMER.text },
  {
    value: PROJECT_BUSINESS_MODEL.CUSTOMER_INDUSTRIAL_AREA.value,
    label: PROJECT_BUSINESS_MODEL.CUSTOMER_INDUSTRIAL_AREA.text
  }
]

export const DEVICE_TYPE = {
  METER: 1,
  INVERTER: 2,
  PANEL: 3,
  TRANSFORMER: 4,
  SINGLE_LINE: 5
}

export const DEVICE_STATUS = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  WARNING: 'WARNING',
  DANGER: 'DANGER'
}

export const DEVICE_STATUS_OPTIONS = [
  { label: 'Disconnected', value: DEVICE_STATUS.INACTIVE },
  { label: 'Connected', value: DEVICE_STATUS.ACTIVE },
  { label: 'Warning', value: DEVICE_STATUS.WARNING },
  { label: 'Danger', value: DEVICE_STATUS.DANGER }
]

export const DEVICE_TYPE_OPTIONS = [
  { label: 'Meter', value: DEVICE_TYPE.METER },
  { label: 'Inverter', value: DEVICE_TYPE.INVERTER },
  { label: 'Solar panel', value: DEVICE_TYPE.PANEL }
]

export const selectTypeDeviceLabel = (value) => {
  switch (value) {
    case DEVICE_TYPE.METER:
      return 'Meter'
    case DEVICE_TYPE.INVERTER:
      return 'Inverter'
    case DEVICE_TYPE.PANEL:
      return 'Solar panel'
    case DEVICE_TYPE.TRANSFORMER:
      return 'Transformer'
    default:
      return ''
  }
}

export const TYPE_MODEL = {
  THREE_PHASE: 1,
  ONE_PHASE: 2,
  CPCIT: 3,
  SUNGROW: 4,
  SMA: 5
}

export const TYPE_MODEL_OPTIONS = [
  { label: 'CPCIT', value: TYPE_MODEL.CPCIT },
  { label: 'Sungrow', value: TYPE_MODEL.SUNGROW },
  { label: 'SMA', value: TYPE_MODEL.SMA }
]

export const METER_TYPE_MODEL_OPTIONS = [
  { label: '3 phases', value: TYPE_MODEL.THREE_PHASE },
  { label: '1 phase', value: TYPE_MODEL.ONE_PHASE }
]

export const METER_TYPE = {
  SOLAR: 'SOLAR',
  GRID: 'GRID',
  CUSTOMER: 'CUSTOMER'
}

export const METER_MODEL = {
  VINASINO: 'Vinasino',
  ELSTER: 'Elster'
}

export const METER_TYPE_OPTIONS = [
  { label: METER_TYPE.SOLAR, value: METER_TYPE.SOLAR },
  { label: METER_TYPE.GRID, value: METER_TYPE.GRID },
  { label: METER_TYPE.CUSTOMER, value: METER_TYPE.CUSTOMER }
]

export const selectTypeModelLabel = (value) => {
  switch (value) {
    case TYPE_MODEL.THREE_PHASE:
      return '3 phases'
    case TYPE_MODEL.CPCIT:
      return 'CPCIT'
    case TYPE_MODEL.SUNGROW:
      return 'Sungrow'
    case TYPE_MODEL.SMA:
      return 'SMA'
    case TYPE_MODEL.ONE_PHASE:
      return '1 phase'
    case METER_TYPE.GRID:
      return 'Grid'
    case METER_TYPE.SOLAR:
      return 'Solar'
    default:
      return ''
  }
}

// Render Project status
export const renderProjectStatus = (status) => {
  switch (status) {
    case PROJECT_STATUS.ACTIVE:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconConnect />
            ),
            color: 'flat-muted',
            title: 'Project is active title',
            message: 'Project is active message'
          }}
        />
      )
    case PROJECT_STATUS.WARNING:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconWarning />
            ),
            color: 'flat-muted',
            title: 'Project is warning title',
            message: 'Project is warning message'
          }}
        />
      )
    case PROJECT_STATUS.DANGER:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconError />
            ),
            color: 'flat-muted',
            title: 'Project is error title',
            message: 'Project is error message'
          }}
        />
      )
    case PROJECT_STATUS.INACTIVE:
    default:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconDisconnect />
            ),
            color: 'flat-muted',
            title: 'Project is inactive title',
            message: 'Project is inactive message'
          }}
        />
      )
  }
}

// Render device status
export const renderDeviceStatus = (status) => {
  switch (status) {
    case DEVICE_STATUS.ACTIVE:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconConnect />
            ),
            color: 'flat-muted',
            title: 'Connection details',
            message: 'Connection details message'
          }}
        />
      )

    case DEVICE_STATUS.WARNING:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconWarning />
            ),
            color: 'flat-muted',
            title: 'Warning details',
            message: 'Warning details message'
          }}
        />
      )

    case DEVICE_STATUS.DANGER:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconError />
            ),
            color: 'flat-muted',
            title: 'Error details',
            message: 'Error details message'
          }}
        />
      )

    case DEVICE_STATUS.INACTIVE:
    default:
      return (
        <DeviceStatus
          status={{
            id: uuidV4(),
            icon: (
              <IconDisconnect />
            ),
            color: 'flat-muted',
            title: 'Disconnection details',
            message: 'Disconnection details message'
          }}
        />
      )
  }
}

// Render project status text
export const renderProjectStatusText = (status) => {
  switch (status) {
    case PROJECT_STATUS.ACTIVE:
      return (
        <Button.Ripple className='status' color='success' outline>
          <FormattedMessage id={PROJECT_STATUS.ACTIVE} />
        </Button.Ripple>
      )
    case PROJECT_STATUS.WARNING:
      return (
        <Button.Ripple className='status' color='warning' outline>
          <FormattedMessage id={PROJECT_STATUS.WARNING} />
        </Button.Ripple>
      )
    case PROJECT_STATUS.DANGER:
      return (
        <Button.Ripple className='status' color='danger' outline>
          <FormattedMessage id={PROJECT_STATUS.DANGER} />
        </Button.Ripple>
      )
    case PROJECT_STATUS.INACTIVE:
    default:
      return (
        <Button.Ripple className='status' color='muted' outline>
          <FormattedMessage id={PROJECT_STATUS.INACTIVE} />
        </Button.Ripple>
      )
  }
}

// Marker type
export const MARKER_TYPE = {
  PROJECT: 'PROJECT LOCATION',
  ELECTRICITY: 'ELECTRICITY LOCATION'
}
