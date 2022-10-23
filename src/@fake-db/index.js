import mock from './mock'
import './navbar/navbarSearch'
import './pages/account-settings'
import './cards/card-analytics'
import './cards/card-statistics'
import './jwt'
import './tables/datatables'
import './tables/user-data'
import './operationUnit/companyList'
import './roofRentalUnit/roofList'
import './project/project'

mock.onAny().passThrough()
