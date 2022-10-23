// ** Third party components
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import UserActivitiesTable from './UserActivitiesTable'
import { Row, Col } from 'reactstrap'

const UserActivities = () => {
  return (
    <>
      <Row>
        <Col sm="12">
          <UserActivitiesTable/>
        </Col>
      </Row>
    </>
  )
}

UserActivities.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(UserActivities)
