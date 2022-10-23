// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import form from './form'
import customer from '@src/views/settings/customers/store/reducer'
import billingCustomer from '@src/views/billing/customer/store/reducer'
import customerProject from '@src/views/monitoring/projects/store/reducer'
import project from '@src/views/settings/projects/store/reducer'
import user from '@src/views/settings/users/store/reducer'
import meter from '@src/views/monitoring/project/devices/meters/store/reducer'
import inverter from '@src/views/monitoring/project/devices/inverters/store/reducer'
import panel from '@src/views/monitoring/project/devices/panels/store/reducer'
import deviceTypeInverter from '@src/views/settings/device-types/inverter/store/reducer'
import deviceTypePanel from '@src/views/settings/device-types/panel/store/reducer'
import sensorSetting from '@src/views/monitoring/project/store/reducer'
import device from '@src/views/monitoring/project/devices/store/reducer'
import monitoringMeter from '@src/views/monitoring/devices/meter/store/reducer'
import monitoringInverter from '@src/views/monitoring/devices/inverter/store/reducer'
import alert from '@src/views/alert/store/reducer'
import report from '@src/views/report/store/reducer'
import company from '@src/views/billing/operation-unit/store/reducer'
import roofUnit from '@src/views/billing/roof-rental-unit/store/reducer'
import settings from '@src/views/billing/settings/store/reducer'
import billingContacts from '@src/views/billing/contact/store/reducer'
import projects from '@src/views/billing/project/store/reducer'
import projectContracts from '@src/views/billing/contract/store/reducer'
import contractClock from '@src/views/billing/clock/store/reducer'
import billingMeter from '@src/views/billing/clock-metric/store/reducer'
import billingInputClockIndex from '@src/views/billing/input-clock-index/store/reducer'
import permissionGroup from '@src/views/system/permission-group/store/reducer'
import userRole from '@src/views/system/user-role/store/reducer'


const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  customer,
  customerProject,
  project,
  device,
  meter,
  inverter,
  panel,
  user,
  monitoringMeter,
  monitoringInverter,
  alert,
  report,
  deviceTypeInverter,
  deviceTypePanel,
  sensorSetting,
  company,
  billingCustomer,
  roofUnit,
  settings,
  billingContacts,
  projects,
  projectContracts,
  contractClock,
  form,
  billingMeter,
  billingInputClockIndex,
  permissionGroup,
  userRole
})

export default rootReducer
