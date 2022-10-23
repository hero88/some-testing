import { yupResolver } from '@hookform/resolvers/yup'
import { API_GET_BILLING_SETTING_VALUE_BY_CODE, ISO_STANDARD_FORMAT } from '@src/utility/constants'
import { func, object } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import * as yup from 'yup'
import Select from 'react-select'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import axios from 'axios'
import { GENERAL_STATUS } from '@src/utility/constants/billing'
import moment from 'moment'

function ContactCUForm({ clock, intl, onSubmit = () => {}, onCancel }) {
  const [isOpen, setIsOpen] = useState(false)
  const [typesOfClock, setTypesOfClock] = useState([])
  const [manufacturerList, setManufacturerList] = useState([])

  useEffect(async () => {
    try {
      const [clockTypesRes, manufacturerListRes] = await Promise.all([
        axios.get(`${API_GET_BILLING_SETTING_VALUE_BY_CODE}/Clock_Type`),
        axios.get(`${API_GET_BILLING_SETTING_VALUE_BY_CODE}/Manufacturer`)
      ])

      if (clockTypesRes.status === 200 && clockTypesRes.data.data?.values) {
        setTypesOfClock(
          (clockTypesRes.data.data?.values || [])
            .filter((item) => item.state === GENERAL_STATUS.ACTIVE)
            .map((item) => ({
              value: item.value,
              label: item.value
            }))
        )
      }
      if (manufacturerListRes.status === 200 && manufacturerListRes.data.data?.values) {
        setManufacturerList(
          (manufacturerListRes.data.data?.values || [])
            .filter((item) => item.state === GENERAL_STATUS.ACTIVE)
            .map((item) => ({
              value: item.value,
              label: item.value
            }))
        )
      }
    } catch (error) {
      showToast('error', error.toString())
    }
  }, [])

  const validateSchema = yup.object().shape({
    name: yup
      .string()
      .required(intl.formatMessage({ id: 'required-validate' }))
      .max(100, intl.formatMessage({ id: 'max-validate' })),
    seri: yup
      .string()
      .required(intl.formatMessage({ id: 'required-validate' }))
      .max(50, intl.formatMessage({ id: 'max-validate' })),
    type: yup
      .object()
      .nullable()
      .required(intl.formatMessage({ id: 'required-validate' }))
  })

  const {
    getValues,
    errors,
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validateSchema),
    defaultValues: clock || {}
  })

  const handleCancel = () => {
    // setIsOpen((preState) => !preState)

    onCancel?.(isDirty)
  }

  useEffect(() => {
    setIsOpen(Boolean(clock?.id))
    if (clock?.id) {
      reset({
        ...clock,
        manufacturer: (manufacturerList || []).find((item) => item.value === clock?.manufacturer),
        type: (typesOfClock || []).find((item) => item.value === clock?.type),
        inspectionDate: clock.inspectionDate ? moment.utc(clock.inspectionDate).format(ISO_STANDARD_FORMAT) : null
      })
    }
  }, [clock?.id, typesOfClock, manufacturerList])

  const handleSubmitContact = (values) => {
    const payload = {
      ...values,
      manufacturer: values.manufacturer?.value,
      type: values.type?.value,
      inspectionDate: values.inspectionDate ? moment.utc(values.inspectionDate) : null
    }
    if (clock?.id > 0) payload.isUpdate = true
    else payload.isCreate = true
    onSubmit?.(payload)
  }

  return (
    <>
      <Modal isOpen={isOpen} className="modal-dialog-centered" backdrop="static">
        <ModalHeader>
          <FormattedMessage id={clock?.id > 0 ? 'Update clock' : 'Add new clock'} />
        </ModalHeader>
        <ModalBody>
          <Form key="clock-from">
            <Row>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="name">
                  <FormattedMessage id="Device name" />
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="on"
                  invalid={!!errors.name}
                  valid={getValues('name')?.trim() && !errors.name}
                  innerRef={register()}
                  placeholder={intl.formatMessage({ id: 'Enter device name' })}
                />
                {errors?.name && <FormFeedback>{errors?.name?.message}</FormFeedback>}
              </Col>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="seri">
                  Seri
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Input
                  id="seri"
                  name="seri"
                  autoComplete="on"
                  invalid={!!errors.seri}
                  valid={getValues('seri')?.trim() && !errors.seri}
                  innerRef={register()}
                  placeholder={intl.formatMessage({ id: 'Enter serial number' })}
                />
                {errors?.seri && <FormFeedback>{errors?.seri?.message}</FormFeedback>}
              </Col>

              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="type">
                  <FormattedMessage id="Type of clock" />
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isClearable={true}
                  theme={selectThemeColors}
                  name="type"
                  id="type"
                  innerRef={register()}
                  options={typesOfClock}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder={intl.formatMessage({ id: 'Choose type of clock' })}
                  formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                />
                {errors?.type && <FormFeedback className="d-block">{errors?.type?.message}</FormFeedback>}
              </Col>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="phone">
                  <FormattedMessage id="Manufacturer" />
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isClearable={true}
                  theme={selectThemeColors}
                  name="manufacturer"
                  id="manufacturer"
                  innerRef={register()}
                  options={manufacturerList}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder={intl.formatMessage({ id: 'Choose manufacturer' })}
                  formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                />
                {errors?.manufacturer && (
                  <FormFeedback className="d-block">{errors?.manufacturer?.message}</FormFeedback>
                )}
              </Col>

              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="inspectionDate">
                  <FormattedMessage id="Inspection valid until" />
                </Label>
                <Input
                  id="inspectionDate"
                  name="inspectionDate"
                  autoComplete="on"
                  innerRef={register()}
                  invalid={!!errors.inspectionDate}
                  valid={getValues('inspectionDate')?.trim() && !errors.inspectionDate}
                  type="date"
                  className="custom-icon-input-date"
                />
                {errors?.inspectionDate && <FormFeedback>{errors?.inspectionDate?.message}</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center align-items-center">
                <Button onClick={handleSubmit(handleSubmitContact)} color="primary" className="mr-1 px-3">
                  {intl.formatMessage({ id: 'Finish' })}
                </Button>{' '}
                <Button color="secondary" onClick={handleCancel}>
                  {intl.formatMessage({ id: 'Cancel' })}
                </Button>{' '}
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

ContactCUForm.propTypes = {
  clock: object,
  intl: object,
  onSubmit: func,
  onCancel: func
}

export default injectIntl(ContactCUForm)
