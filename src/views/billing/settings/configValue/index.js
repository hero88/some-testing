/* eslint-disable implicit-arrow-linebreak */
import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import Table from '@src/views/common/table/CustomDataTable'
import { array, bool, func, object, string } from 'prop-types'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import ValueCUForm from './ValueCUForm'
import { GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'
import withReactContent from 'sweetalert2-react-content'
import classnames from 'classnames'
import SweetAlert from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteSettingsValue,
  getBillingSettingValueBySettingId,
  postSettingsValue,
  putSettingsValue
} from '../store/actions/index'
import './styles.scss'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const MySweetAlert = withReactContent(SweetAlert)

const ValueTable = ({
  onCancel = () => {},
  configId,
  disabled,
  intl,
  handleSetIsReadOnly = () => {},
  isReadOnly,
  currValue,
  handldeSetCurrentValue = () => {}
}) => {
  const ability = useContext(AbilityContext)
  const [configValues, setConfigValues] = useState([])
  const dispatch = useDispatch()
  const {
    layout: { skin },
    settings: { selectedSetting }
  } = useSelector((state) => state)
  const fetchConfigValue = () => {
    dispatch(
      getBillingSettingValueBySettingId({
        id: configId,
        callback: (res) => {
          setConfigValues(res || [])
        }
      })
    )
  }

  useEffect(() => {
    fetchConfigValue()
  }, [configId])

  const handleEditValue = (changeValue, _isReadOnly) => () => {
    handleSetIsReadOnly(_isReadOnly)
    handldeSetCurrentValue({ ...changeValue, name: selectedSetting?.name })
  }

  const handleCancelValueForm = () => {
    handldeSetCurrentValue({})
  }

  const handleCallbackForm = () => {
    fetchConfigValue()
    handleCancelValueForm()
  }

  const handleDeleteValue =
    ({ id }) =>
    () => {
      return MySweetAlert.fire({
        title: intl.formatMessage({ id: 'Delete billing customer title' }),
        html: intl.formatMessage({ id: 'Delete billing settings message' }),
        showCancelButton: true,
        confirmButtonText: intl.formatMessage({ id: 'Yes' }),
        cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
        customClass: {
          popup: classnames({
            'sweet-alert-popup--dark': skin === 'dark',
            'sweet-popup': true
          }),
          header: 'sweet-title border-bottom',
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-secondary ml-1',
          actions: 'sweet-actions',
          content: 'sweet-content'
        },
        buttonsStyling: false
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          dispatch(
            deleteSettingsValue({
              id,
              callback: handleCallbackForm,
              skin,
              intl
            })
          )
        }
      })
    }
  const columns = [
    {
      name: <FormattedMessage id="No." />,
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: <FormattedMessage id="Config Name" />,
      selector: 'name',
      cell: () => <span>{selectedSetting.name}</span>
    },
    {
      name: <FormattedMessage id="Configuration Value" />,
      selector: 'value',
      cell: (row) => <span>{row.value}</span>
    },
    {
      name: <FormattedMessage id="explain" />,
      selector: 'description',
      maxWidth: '200px'
    },
    {
      name: <FormattedMessage id="Status" />,
      center: true,
      selector: 'status',
      maxWidth: '200px',

      cell: (row) => {
        return row.state === OPERATION_UNIT_STATUS.ACTIVE ? (
          <Badge pill color="light-success" className="custom-bagde">
            <FormattedMessage id="Active" />
          </Badge>
        ) : (
          <Badge pill color="light-muted" className="custom-bagde">
            <FormattedMessage id="Inactive" />
          </Badge>
        )
      }
    },
    {
      name: <FormattedMessage id="Actions" />,
      selector: '#',
      center: true,
      isHidden: disabled,
      cell: (row) => {
        const isModifyAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.CONFIG)
        return (
          <>
            {ability.can(USER_ACTION.DETAIL, USER_FEATURE.CONFIG) && (
              <>
                {' '}
                <Badge onClick={handleEditValue(row, true)}>
                  <IconView id={`viewBtn_${row.id}`} />
                </Badge>
                <UncontrolledTooltip placement="auto" target={`viewBtn_${row.id}`}>
                  <FormattedMessage id="View Project" />
                </UncontrolledTooltip>
              </>
            )}

            {isModifyAbility && (
              <>
                <Badge onClick={handleEditValue(row)}>
                  <IconEdit id={`editBtn_${row.id}`} />
                </Badge>
                <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                  <FormattedMessage id="Update Project" />
                </UncontrolledTooltip>
                <Badge onClick={handleDeleteValue(row)}>
                  <IconDelete id={`deleteBtn_${row.id}`} />
                </Badge>
                <UncontrolledTooltip placement="auto" target={`deleteBtn_${row.id}`}>
                  <FormattedMessage id="Delete Project" />
                </UncontrolledTooltip>
              </>
            )}
          </>
        )
      }
    }
  ]
  const handleSubmitValueForm = (values) => {
    if (isReadOnly) {
      handleSetIsReadOnly(false)
      return
    }
    const payload = {
      state: values.state?.value,
      value: values.value,
      description: values.description,
      configId
    }

    if (currValue?.id === '-1') {
      dispatch(
        postSettingsValue({
          params: payload,
          callback: handleCallbackForm,
          skin,
          intl
        })
      )
    } else {
      dispatch(
        putSettingsValue({
          params: { ...payload, id: currValue?.id },
          callback: handleCallbackForm,
          skin,
          intl
        })
      )
    }
  }
  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.CONFIG)


  return (
    <>
      <Row className="mb-2">
        <Col>
          <Table columns={columns} pagination={null} data={configValues} />
        </Col>
      </Row>
      <Row className="d-flex justify-content-end align-items-center">
        {/* <Button type="submit" color="primary" className="mr-1 px-3">
            {submitText || intl.formatMessage({ id: isViewed ? 'Update' : 'Save' })}
          </Button>{' '} */}
        <Button className="mr-1 px-3" color="secondary" onClick={onCancel}>
          {intl.formatMessage({ id: 'Back' })}
        </Button>{' '}
      </Row>
      <ValueCUForm
        isReadOnly={isReadOnly}
        value={currValue}
        onSubmit={handleSubmitValueForm}
        onCancel={handleCancelValueForm}
        submitClassname={!checkUpdateAbility && 'd-none'}

      />
    </>
  )
}
ValueTable.propTypes = {
  data: array,
  onChange: func,
  disabled: bool,
  intl: object.isRequired,
  configId: string.isRequired,
  isReadOnly: bool,
  handleSetIsReadOnly: func,
  currValue: object,
  handldeSetCurrentValue: func,
  onCancel: func
}

export default injectIntl(ValueTable)
