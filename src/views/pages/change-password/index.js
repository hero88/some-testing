import { Fragment } from 'react'
import { injectIntl } from 'react-intl'

import Breadcrumbs from '@components/breadcrumbs'
import PasswordTabContent from './PasswordTabContent'
import { Card, CardBody } from 'reactstrap'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import PropTypes from 'prop-types'

const ChangePassword = ({ intl }) => {
  return (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle={intl.formatMessage({ id: 'Password' })}
        breadCrumbActive={intl.formatMessage({ id: 'Change Password' })}
      />
      <Card>
        <CardBody>
          <PasswordTabContent/>
        </CardBody>
      </Card>
    </Fragment>
  )
}

ChangePassword.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ChangePassword)
