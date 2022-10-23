// ** Routes Imports
import PagesRoutes from './Pages'
import DashboardRoutes from './Dashboards'
import SettingsRoutes from './Settings'
import { MonitoringRoutes } from './Monitoring'
import { AlertRoutes } from './Alert'
import { ReportRoutes } from './Report'
import SwaggerRoutes from './Swagger'
import { BillingRoutes } from './Billing'
import { SystemRoutes } from './System'
import PublicRoutes from './Public'

// ** Document title
const TemplateTitle = '%s - REE Solar Monitoring'

// ** Default Route
const DefaultRoute = '/dashboard'
// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...PagesRoutes,
  ...AlertRoutes,
  ...MonitoringRoutes,
  ...ReportRoutes,
  ...SettingsRoutes,
  ...SwaggerRoutes,
  ...BillingRoutes,
  ...SystemRoutes
]

export { DefaultRoute, TemplateTitle, Routes, PublicRoutes }
