import { func, object, string } from 'prop-types'
import React, { useContext } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Row } from 'reactstrap'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@src/utility/constants'
import Filter from './Filter'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const PageHeader = ({ onFilter, filterValue }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()

  const handleRedirectToAddNewPage = () => {
    history.push(ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK_CREATE)
  }

  return (
    <>
      <Row className="mb-2">
        <Col lg="4" md="8" className="my-lg-0 mb-1 ">
          <Filter onSubmit={onFilter} filterValue={filterValue}>
            <span className="mr-2 " role="button">
              <IconFilter />
            </span>
          </Filter>
        </Col>

        {ability.can(USER_ACTION.CREATE, USER_FEATURE.BILL_PARAMS) && (
          <Col lg={{ offset: 4, size: 4 }} md={4} className="d-flex justify-content-end align-items-center">
            <Button.Ripple color="primary" className="add-project" onClick={handleRedirectToAddNewPage}>
              <FormattedMessage id="Add new" />
            </Button.Ripple>
          </Col>
        )}
      </Row>
    </>
  )
}

PageHeader.propTypes = {
  intl: object.isRequired,
  onSearch: func,
  onFilter: func,
  searchValue: string,
  filterValue: object
}

export default injectIntl(PageHeader)
