import { ROUTER_URL } from '@src/utility/constants'
import SearchBar from '@src/views/common/SearchBar'
import { func, object, string } from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'
import Filter from './Filter'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const PageHeader = ({ onSearch = () => {}, searchValue, onFilter }) => {
  const history = useHistory()
  const ability = useContext(AbilityContext)

  const [value, setValue] = useState('')

  useEffect(() => {
    if (searchValue !== value) setValue(searchValue)
  }, [searchValue])

  const handleRedirectToAddNewPage = () => {
    history.push(ROUTER_URL.BILLING_PROJECT_CREATE)
  }

  return (
    <>
      <Row className="mb-2">
        <Col lg="4" md="8" className="my-lg-0 mb-1 d-flex justify-content-end align-items-center">
          <Filter onSubmit={onFilter}>
            <span className="mr-2 " role="button">
              <IconFilter />
            </span>
          </Filter>
          <SearchBar
            onSearch={onSearch}
            searchValue={searchValue}
            placeholder={'project-list-search-input-placeholder'}
          />
        </Col>

        {ability.can(USER_ACTION.CREATE, USER_FEATURE.PROJECT) && (
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
  searchValue: string
}

export default injectIntl(PageHeader)
