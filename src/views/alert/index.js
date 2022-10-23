import React, { useEffect } from 'react'
import { Card, CardBody, Row } from 'reactstrap'
import AlertActive from '@src/views/alert/active'
import AlertHistory from '@src/views/alert/history'
import ButtonPagination from '@src/views/common/buttons/ButtonPagination'
import { useQuery } from '@hooks/useQuery'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'

const AlertPage = ({ intl }) => {
  const history = useHistory()
  const query = useQuery(),
    projectId = query.get('projectId'),
    alertType = query.get('alertType')

  const buttons = [
    { id: 'activeAlert', name: intl.formatMessage({ id: 'Alert' }) },
    { id: 'historyAlert', name: intl.formatMessage({ id: 'Alert history' }) }
  ]

  useEffect(() => {
    if (!alertType) {
      history.push({
        pathname: ROUTER_URL.ALERT,
        search: `alertType=activeAlert`
      })
    }
  }, [alertType])

  return (
    <Card className='project-alert'>
      <CardBody>
        <Row className='d-flex justify-content-end px-1 group'>
          <ButtonPagination
            devices={buttons}
            projectId={projectId}
            deviceId={alertType}
            pathName={history.location.pathname}
          />
        </Row>
        {
          alertType !== 'historyAlert' &&
          <AlertActive />
        }
        {
          alertType === 'historyAlert' &&
          <AlertHistory />
        }
      </CardBody>
    </Card>
  )
}

AlertPage.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(AlertPage)
