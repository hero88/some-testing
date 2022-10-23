import {} from 'react'
import GeneralTabContent from './GeneralTabContent'
import { Row, Col } from 'reactstrap'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import PasswordTabContent from '../change-password/PasswordTabContent'

const AccountSettings = () => {
  return (
    <>
      <Row>
        <Col md={6}>
          <GeneralTabContent />
        </Col>
        <Col md={6}>
          <PasswordTabContent />
        </Col>
      </Row>
    </>
  )
}

AccountSettings.propTypes = {}

export default AccountSettings
