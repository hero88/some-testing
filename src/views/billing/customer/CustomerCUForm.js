import { array, bool, func, object, string } from 'prop-types'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { API_CHECK_DUPLICATE_CUSTOMER_CODE, NUMBER_REGEX, SET_FORM_DIRTY } from '@src/utility/constants'
import { GENERAL_CUSTOMER_TYPE, GENERAL_STATUS } from '@src/utility/constants/billing'
import SweetAlert from 'sweetalert2'
import './styles.scss'
import Contact from '../contact'
import withReactContent from 'sweetalert2-react-content'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { ReactComponent as CicleFailed } from '@src/assets/images/svg/circle-failed.svg'
import axios from 'axios'
import { isEqual } from 'lodash'
import { handleCRUDOfContacts } from '../contact/util'
import { getContactListByCustomerId } from '../contact/store/actions'

const MySweetAlert = withReactContent(SweetAlert)

const OperationCUForm = ({
  intl,
  isViewed,
  onSubmit = () => {},
  onCancel = () => {},
  initValues,
  submitText,
  cancelText,
  contacts,
  submitClassname,
  allowedEdit
}) => {
  const CUSTOMER_STATUS_OPTS = [
    { value: GENERAL_STATUS.ACTIVE, label: intl.formatMessage({ id: 'Active' }) },
    { value: GENERAL_STATUS.INACTIVE, label: intl.formatMessage({ id: 'Inactive' }) }
  ]
  const dispatch = useDispatch()
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const initState = {
    type: GENERAL_CUSTOMER_TYPE[0],
    fullName: null,
    code: null,
    taxCode: null,
    address: null,
    phone: null,
    state: CUSTOMER_STATUS_OPTS[0],
    note: null
  }

  const ValidateSchema = yup.object().shape(
    {
      fullName: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(150, intl.formatMessage({ id: 'max-validate' })),

      code: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(15, intl.formatMessage({ id: 'max-validate' })),
      taxCode: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(15, intl.formatMessage({ id: 'max-validate' })),

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
      note: yup.string().max(255, intl.formatMessage({ id: 'max-validate' }))
    },
    ['fullName', 'code', 'taxCode', 'address', 'phone', 'note']
  )

  const {
    handleSubmit,
    getValues,
    errors,
    control,
    reset,
    register,
    setError,
    watch,
    setValue,
    formState: { isDirty }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(isViewed ? yup.object().shape({}) : ValidateSchema),
    defaultValues: initValues || initState
  })

  const isDirtyForm = isDirty || !isEqual(watch('contacts'), contacts)

  useEffect(() => {
    register('contacts')
  }, [register])

  useEffect(() => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: isDirtyForm
    })
  }, [isDirtyForm])

  useEffect(() => {
    const tempValues = {
      ...initValues,
      state: CUSTOMER_STATUS_OPTS.find((item) => item.value === initValues?.state),
      type: GENERAL_CUSTOMER_TYPE.find((item) => item.value === initValues?.type),
      contacts
    }
    reset(tempValues)
  }, [initValues])

  useEffect(() => {
    if (!isEqual(contacts, watch('contacts'))) {
      setValue('contacts', contacts)
    }
  }, [contacts])

  const handleSubmitContactForm = async (changeContacts, changeId, callback) => {
    const changeItem = changeContacts.filter((item) => item.id === changeId)
    if (Number(initValues?.id) > 0) {
      try {
        Promise.all(handleCRUDOfContacts({ contacts: changeItem, customerId: initValues.id })).then(() => {
          dispatch(
            getContactListByCustomerId({
              id: initValues?.id,
              isSavedToState: true,
              callback
            })
          )
        })
      } catch (error) {
        if (changeId < 0) {
          showToast('error', <FormattedMessage id="data create failed, please try again" />)
        } else {
          if (changeItem[0]?.isDelete) {
            showToast('error', <FormattedMessage id="data delete failed, please try again" />)
          }
          if (changeItem[0]?.isUpdate) {
            showToast('error', <FormattedMessage id="data update failed, please try again" />)
          }
        }
      }
    } else {
      setValue('contacts', changeContacts)
    }
  }

  const handleSubmitCustomerForm = async (values) => {
    if (!isViewed) {
      // check trùng  mã khách hàng
      const dataCheck = { code: values.code }
      if (initValues?.id) dataCheck.id = initValues?.id
      try {
        const checkDupCodeRes = await axios.post(API_CHECK_DUPLICATE_CUSTOMER_CODE, dataCheck)
        if (checkDupCodeRes.status === 200 && checkDupCodeRes.data?.data) {
          setError('code', { type: 'custom', message: intl.formatMessage({ id: 'dubplicated-validate' }) })
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
      if (!watch('contacts')?.filter((item) => !item.isDelete).length > 0) {
        return MySweetAlert.fire({
          // icon: 'success',
          iconHtml: <CicleFailed />,
          text: intl.formatMessage({ id: 'Need at least 1 contact to add customer. Please try again' }),
          customClass: {
            popup: classNames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-primary mt-2',
            icon: 'border-0'
          },
          width: 'max-content',
          showCloseButton: true,
          confirmButtonText: intl.formatMessage({ id: 'Try again' })
        })
      }
    }

    onSubmit?.({
      ...values
    })
  }

  const handleCancelForm = () => {
    onCancel?.()
  }
  return (
    <>
      <Form className="billing-form" onSubmit={handleSubmit(handleSubmitCustomerForm)}>
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
              <FormattedMessage id="Company name" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              disabled={isViewed}
              autoComplete="on"
              invalid={!isViewed && !!errors.fullName}
              valid={!isViewed && getValues('fullName')?.trim() && !errors.fullName}
              innerRef={register()}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-name-placeholder' })}
              className=""
            />
            {errors?.fullName && <FormFeedback>{errors?.fullName?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="code">
              <FormattedMessage id="Customer Code" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="code"
              name="code"
              autoComplete="on"
              disabled={isViewed}
              innerRef={register()}
              invalid={!isViewed && !!errors.code}
              valid={!isViewed && getValues('code')?.trim() && !errors.code}
              placeholder={intl.formatMessage({ id: 'Enter Customer Code' })}
            />
            {errors?.code && <FormFeedback>{errors?.code?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="type">
              <FormattedMessage id="Company Type" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="type"
              id="type"
              isDisabled={isViewed}
              innerRef={register()}
              options={GENERAL_CUSTOMER_TYPE}
              className="react-select"
              classNamePrefix="select"
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
            />
            {errors?.type && <FormFeedback>{errors?.type?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="taxCode">
              <FormattedMessage id="operation-unit-form-taxCode" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="taxCode"
              name="taxCode"
              autoComplete="on"
              innerRef={register()}
              disabled={isViewed}
              invalid={!isViewed && !!errors.taxCode}
              valid={!isViewed && getValues('taxCode')?.trim() && !errors.taxCode}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-taxCode-placeholder' })}
            />
            {errors?.taxCode && <FormFeedback>{errors?.taxCode?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="address">
              <FormattedMessage id="Industrial area" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="address"
              name="address"
              autoComplete="on"
              innerRef={register()}
              disabled={isViewed}
              invalid={!isViewed && !!errors.address}
              valid={!isViewed && getValues('address')?.trim() && !errors.address}
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
              innerRef={register()}
              disabled={isViewed}
              invalid={!isViewed && !!errors.phone}
              valid={!isViewed && getValues('phone')?.trim() && !errors.phone}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-mobile-placeholder' })}
            />
            {errors?.phone && <FormFeedback>{errors?.phone?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="state">
              <FormattedMessage id="Status" />
            </Label>
            <Controller
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="state"
              id="state"
              isDisabled={isViewed}
              innerRef={register()}
              options={CUSTOMER_STATUS_OPTS}
              className="react-select"
              classNamePrefix="select"
              placeholder={intl.formatMessage({ id: 'Select a status' })}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
            />
          </Col>
          <Col className="mb-2" md={8}>
            <Label className="general-label" for="status">
              <FormattedMessage id="note" />
            </Label>
            <Input
              id="note"
              name="note"
              autoComplete="on"
              disabled={isViewed}
              innerRef={register()}
              invalid={!isViewed && !!errors.note}
              valid={!isViewed && getValues('note')?.trim() && !errors.note}
              placeholder={intl.formatMessage({ id: 'Please enter note' })}
            />
            {errors?.note && <FormFeedback>{errors?.note?.message}</FormFeedback>}
          </Col>
        </Row>
        <Contact
          disabled={isViewed}
          onChange={handleSubmitContactForm}
          data={watch('contacts')}
          type={intl.formatMessage({ id: 'customers' })}
          allowedEdit={allowedEdit}
        />

        <Row>
          <Col className="d-flex justify-content-end align-items-center mb-2">
            <Button type="submit" color="primary" className={classNames('mr-1 px-3', submitClassname)}>
              {submitText || intl.formatMessage({ id: 'Save' })}
            </Button>{' '}
            <Button color="secondary" onClick={handleCancelForm}>
              {cancelText || intl.formatMessage({ id: 'Cancel' })}
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
  submitText: string,
  isViewed: bool,
  contacts: array,
  cancelText: string,
  submitClassname: string,
  allowedEdit: bool
}

export default injectIntl(OperationCUForm)
