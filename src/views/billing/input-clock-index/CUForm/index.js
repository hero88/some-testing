import { bool, func, object, string } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  API_FETCH_CONTRACT_BY_QUERY,
  API_GET_ALL_PROJECT,
  API_GET_BLLING_DATA_BY_CONTRACT_ID,
  API_GET_LIST_CUSTOMER_BY_PROJECT_ID,
  DISPLAY_DATE_FORMAT,
  SET_FORM_DIRTY
} from '@src/utility/constants'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import DefaultValidateSchema, { Form2Schema, Form4Schema, Form5Schema, Form7Schema } from './ValidateSchemaObj'
import { Form2 } from './Form2'
import { Form4 } from './Form4'
import { Form5 } from './Form5'
import { Form6 } from './Form6'
import { Form7 } from './Form7'
import qs from 'qs'
import classNames from 'classnames'

const CUForm = ({ intl, onSubmit = () => {}, onCancel = () => {}, initValues, isReadOnly, submitClassname }) => {
  const initState = {}
  const dispatch = useDispatch()
  const [projects, setProjects] = useState([])
  const [customers, setCustomers] = useState([])
  const [contracts, setContracts] = useState([])
  const [cycles, setCycles] = useState([])
  const [validateSchema, setValidateSchema] = useState(DefaultValidateSchema)

  useEffect(async () => {
    try {
      const projectRes = await axios.get(API_GET_ALL_PROJECT)
      if (projectRes.status === 200 && projectRes.data.data) {
        setProjects(
          (projectRes.data.data || []).map((item) => ({
            value: item.id,
            label: item.name
          }))
        )
      }
    } catch (error) {
      showToast('error', error.toString())
    }
  }, [])

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(isReadOnly ? yup.object().shape({}) : yup.object().shape(validateSchema)),
    defaultValues: initValues || initState,
    shouldUnregister: true
  })

  const {
    handleSubmit,
    getValues,
    errors,
    control,
    register,
    reset,
    formState: { isDirty },
    clearErrors,
    watch,
    setValue
  } = methods
  useEffect(() => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: isDirty
    })
  }, [isDirty])
  useEffect(() => {
    reset(initValues)
  }, [initValues])
  const currentContractId = (contracts || []).find((item) => item.id === watch('contractId')?.value)?.details?.id

  const handleSubmitOperationUnitForm = async (values) => {
    if (isReadOnly) {
      onSubmit?.(initValues)
      return
    }

    let tempDetails = {}
    switch (currentContractId) {
      case 'Mẫu 2':
      case 'Mẫu 3':
      case 'Mẫu 6':
        tempDetails = Object.keys(Form2Schema).reduce((obj, key) => {
          return {
            ...obj,
            [key]: values[key]
          }
        }, {})

        break
      case 'Mẫu 4':
        tempDetails = {
          sellingExchangeRate: values.sellingExchangeRate
        }
        break
      case 'Mẫu 5':
        tempDetails = {
          sellingRevenue: values.sellingRevenue
        }
        break
      case 'Mẫu 7':
        tempDetails = {
          reactivePowerIndex: values.reactivePowerIndex
        }
        break

      default:
        break
    }

    const payload = {
      state: 'ACTIVE',
      note: values.note,
      id: values.cycleId.value,
      details: {
        id: currentContractId,
        ...tempDetails
      }
    }
    onSubmit?.(payload)
  }
  console.log('currentContractId', currentContractId)
  const handleCancel = () => {
    onCancel?.(isDirty)
  }
  const renderCycleLabel = (cycle) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    `${intl.formatMessage({ id: 'Cycle' })} ${cycle.periodNumber} (${moment
      .utc(cycle.startDate)
      .format(DISPLAY_DATE_FORMAT)} - ${moment.utc(cycle.endDate).format(DISPLAY_DATE_FORMAT)})`

  useEffect(() => {
    switch (currentContractId) {
      case 'Mẫu 2':
      case 'Mẫu 3':
      case 'Mẫu 6':
        setValidateSchema({ ...DefaultValidateSchema, ...Form2Schema })
        break
      case 'Mẫu 4':
        setValidateSchema({ ...DefaultValidateSchema, ...Form4Schema })
        break
      case 'Mẫu 5':
        setValidateSchema({ ...DefaultValidateSchema, ...Form5Schema })
        break
      case 'Mẫu 7':
        setValidateSchema({ ...DefaultValidateSchema, ...Form7Schema })
        break
      default:
        setValidateSchema(DefaultValidateSchema)
        break
    }
  }, [currentContractId])
  const fetchCycleByContractId = async (event) => {
    if (!event?.value) {
      if (cycles?.length) setCycles([])
      return
    }
    try {
      const cyclesRes = await axios.get(`${API_GET_BLLING_DATA_BY_CONTRACT_ID}/${event.value}?details=false`)
      if (cyclesRes.status === 200 && cyclesRes.data.data) {
        setCycles(
          initValues?.id
            ? [...cyclesRes.data.data, initValues].sort((a, b) => a.periodNumber - b.periodNumber)
            : cyclesRes.data.data
        )
      }
    } catch (error) {
      showToast('error', error.toString())
    }
  }

  const fetchContractByCustomerId = async (customerId, projectId, isSetDefaultContract) => {
    if (!customerId?.value) {
      if (contracts?.length) setContracts([])
      return
    }
    try {
      const contractsRes = await axios.get(
        `${API_FETCH_CONTRACT_BY_QUERY}?${qs.stringify({
          projectId: Number(projectId?.value),
          customerId: Number(customerId?.value),
          expiredFor3Months: false
        })}`
      )

      if (contractsRes.status === 200 && contractsRes.data.data) {
        const listContarctOfCustomers = contractsRes.data.data?.filter((item) => item.details?.id !== 'Mẫu 1')

        setContracts(listContarctOfCustomers || [])

        if (isSetDefaultContract && listContarctOfCustomers?.length) {
          setValue('contractId', {
            value: listContarctOfCustomers[0].id,
            label: listContarctOfCustomers[0].code
          })
          fetchCycleByContractId({
            value: listContarctOfCustomers[0].id,
            label: listContarctOfCustomers[0].code
          })
        }
      }
    } catch (error) {
      showToast('error', error.toString())
    }
  }

  useEffect(() => {
    if (initValues?.id) {
      // eslint-disable-next-line no-unused-vars
      const { id, ...detailsObject } = initValues.details
      const tmpValues = {
        projectId: { value: initValues.projectId, label: initValues.projectName },
        customerId: { value: initValues.customerId, label: initValues.customerName },
        contractId: { value: initValues.contractId, label: initValues.contractCode },
        cycleId: { value: initValues.id, label: renderCycleLabel(initValues) },
        note: initValues.note,
        ...detailsObject
      }

      fetchCycleByContractId(tmpValues.contractId)
      fetchContractByCustomerId(tmpValues.customerId, tmpValues.projectId)
      reset(tmpValues)
    } else {
      reset(initState)
    }
  }, [initValues?.id])

  const handleChangeProjectId = (onChangeProjectId) => async (event) => {
    setValue('customerId', null)
    setValue('contractId', null)
    setValue('cycleId', null)
    clearErrors(['customerId', 'contractId', 'cycleId'])

    if (cycles?.length) setCycles([])
    if (contracts?.length) setContracts([])

    if (!event?.value) {
      if (customers?.length) setCustomers([])
      return
    }
    try {
      const customersRes = await axios.get(`${API_GET_LIST_CUSTOMER_BY_PROJECT_ID}/${event.value}`)

      if (customersRes.status === 200 && customersRes.data.data) {
        setCustomers(
          (customersRes.data.data || []).map((item) => ({
            value: item.customerId,
            label: item.fullName
          }))
        )
      }
    } catch (error) {
      showToast('error', error.toString())
    }
    onChangeProjectId?.(event)
  }
  const handleChangeCustomerId = (onChangeCustomerId) => async (event) => {
    setValue('contractId', null)
    setValue('cycleId', null)
    clearErrors(['contractId', 'cycleId'])
    if (cycles?.length) setCycles([])
    fetchContractByCustomerId(event, watch('projectId'), true)
    onChangeCustomerId?.(event)
  }

  const handleChangeContractId = (onChangeContractId) => async (event) => {
    setValue('cycleId', null)
    clearErrors(['cycleId'])
    fetchCycleByContractId(event)
    onChangeContractId?.(event)
  }

  return (
    <FormProvider {...methods}>
      <Form className="billing-form" onSubmit={handleSubmit(handleSubmitOperationUnitForm)}>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="projectId">
              <FormattedMessage id="Project" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              render={({ onChange: onChangeProjectId, ...fields }) => (
                <Select
                  {...fields}
                  isDisabled={isReadOnly || initValues?.id}
                  options={projects}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder={intl.formatMessage({ id: 'Select projects' })}
                  formatOptionLabel={(option) => <>{option.label}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                  onChange={handleChangeProjectId(onChangeProjectId)}
                />
              )}
              control={control}
              theme={selectThemeColors}
              name="projectId"
              id="projectId"
              innerRef={register()}
            />
            {errors?.projectId && <FormFeedback className="d-block">{errors?.projectId?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="customerId">
              <FormattedMessage id="Customers" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              render={({ onChange: onChangeCustomerId, ...fields }) => (
                <Select
                  {...fields}
                  isDisabled={isReadOnly || initValues?.id}
                  options={customers}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder={intl.formatMessage({ id: 'Select customer' })}
                  formatOptionLabel={(option) => <>{option.label}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                  onChange={handleChangeCustomerId(onChangeCustomerId)}
                />
              )}
              control={control}
              theme={selectThemeColors}
              name="customerId"
              id="customerId"
              innerRef={register()}
            />
            {errors?.customerId && <FormFeedback className="d-block">{errors?.customerId?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="contractId">
              <FormattedMessage id="Contract" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              render={({ onChange: onChangeContractId, ...fields }) => (
                <Select
                  {...fields}
                  isDisabled={isReadOnly || initValues?.id}
                  options={(contracts || []).map((item) => ({
                    value: item.id,
                    label: item.code
                  }))}
                  onChange={handleChangeContractId(onChangeContractId)}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder={intl.formatMessage({ id: 'Select contract' })}
                  formatOptionLabel={(option) => <>{option.label}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                />
              )}
              control={control}
              theme={selectThemeColors}
              name="contractId"
              id="contractId"
              innerRef={register()}
            />
            {errors?.contractId && <FormFeedback className="d-block">{errors?.contractId?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label">
              <FormattedMessage id="Power billing cycle" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="cycleId"
              id="cycleId"
              isDisabled={isReadOnly}
              innerRef={register()}
              options={cycles.map((item) => ({
                value: item.id,
                label: renderCycleLabel(item)
              }))}
              className="react-select"
              classNamePrefix="select"
              placeholder={intl.formatMessage({ id: 'Select billing cycle' })}
              formatOptionLabel={(option) => <>{option.label}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
            />
            {errors?.cycleId && <FormFeedback className="d-block">{errors?.cycleId?.message}</FormFeedback>}
          </Col>
          {currentContractId === 'Mẫu 4' && <Form4 isReadOnly={isReadOnly} />}
          {currentContractId === 'Mẫu 5' && <Form5 isReadOnly={isReadOnly} />}
          {currentContractId === 'Mẫu 7' && <Form7 isReadOnly={isReadOnly} />}
        </Row>
        {['Mẫu 2', 'Mẫu 3'].includes(currentContractId) && (
          <>
            <div className="divider-dashed mt-2 mb-4" />
            <Form2 isReadOnly={isReadOnly} />
          </>
        )}
        {currentContractId === 'Mẫu 6' && (
          <>
            {' '}
            <div className="divider-dashed mt-2 mb-4" />
            <Form6 isReadOnly={isReadOnly} />{' '}
          </>
        )}

        <Row>
          <Col className="mb-2" md={12}>
            <Label className="general-label" for="note">
              <FormattedMessage id="Note" />
            </Label>
            <Input
              id="note"
              name="note"
              autoComplete="on"
              type="textarea"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.note}
              valid={!isReadOnly && getValues('note')?.trim() && !errors.note}
              placeholder={intl.formatMessage({ id: 'Please enter note' })}
            />
            {errors?.note && <FormFeedback className="d-block">{errors?.note?.message}</FormFeedback>}
          </Col>
        </Row>

        <Row>
          <Col xs={12} className="d-flex justify-content-end align-items-center mb-2">
            <Button type="submit" color="primary" className={classNames('mr-1 px-3', submitClassname)}>
              {intl.formatMessage({ id: isReadOnly ? 'Update' : 'Save' })}
            </Button>{' '}
            <Button color="secondary" onClick={handleCancel}>
              {intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
            </Button>{' '}
          </Col>
        </Row>
      </Form>
    </FormProvider>
  )
}

CUForm.propTypes = {
  intl: object.isRequired,
  onSubmit: func,
  onCancel: func,
  initValues: object,
  isReadOnly: bool,
  submitText: string,
  submitClassname: string
}

export default injectIntl(CUForm)
