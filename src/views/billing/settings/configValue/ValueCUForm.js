import { yupResolver } from '@hookform/resolvers/yup'
import { bool, func, object, string } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import * as yup from 'yup'
import Select from 'react-select'
import { selectThemeColors } from '@src/utility/Utils'
import { GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'

const MySweetAlert = withReactContent(SweetAlert)

function ValueCUForm({ value, intl, onSubmit = () => {}, onCancel, isReadOnly, submitClassname }) {
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const CONFIG_VALUE_STATUS_OPTS = [
    { value: OPERATION_UNIT_STATUS.ACTIVE, label: intl.formatMessage({ id: 'Active' }) },
    { value: OPERATION_UNIT_STATUS.INACTIVE, label: intl.formatMessage({ id: 'Inactive' }) }
  ]
  const [isOpen, setIsOpen] = useState(false)

  const validateSchema = yup.object().shape(
    {
      value: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' })),
      description: yup
        .string()
        // .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' }))
    },
    ['value', 'description']
  )

  const initState = {
    state: CONFIG_VALUE_STATUS_OPTS[0]
  }
  const {
    getValues,
    errors,
    register,
    control,
    reset,
    handleSubmit,
    formState: { isDirty }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(isReadOnly ? yup.object().shape({}) : validateSchema),
    defaultValues: value || initState
  })

  const toggle = () => {
    if (isDirty) {
      return MySweetAlert.fire({
        title: intl.formatMessage({ id: 'Cancel confirmation' }),
        text: intl.formatMessage({ id: 'Are you sure to cancel?' }),
        showCancelButton: true,
        confirmButtonText: intl.formatMessage({ id: 'Yes' }),
        cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
        customClass: {
          popup: classNames({
            'sweet-alert-popup--dark': skin === 'dark',
            'sweet-popup': true
          }),
          header: 'sweet-title',
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary ml-1',
          actions: 'sweet-actions',
          content: 'sweet-content'
        },
        buttonsStyling: false
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          setIsOpen((preState) => !preState)
          onCancel?.()
        }
      })
    }
    setIsOpen((preState) => !preState)
    onCancel?.()
  }

  useEffect(() => {
    setIsOpen(Boolean(value?.id))
    if (value?.id) reset({ ...value, state: CONFIG_VALUE_STATUS_OPTS.find((item) => item.value === value?.state) })
  }, [value?.id])

  const handleSubmitForm = (values) => {
    onSubmit?.(values)
  }

  return (
    <>
      <Modal isOpen={isOpen} className="modal-dialog-centered" backdrop="static">
        <ModalHeader>
          <FormattedMessage id={value?.id === '-1' ? 'Add new config value' : 'Update new config value'} />
        </ModalHeader>
        <ModalBody>
          <Form className="billing-form" key="value-from">
            <Row>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="name">
                  <FormattedMessage id="Config Name" />
                </Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="on"
                  disabled
                  // invalid={!!errors.name}
                  // valid={getValues('name')?.trim() && !errors.name}
                  innerRef={register()}
                  placeholder={intl.formatMessage({ id: 'Enter Config Name' })}
                />
                {/* {errors?.name && <FormFeedback>{errors?.name?.message}</FormFeedback>} */}
              </Col>

              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="value">
                  <FormattedMessage id="Configuration Value" />
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Input
                  id="value"
                  name="value"
                  autoComplete="on"
                  innerRef={register()}
                  disabled={isReadOnly}
                  invalid={!isReadOnly && !!errors.value}
                  valid={!isReadOnly && getValues('value')?.trim() && !errors.value}
                  placeholder={intl.formatMessage({ id: 'Enter Configuration Value' })}
                />
                {errors?.value && <FormFeedback>{errors?.value?.message}</FormFeedback>}
              </Col>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="Status">
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
                  options={CONFIG_VALUE_STATUS_OPTS}
                  className="react-select"
                  classNamePrefix="select"
                  formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                />
                {errors?.state && <FormFeedback>{errors?.state?.message}</FormFeedback>}
              </Col>

              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="explain">
                  <FormattedMessage id="explain" />
                </Label>
                <Input
                  id="description"
                  name="description"
                  autoComplete="on"
                  innerRef={register()}
                  disabled={isReadOnly}
                  invalid={!isReadOnly && !!errors.description}
                  valid={!isReadOnly && getValues('description')?.trim() && !errors.description}
                  placeholder={intl.formatMessage({ id: 'Enter Config Explain' })}
                  type="textarea"
                />
                {errors?.description && <FormFeedback>{errors?.description?.message}</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center align-items-center">
                <Button
                  onClick={handleSubmit(handleSubmitForm)}
                  color="primary"
                  className={classNames('mr-1 px-3', submitClassname)}
                >
                  {intl.formatMessage({ id: isReadOnly ? 'Update' : 'Finish' })}
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                  {intl.formatMessage({ id: isReadOnly ? 'Close' : 'Cancel' })}
                </Button>{' '}
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

ValueCUForm.propTypes = {
  value: object,
  intl: object,
  onSubmit: func,
  onCancel: func,
  isReadOnly: bool,
  submitClassname: string
}

export default injectIntl(ValueCUForm)
