import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import Table from '@src/views/common/table/CustomDataTable'
import { object, bool, func, string } from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Button, Col, Form, Input, Label, Row } from 'reactstrap'
import './styles.scss'
import * as yup from 'yup'

import { ISO_STANDARD_FORMAT, SET_FORM_DIRTY } from '@src/utility/constants'
import { ReactComponent as IconX } from '@src/assets/images/svg/table/X.svg'
import EditRoleModal from './EditRoleModal'
import classnames from 'classnames'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import moment from 'moment'
import { useEffect } from 'react'
import { getAllUserFeature } from './store/actions'
import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { isEqual } from 'lodash'
import { showToast } from '@src/utility/Utils'

const MySweetAlert = withReactContent(SweetAlert)

const RoleGroupCUForm = ({ intl, isReadOnly, initValues, onSubmit, onCancel, submitClassname }) => {
  const initState = {
    code: '',
    name: '',
    createDate: moment().format(ISO_STANDARD_FORMAT),
    createBy: 'System',
    permissionsByFeature: []
  }
  const {
    permissionGroup: { allUserFeature }
  } = useSelector((state) => state)

  const {
    handleSubmit,
    getValues,
    errors,
    control,
    register,
    reset,
    setValue,
    watch,
    formState: { isDirty: isDirtyForm }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(yup.object().shape({})),
    defaultValues: initValues || initState
  })

  const dispatch = useDispatch()
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const handleDeletePermissionOfFeature = (onChange, per) => () => {
    MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete billing customer title' }),
      html: intl.formatMessage({ id: 'Are you sure to delete permission ?' }),
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark',
          'sweet-popup': true
        }),
        header: 'sweet-title',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1',
        actions: 'sweet-actions',
        content: 'sweet-content'
      },
      buttonsStyling: false
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        const permissionsData = watch('permissions')
        const newPermissionsData = permissionsData.filter((item) => item.id !== per.id)

        onChange(newPermissionsData)
      }
    })
  }
  const isDirty = isDirtyForm || !isEqual(watch('permissions'), initValues.permissions)

  useEffect(() => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: isDirty
    })
  }, [isDirty])

  const handleDeleteFeature = (onChange, code) => () => {
    const permissionsData = watch('permissions')

    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete billing customer title' }),
      html: intl.formatMessage({ id: 'Delete Feature message' }),
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark',
          'sweet-popup': true
        }),
        header: 'sweet-title',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1',
        actions: 'sweet-actions',
        content: 'sweet-content'
      },
      buttonsStyling: false
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        const newPermissionsData = permissionsData.filter((item) => item.feature !== code)

        onChange?.(newPermissionsData)
      }
    })
  }

  useEffect(() => {
    dispatch(getAllUserFeature())
  }, [])

  useEffect(() => {
    if (initValues?.id) {
      reset({
        ...initValues,
        createDate: initValues?.createDate
          ? moment(initValues.createDate).format(ISO_STANDARD_FORMAT)
          : moment().format(ISO_STANDARD_FORMAT),
        createBy: initValues.createBy || initState.createBy
      })
    } else {
      reset({ ...initState })
    }
  }, [initValues?.id])

  const columns = (onChange) => [
    {
      name: intl.formatMessage({ id: 'Feature' }),
      cell: (row) => <>{(allUserFeature || []).find((ft) => ft.code === row.code)?.name}</>,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Role' }),
      sortable: true,
      minWidth: '900px',
      cell: (row) => {
        return (
          <Row className="w-100">
            {(row.permissions || []).map((per) => (
              <Col key={per} md={2}>
                <Badge pill className="mr-2 badges float-left w-100 ">
                  <span className="text-capitalize ">{per.action?.replaceAll('_', ' ').toLowerCase()}</span>
                  {!isReadOnly && (
                    <IconX
                      className="ml-2 icon-x"
                      id={`rmBtn_${per}`}
                      onClick={handleDeletePermissionOfFeature(onChange, per)}
                    />
                  )}
                </Badge>
              </Col>
            ))}
          </Row>
        )
      }
    },

    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',
      isHidden: isReadOnly,
      cell: (row) => (
        <>
          {' '}
          <Badge>
            {!isReadOnly && <IconDelete onClick={handleDeleteFeature(onChange, row.code)} id={`deleteBtn_${row.id}`} />}
          </Badge>
        </>
      ),
      center: true
    }
  ]

  const handleChangeRoleModal = (values) => {
    setValue('permissions', values)
  }

  const handleSubmitRoleGroupForm = (values) => {
    if (!values.permissions?.length > 0) {
      showToast('error', <FormattedMessage id="Need at least 1 feature" />)
      return
    }
    onSubmit?.(values)
  }

  const groupPermissionByFeature = (_permissions) => {
    return (_permissions || [])
      .sort((a, b) => a.id - b.id)
      .reduce((featureArray, permission) => {
        if (!featureArray.find((ft) => ft.code === permission.feature)) {
          return [
            ...featureArray,
            {
              code: permission.feature,
              permissions: [permission]
            }
          ]
        }
        return featureArray.map((ft) => {
          return ft?.code === permission.feature ? { ...ft, permissions: [...ft.permissions, permission] } : ft
        })
      }, [])
  }

  return (
    <Form className="billing-form" onSubmit={handleSubmit(handleSubmitRoleGroupForm)}>
      <Row className="mt-1 justify-content-md-between">
        <Col className="mb-2" md="3">
          <Label className="general-label" for="exampleSelect">
            {intl.formatMessage({ id: 'Rights group code' })}
          </Label>
          <Input disabled autoComplete="on" id="code" name="code" innerRef={register()} />
        </Col>
        <Col className="mb-2" md="3">
          <Label className="general-label" for="exampleSelect">
            {intl.formatMessage({ id: 'Rights group name' })}
          </Label>
          <Input
            disabled={isReadOnly}
            autoComplete="on"
            id="name"
            name="name"
            innerRef={register()}
            invalid={!isReadOnly && !!errors.name}
            valid={!isReadOnly && getValues('name')?.trim() && !errors.name}
          />
        </Col>
        <Col className="mb-2" md="3">
          <Label className="general-label" for="exampleSelect">
            {intl.formatMessage({ id: 'CreatedDate' })}
          </Label>
          <Input
            disabled
            defaultValue={moment()}
            autoComplete="on"
            id="createDate"
            name="createDate"
            type="date"
            innerRef={register()}
          />
        </Col>
        <Col className="mb-2" md="3">
          <Label className="general-label" for="exampleSelect">
            {intl.formatMessage({ id: 'Created by' })}
          </Label>
          <Input disabled defaultValue={'System'} id="createBy" name="createBy" innerRef={register()} />
        </Col>
      </Row>
      <Row className="d-flex justify-content-end">
        <Col md={4} className="d-flex justify-content-end">
          {!isReadOnly && (
            <EditRoleModal onSubmit={handleChangeRoleModal} permissions={watch('permissions')}>
              <Button.Ripple color="primary" className="add-project btn-choose">
                <FormattedMessage id="Choose Role" />
              </Button.Ripple>
            </EditRoleModal>
          )}
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm="12">
          <Controller
            control={control}
            name="permissions"
            id="permissions"
            innerRef={register()}
            render={(fields) => {
              return (
                <Table
                  pagination={false}
                  columns={columns(fields.onChange)}
                  data={groupPermissionByFeature(fields.value)}
                  keyField="code"
                />
              )
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end align-items-center mt-5 mb-2">
          <Button type="submit" color="primary" className={classnames('mr-1 px-3', submitClassname)}>
            {intl.formatMessage({ id: isReadOnly ? 'Update' : 'Save' })}
          </Button>
          <Button color="secondary" onClick={onCancel}>
            {intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

RoleGroupCUForm.propTypes = {
  intl: object.isRequired,
  isReadOnly: bool,
  onSubmit: func,
  onCancel: func,
  initValues: object,
  submitClassname: string
}

export default injectIntl(RoleGroupCUForm)
