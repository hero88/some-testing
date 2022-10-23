import { func, object, string } from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Row } from 'reactstrap'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@src/utility/constants'
import Filter from './Filter'
import SearchBar from '@src/views/common/SearchBar'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const PageHeader = ({ onFilter, onSearch, searchValue }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (searchValue !== value) setValue(searchValue)
  }, [searchValue])

  const handleRedirectToAddNewPage = () => {
    history.push(ROUTER_URL.BILLING_CUSTOMER_CREATE)
  }

  return (
    <>
      <Row className="mb-2">
        <Col lg="4" md="8" className="my-lg-0 mb-1 d-flex justify-content-end align-items-center">
          <Filter onSubmit={onFilter}>
            <span className="mr-2" role="button">
              <IconFilter />
            </span>
          </Filter>
          <SearchBar
            onSearch={onSearch}
            searchValue={searchValue}
            placeholder={'customer-list-search-input-placeholder'}
          />
        </Col>

        {ability.can(USER_ACTION.CREATE, USER_FEATURE.CUSTOMER) && (
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
  onFilter: func,
  onSearch: func,
  searchValue: string
}

export default injectIntl(PageHeader)
