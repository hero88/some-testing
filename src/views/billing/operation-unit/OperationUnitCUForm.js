import { bool, func, object, string } from 'prop-types'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { GENERAL_STATUS_OPTS } from '@src/utility/constants/billing'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  CHECK_DUPLICATE_OPRERATION_UNIT_CODE,
  CHECK_DUPLICATE_OPRERATION_UNIT_SIGN,
  NUMBER_REGEX,
  SET_FORM_DIRTY
} from '@src/utility/constants'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

const OperationCUForm = ({
  intl,
  onSubmit = () => {},
  onCancel = () => {},
  initValues,
  isReadOnly,
  submitClassname
}) => {
  const initState = {
    state: GENERAL_STATUS_OPTS[0]
  }
  const dispatch = useDispatch()

  const ValidateSchema = yup.object().shape(
    {
      name: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' })),

      code: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(15, intl.formatMessage({ id: 'max-validate' })),
      taxCode: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(20, intl.formatMessage({ id: 'max-validate' })),

      address: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' })),
      phone: yup
        .string()
        .matches(NUMBER_REGEX, {
          message: intl.formatMessage({ id: 'invalid-character-validate' }),
          excludeEmptyString: true
        })
        .max(15, intl.formatMessage({ id: 'max-validate' })),
      sign: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(20, intl.formatMessage({ id: 'max-validate' })),
      bankName: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(200, intl.formatMessage({ id: 'max-validate' })),
      bankAccountNumber: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(50, intl.formatMessage({ id: 'max-validate' }))
    },
    ['name', 'code', 'taxCode', 'address', 'phone']
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
    reset({ ...initValues, state: GENERAL_STATUS_OPTS.find((item) => item.value === initValues?.state) })
  }, [initValues])

  const handleSubmitOperationUnitForm = async (values) => {
    if (isReadOnly) {
      onSubmit?.(initValues)
      return
    }
    let isDuplicate = false

    try {
      const dataCheck = { code: values.code, sign: values.sign }
      if (initValues?.id) dataCheck.id = initValues?.id
      const [checkDupCodeRes, checkDupSignRes] = await Promise.all([
        axios.post(CHECK_DUPLICATE_OPRERATION_UNIT_CODE, dataCheck),
        axios.post(CHECK_DUPLICATE_OPRERATION_UNIT_SIGN, dataCheck)
      ])
      if (checkDupCodeRes.status === 200 && checkDupCodeRes.data?.data) {
        setError('code', { type: 'custom', message: intl.formatMessage({ id: 'dubplicated-validate' }) })
        isDuplicate = true
      }
      if (checkDupSignRes.status === 200 && checkDupSignRes.data?.data) {
        setError('sign', { type: 'custom', message: intl.formatMessage({ id: 'dubplicated-validate' }) })
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
    dispatch({
      type: SET_FORM_DIRTY,
      payload: false
    })
    onSubmit?.(values)
  }
  const handleCancel = () => {
    onCancel?.(isDirty)
  }
  return (
    <>
      <Form className="billing-form" onSubmit={handleSubmit(handleSubmitOperationUnitForm)}>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="name">
              <FormattedMessage id="operation-unit-form-name" />
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
              placeholder={intl.formatMessage({ id: 'operation-unit-form-name-placeholder' })}
            />
            {errors?.name && <FormFeedback>{errors?.name?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="code">
              <FormattedMessage id="operation-unit-form-code" />
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
              placeholder={intl.formatMessage({ id: 'operation-unit-form-code-placeholder' })}
            />
            {errors?.code && <FormFeedback>{errors?.code?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="sign">
              <FormattedMessage id="symbol" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="sign"
              name="sign"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.sign}
              valid={!isReadOnly && getValues('sign')?.trim() && !errors.sign}
              placeholder={intl.formatMessage({ id: 'Enter symbol' })}
            />
            {errors?.sign && <FormFeedback>{errors?.sign?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Label className="general-label" for="taxCode">
              <FormattedMessage id="operation-unit-form-taxCode" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="taxCode"
              name="taxCode"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.taxCode}
              valid={!isReadOnly && getValues('taxCode')?.trim() && !errors.taxCode}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-taxCode-placeholder' })}
            />
            {errors?.taxCode && <FormFeedback>{errors?.taxCode?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="address">
              <FormattedMessage id="operation-unit-form-address" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="address"
              name="address"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.address}
              valid={!isReadOnly && getValues('address')?.trim() && !errors.address}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-address-placeholder' })}
            />
            {errors?.address && <FormFeedback>{errors?.address?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="phone">
              <FormattedMessage id="operation-unit-form-mobile" />
            </Label>
            <Input
              id="phone"
              name="phone"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.phone}
              valid={!isReadOnly && getValues('phone')?.trim() && !errors.phone}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-mobile-placeholder' })}
            />
            {errors?.phone && <FormFeedback>{errors?.phone?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="bankAccountNumber">
              <FormattedMessage id="account Number" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.bankAccountNumber}
              valid={!isReadOnly && getValues('bankAccountNumber')?.trim() && !errors.bankAccountNumber}
              placeholder={intl.formatMessage({ id: 'Enter account Number' })}
            />
            {errors?.bankAccountNumber && <FormFeedback>{errors?.bankAccountNumber?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="bankName">
              <FormattedMessage id="bankName" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="bankName"
              name="bankName"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.bankName}
              valid={!isReadOnly && getValues('bankName')?.trim() && !errors.bankName}
              placeholder={intl.formatMessage({ id: 'Enter bank name' })}
            />
            {errors?.bankName && <FormFeedback>{errors?.bankName?.message}</FormFeedback>}
          </Col>
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
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-flex justify-content-end align-items-center">
            <Button type="submit" color="primary" className={classNames('mr-1 px-3', submitClassname)}>
              {intl.formatMessage({ id: isReadOnly ? 'Update' : 'Save' })}
            </Button>
            <Button color="secondary" onClick={handleCancel}>
              {intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
            </Button>{' '}
          </Col>
        </Row>
      </Form>
    </>
  )
}

OperationCUForm.propTypes = {
  intl: object.isRequired,
  onSubmit: func,
  onCancel: func,
  initValues: object,
  isReadOnly: bool,
  submitText: string,
  submitClassname: string
}

export default injectIntl(OperationCUForm)
