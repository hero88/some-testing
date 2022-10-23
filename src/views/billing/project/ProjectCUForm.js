import { bool, element, func, object, string } from 'prop-types'
import { cloneElement, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl, useIntl } from 'react-intl'
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'

import { yupResolver } from '@hookform/resolvers/yup'
import ValueContOfMultipleSelect from '@src/utility/components/ReactSelectCustomCOM/ValueContOfMultipleSelect'
import {
  API_CHECK_PROJECT,
  API_CHECK_PROJECT_NAME,
  API_GET_ALL_OPERATION_UNIT,
  ISO_STANDARD_FORMAT,
  REAL_NUMBER,
  SET_FORM_DIRTY
} from '@src/utility/constants'
import { GENERAL_STATUS_OPTS, mockUser } from '@src/utility/constants/billing'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import axios from 'axios'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import Contract from './contract'
import '@src/@core/scss/billing-sweet-alert.scss'
import classNames from 'classnames'

const ProjectCUForm = ({
  intl,
  onSubmit = () => {},
  onCancel = () => {},
  initValues,
  isReadOnly,
  submitText,
  submitButton,
  cancelButton,
  submitClassname
}) => {
  const dispatch = useDispatch()
  const initState = { state: GENERAL_STATUS_OPTS[0] }
  const [companies, setCompanies] = useState([])
  const intlNew = useIntl()
  useEffect(async () => {
    try {
      /*const initParam = {
        page: 1,
        rowsPerPage: 999,
        order: 'createDate desc',
        state: 'ACTIVE'
      }*/
      const [allCompaniesRes] = await Promise.all([
        axios.get(API_GET_ALL_OPERATION_UNIT)
        // axios.get(API_GET_USERS, initParam)
      ])

      if (allCompaniesRes.status === 200 && allCompaniesRes.data?.data) {
        setCompanies(
          (allCompaniesRes.data.data || []).map(({ id, name }) => ({
            value: id,
            label: name
          }))
        )
      }
      /*if (allUsersRes.status === 200 && allUsersRes.data?.data) {
        setCustomers(
          (allUsersRes.data.data || []).map(({ id, fullName }) => ({
            value: id,
            label: fullName
          }))
        )
      }*/
    } catch (error) {
      showToast('error', intlNew.formatMessage({ id: error.toString() }))
    }
  }, [])

  const ValidateSchema = yup.object().shape(
    {
      name: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(150, intl.formatMessage({ id: 'max-validate' })),

      code: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(20, intl.formatMessage({ id: 'max-validate' })),

      address: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' })),
      companyId: yup.object().required(intl.formatMessage({ id: 'required-validate' })),
      accountantIds: yup.array().required(intl.formatMessage({ id: 'required-validate' })),
      power: yup
        .string()
        .matches(REAL_NUMBER, {
          message: intl.formatMessage({ id: 'invalid-character-validate' }),
          excludeEmptyString: true
        })
        .max(16, intl.formatMessage({ id: 'max-validate' }))
    },
    ['name', 'code', 'companyId', 'address', 'accountantIds', 'power']
  )

  const {
    handleSubmit,
    getValues,
    errors,
    control,
    register,
    reset,
    setError,
    formState: { isDirty }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(isReadOnly ? yup.object().shape({}) : ValidateSchema),
    defaultValues: initValues || initState
  })

  useEffect(() => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: isDirty
    })
  }, [isDirty])

  useEffect(() => {
    const tmpInitValues = {
      ...initValues,
      power: initValues?.capacity,
      startDate: initValues?.startDate ? moment(initValues.startDate).format(ISO_STANDARD_FORMAT) : null,
      state: GENERAL_STATUS_OPTS.find((item) => item.value === initValues?.state)
    }

    if (initValues?.userIds) {
      const listUserIds = JSON.parse(initValues.userIds)
      tmpInitValues.accountantIds = listUserIds.reduce((usersArray, userItemId) => {
        const findUserItem = mockUser.find((item) => Number(item.value) === Number(userItemId))

        if (findUserItem) return [...usersArray, findUserItem]
        return usersArray
      }, [])
    }
    if (initValues?.operationCompanyId) {
      tmpInitValues.companyId = companies.find((item) => Number(item.value) === Number(initValues?.operationCompanyId))
    }

    reset(tmpInitValues)
  }, [initValues, mockUser?.length, companies?.length])
  const handleSubmitOperationUnitForm = async (values) => {
    if (isReadOnly) {
      onSubmit?.(initValues)
      return
    }
    let isDuplicate = false
    try {
      const dataCheck = { code: values.code, name: values.name }
      if (initValues?.id) dataCheck.id = initValues?.id
      const [checkDupCodeRes, checkDupNameRes] = await Promise.all([
        axios.post(API_CHECK_PROJECT, dataCheck),
        axios.post(API_CHECK_PROJECT_NAME, dataCheck)
      ])
      if (checkDupCodeRes.status === 200 && checkDupCodeRes.data?.data) {
        setError('code', { type: 'custom', message: intl.formatMessage({ id: 'dubplicated-validate' }) })
        isDuplicate = true
      }
      if (checkDupNameRes.status === 200 && checkDupNameRes.data?.data) {
        setError('name', { type: 'custom', message: intl.formatMessage({ id: 'dubplicated-validate' }) })
        isDuplicate = true
      }
      if (isDuplicate) {
        return
      }
    } catch (err) {
      const alert = initValues?.id
        ? 'Failed to update data. Please try again'
        : 'Failed to create data. Please try again'
      showToast(
        'error',
        intl.formatMessage({
          id: alert
        })
      )
      return
    }
    onSubmit?.(values)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const footerCOM = (
    <>
      {typeof submitButton === 'undefined' ? (
        <Button type="submit" color="primary" className={classNames('mr-1 px-3', submitClassname)}>
          {submitText || intl.formatMessage({ id: 'Save' })}
        </Button>
      ) : submitButton ? (
        cloneElement(submitButton)
      ) : null}
      {typeof cancelButton === 'undefined' ? (
        <Button color="secondary" onClick={handleCancel}>
          {intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
        </Button>
      ) : cancelButton ? (
        cloneElement(cancelButton, { onClick: handleCancel })
      ) : null}
    </>
  )
  return (
    <>
      <Form className="billing-form" onSubmit={handleSubmit(handleSubmitOperationUnitForm)}>
        <Row className="mb-2">
          <Col>
            <h4 className="typo-section">
              <FormattedMessage id="General Information" />
            </h4>
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="name">
              <FormattedMessage id="Projects" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="name"
              name="name"
              disabled={isReadOnly}
              autoComplete="on"
              invalid={!isReadOnly && !!errors.name}
              valid={!isReadOnly && getValues('name')?.trim() && !errors.name}
              innerRef={register()}
              placeholder={intl.formatMessage({ id: 'Enter project name' })}
            />
            {errors?.name && <FormFeedback>{errors?.name?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="code">
              <FormattedMessage id="Project code" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="code"
              name="code"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.code}
              valid={!isReadOnly && getValues('code')?.trim() && !errors.code}
              placeholder={intl.formatMessage({ id: 'Enter project code' })}
            />
            {errors?.code && <FormFeedback>{errors?.code?.message}</FormFeedback>}
          </Col>
          <Col md={4}>
            <Label className="general-label" for="companyId">
              <FormattedMessage id="operation-units" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              options={companies}
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="companyId"
              id="companyId"
              isDisabled={isReadOnly}
              innerRef={register()}
              className="react-select"
              classNamePrefix="select"
              placeholder={intl.formatMessage({ id: 'Choose operation unit' })}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
            />

            {errors?.companyId && <FormFeedback className="d-block">{errors?.companyId?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="accountantIds">
              <FormattedMessage id="Assigned accountant" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="accountantIds"
              id="accountantIds"
              isDisabled={isReadOnly}
              isMulti
              hideSelectedOptions={false}
              options={mockUser}
              innerRef={register()}
              className="react-select"
              classNamePrefix="select"
              placeholder={intl.formatMessage({ id: 'Choose assigned accountant' })}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
              components={{
                ValueContainer: ValueContOfMultipleSelect
              }}
            />

            {errors?.accountantIds && <FormFeedback className="d-block">{errors?.accountantIds?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={8}>
            <Label className="general-label" for="address">
              <FormattedMessage id="operation-unit-form-address" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="address"
              name="address"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.address}
              valid={!isReadOnly && getValues('address')?.trim() && !errors.address}
              placeholder={intl.formatMessage({ id: 'Enter address' })}
            />
            {errors?.address && <FormFeedback>{errors?.address?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="startDate">
              <FormattedMessage id="Operation date" />
            </Label>

            <Input
              className="custom-icon-input-date"
              bsSize="sm"
              type="date"
              name="startDate"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.startDate}
              valid={!isReadOnly && getValues('startDate')?.trim() && !errors.startDate}
            />
          </Col>{' '}
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="power">
              <FormattedMessage id="Project power" />
            </Label>

            <Input
              className="custom-icon-input-date"
              name="power"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.power}
              valid={!isReadOnly && getValues('power')?.trim() && !errors.power}
              placeholder={intl.formatMessage({ id: 'Enter power' })}
            />
            {errors?.power && <FormFeedback>{errors?.power?.message}</FormFeedback>}
          </Col>
          {!initValues?.id > 0 ? (
            <Col className="mb-2 d-flex align-items-end justify-content-end" md={4}>
              {footerCOM}
            </Col>
          ) : (
            <Col className="mb-2" md={4}>
              <Label className="general-label" for="status">
                <FormattedMessage id="Status" />
              </Label>
              <Controller
                as={Select}
                control={control}
                theme={selectThemeColors}
                name="state"
                id="state"
                isDisabled={isReadOnly}
                innerRef={register()}
                options={GENERAL_STATUS_OPTS}
                className="react-select"
                classNamePrefix="select"
                placeholder={intl.formatMessage({ id: 'Select a status' })}
                formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
              />
            </Col>
          )}
        </Row>
        {initValues?.id > 0 && (
          <Row>
            <Col xs={12}>
              <Contract isReadOnly={isReadOnly} projectId={initValues?.id} />
            </Col>
          </Row>
        )}
        {initValues?.id && (
          <Row>
            <Col xs={12} className="d-flex justify-content-end align-items-center mb-2">
              {footerCOM}
            </Col>
          </Row>
        )}
      </Form>
    </>
  )
}

ProjectCUForm.propTypes = {
  intl: object.isRequired,
  onSubmit: func,
  onCancel: func,
  initValues: object,
  isReadOnly: bool,
  submitText: string,
  submitButton: element,
  cancelButton: element,
  cancelText: string,
  submitClassname: string
}

export default injectIntl(ProjectCUForm)
