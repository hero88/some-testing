import { object, string, func } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { Col, Row } from 'reactstrap'

import SearchBar from '@src/views/common/SearchBar'

const PageHeader = ({ onSearch = () => {}, searchValue }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (searchValue !== value) setValue(searchValue)
  }, [searchValue])


  return (
    <>
      <Row className="mb-2">
        <Col lg="4" md="8" className="my-lg-0 mb-1 d-flex justify-content-end align-items-center">
          <SearchBar
            onSearch={onSearch}
            searchValue={searchValue}
            placeholder={'Find by code rights group, name rights group'}
          />
        </Col>
      </Row>
    </>
  )
}

PageHeader.propTypes = {
  intl: object.isRequired,
  searchValue: string,
  onSearch: func,
  handleChangeValueSearch: func
}

export default injectIntl(PageHeader)
