import { object, string, func } from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Row } from 'reactstrap'

import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@src/utility/constants'
import SearchBar from '@src/views/common/SearchBar'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const PageHeader = ({ onSearch = () => {}, searchValue }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (searchValue !== value) setValue(searchValue)
  }, [searchValue])

  const handleRedirectToAddNewPage = () => {
    history.push(ROUTER_URL.BILLING_ROOF_RENTAL_UNIT_CREATE)
  }
  return (
    <>
      <Row className="mb-2">
        <Col lg="4" md="8" className="my-lg-0 mb-1 d-flex justify-content-end align-items-center">
          <SearchBar onSearch={onSearch} searchValue={searchValue} placeholder={'find by code company, name company'} />
        </Col>

        {ability.can(USER_ACTION.CREATE, USER_FEATURE.RENTAL_COMPANY) && (
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
  searchValue: string,
  onSearch: func
}

export default injectIntl(PageHeader)
