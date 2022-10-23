import { object, string, func } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, injectIntl, useIntl } from 'react-intl'
import { Col, Row } from 'reactstrap'
import Select from 'react-select'
import SearchBar from '@src/views/common/SearchBar'
import { Controller, useForm } from 'react-hook-form'
import { selectThemeColors } from '@src/utility/Utils'
import { getRoles } from '../permission-group/store/actions'
import { useDispatch, useSelector } from 'react-redux'

const PageHeader = ({ onSearch = () => {}, searchValue }) => {
  const [value, setValue] = useState('')
  const { roles } = useSelector((state) => state.permissionGroup)
  const dispatch = useDispatch()

  const labelRoles = roles.map((item) => ({ value: item.id, label: item.name }))
 
  useEffect(() => {
    dispatch(getRoles())
  }, [])
  useEffect(() => {
    if (searchValue !== value) setValue(searchValue)
  }, [searchValue])
  const intl = useIntl()

  const { control, register, watch } = useForm({ mode: 'onChange' })
  const onSearchs = (value) => {
    onSearch({ name: value })
  }
  useEffect(() => {
    onSearch({ roleId: watch('roles')?.value })
  }, [watch('roles')])
  return (
    <>
      <Row className="mb-2 billing-form">
        <Col lg="3" md="6" className="">
          <Controller
            as={Select}
            options={labelRoles}
            control={control}
            theme={selectThemeColors}
            name="roles"
            id="roles"
            innerRef={register()}
            className="react-select"
            classNamePrefix="select"
            placeholder={intl.formatMessage({ id: 'permission-group' })}
            formatOptionLabel={(option) => <>{option.label}</>}
            noOptionsMessage={() => <FormattedMessage id="There are no records to display" />}
            blurInputOnSelect
          />
        </Col>
        <Col lg="4" md="8" className="my-lg-0 mb-1 d-flex justify-content-end align-items-center">
          <SearchBar onSearch={onSearchs} searchValue={searchValue} placeholder={'Find by user'} />
        </Col>
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
