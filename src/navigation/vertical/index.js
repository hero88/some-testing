// ** Navigation sections imports
import dashboards from './dashboards'
import monitoring from './monitoring'
import report from './report'
import settings from './settings'

// billing
import operatingUnit from './operatingUnit'
import configuration from './configuration'
import customer from './customer'
import roofRentalUnit from './roofRentalUnit'
import project  from './project'
import metricElectric from './metricElectric'

//system
import rightsGroup from './rightsGroup'
import userRole from './decentralization'

const solarMonitoringItems = [...dashboards, ...monitoring, ...report, ...settings]
const billingInvoicesItems = [...configuration, ...operatingUnit,  ...customer, ...roofRentalUnit, ...project, ...metricElectric]
const systemItems = [...rightsGroup, ...userRole]
const solarMonitoring = [
    {
        id: 'solarMonitoring',
        title: 'SolarMonitoring',
        children: [...solarMonitoringItems]
    }
]

const billing = [
    {
        id: 'billingInvoices',
        title: 'BillingInvoice',
        children: [...billingInvoicesItems]
    }
]
const system = [
    {
        id: 'system',
        title: 'system',
        children: [...systemItems]
    }
]
// ** Merge & Export
export default [...solarMonitoring, ...billing, ...system]