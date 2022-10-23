/* eslint-disable no-unreachable */
import React, { useEffect, useState } from 'react'
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form'
import * as yup from 'yup'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormattedMessage, injectIntl } from 'react-intl'
import { bool, func, object, string } from 'prop-types'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import {
  API_CHECK_CODE_CONTRACT,
  API_FILES_GET_SINGED_URL,
  API_GET_ALL_CUSTOMER,
  API_POST_FILES,
  ISO_STANDARD_FORMAT,
  SET_FORM_DIRTY,
  SET_SELECTED_CONTRACT
} from '@src/utility/constants'
import Table from '@src/views/common/table/CustomDataTable'
import Select from 'react-select'
import axios from 'axios'
import Clock from '@src/views/billing/clock'
import { ReactComponent as Attachment } from '@src/assets/images/svg/attachment-file.svg'
import { PlusCircle, Trash2, XCircle } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomerWithContactsById } from '@src/views/billing/customer/store/actions'
import './style.scss'
import { get, isEqual } from 'lodash'
import classNames from 'classnames'
import {
  DAYS_OF_MONTH_OPTIONS,
  END_OF_MONTH_OPTION,
  GENERAL_STATUS,
  MONTH_OPTIONS
} from '@src/utility/constants/billing'
import { ContractForm2 } from './ContractForm2'
import {
  ContractForm1Schema,
  ContractForm2Schema,
  ContractForm3Schema,
  ContractForm4Schema,
  ContractForm5Schema,
  ContractForm7Schema,
  ValidateSchemaObj
} from './ValidateSchemaObj'
import { ContractForm4 } from './ContractForm4'
import { ContractForm5 } from './ContractForm5'
import { ContractForm7 } from './ContractForm7'
import { useParams } from 'react-router-dom'
import { getBillingProjectById } from '@src/views/billing/project/store/actions'
import moment from 'moment'
import { getSettingValuesByCode } from '@src/views/billing/settings/store/actions'

import { getAllClockByContractId } from '@src/views/billing/clock/store/actions'
import { ContractForm1 } from './ContractForm1'
import { handleCRUDOfClocks } from '../../util'

function PowerSellingCUForm({ intl, isReadOnly, initValues, submitText, onCancel, onSubmit, cancelText, submitClassname }) {
  const {
    projects: { selectedProject: selectedBillingProject },
    contractClock: { clocks }
  } = useSelector((state) => state)
  const { setting } = useSelector((state) => state.settings)

  const formInitValues = {
    billingCycle: [
      {
        start: { value: 1, label: 1 },
        end: END_OF_MONTH_OPTION,
        month: MONTH_OPTIONS[0]
      }
    ],
    formType: null,
    roundPrecision: 0,
    manualInputAlert: 0,
    confirmAlert: 0,
    billingAlert: 0,
    vat: 8,
    clocks: []
  }

  const [initValuesState, setInitValuesState] = useState(formInitValues)

  const { projectId, id } = useParams()

  const [customers, setCustomers] = useState([])

  const [validateSchemaState, setValidateSchemaState] = useState(ValidateSchemaObj)

  const dispatch = useDispatch()

  useEffect(() => {
    if (Number(projectId) !== Number(selectedBillingProject?.id)) {
      dispatch(
        getBillingProjectById({
          id: projectId,
          isSavedToState: true
        })
      )
    }
  }, [projectId])

  useEffect(() => {
    return () => {
      dispatch({
        type: SET_SELECTED_CONTRACT,
        payload: {}
      })
    }
  }, [])

  useEffect(async () => {
    const allCustomersRes = await axios.get(API_GET_ALL_CUSTOMER)
    const allCustomers = (allCustomersRes.data?.data).filter((item) => item.state === GENERAL_STATUS.ACTIVE)
    setCustomers(
      (allCustomers || []).map(({ id, fullName }) => ({
        value: id,
        label: fullName
      }))
    )
    dispatch(
      getSettingValuesByCode({
        isSavedToState: true,
        code: 'Elec_Selling_Type'
      })
    )
    dispatch(
      getSettingValuesByCode({
        isSavedToState: true,
        code: 'Currency'
      })
    )
  }, [])

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(
      isReadOnly
        ? yup.object().shape({}, [])
        : yup.object().shape(
            validateSchemaState,
            Object.keys(validateSchemaState).filter((item) => validateSchemaState[item])
          )
    ),
    defaultValues: initValuesState || formInitValues
  })

  const {
    handleSubmit,
    getValues,
    errors,
    control,
    register,
    setValue,
    watch,
    setError,
    // clearErrors,
    reset,
    formState: { isDirty: isDirtyForm }
  } = methods
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'billingCycle'
  })

  const isDirty = isDirtyForm || !isEqual(watch('clocks'), clocks)

  useEffect(() => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: isDirty
    })
  }, [isDirty])

  useEffect(async () => {
    if (Number(initValues?.id) === Number(id)) {
      const dataValues = {
        ...initValues,
        formType: (setting.Elec_Selling_Type || []).find((item) => item.value === initValues?.details?.id),
        startDate: initValues.startDate ? moment.utc(initValues.startDate).format(ISO_STANDARD_FORMAT) : null,
        endDate: initValues.endDate ? moment.utc(initValues.endDate).format(ISO_STANDARD_FORMAT) : null,
        customerId: customers.find((item) => item.value === initValues.customerId),
        ...initValues?.details,
        ...initValues?.alerts,
        peakPrice: initValues?.details?.unitPrice?.high,
        idlePrice: initValues?.details?.unitPrice?.low,
        midPointPrice: initValues?.details?.unitPrice?.medium,
        billingCycle: (initValues?.billingPeriods || []).map((item) => ({
          start: DAYS_OF_MONTH_OPTIONS.find((dayOfMonth) => dayOfMonth.value === item.startDay),
          end: item.endOfMonth
            ? END_OF_MONTH_OPTION
            : DAYS_OF_MONTH_OPTIONS.find((dayOfMonth) => dayOfMonth.value === item.endDay),
          month: item.nextMonth ? MONTH_OPTIONS[1] : MONTH_OPTIONS[0]
        })),
        currency: (setting.Currency || []).find((item) => item.value === initValues.details?.currencyUnit),
        currencyHigh: initValues?.details?.foreignUnitPrice?.high,
        currencyMedium: initValues?.details?.foreignUnitPrice?.medium,
        currencyLow: initValues?.details?.foreignUnitPrice?.low
        // clocks
      }

      setInitValuesState(dataValues)

      for (const key in dataValues) {
        if (Object.hasOwnProperty.call(dataValues, key)) {
          const element = dataValues[key]
          setValue(key, element)
        }
      }
    } else if (initValues?.id === -1) {
      setInitValuesState({ ...formInitValues, formType: setting.Elec_Selling_Type?.[0] })
      reset({ ...formInitValues, formType: setting.Elec_Selling_Type?.[0] })
    }
  }, [
    initValues?.id,
    customers?.length,
    setting.Currency?.length,
    setting.Elec_Selling_Type?.length
    // clocks?.map((item) => item.id).join(',')
  ])

  useEffect(() => {
    setValue('clocks', clocks)
  }, [clocks])

  const contactColumns = [
    {
      name: <FormattedMessage id="No." />,
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: <FormattedMessage id="Fullname" />,
      selector: 'fullName'
    },
    {
      name: <FormattedMessage id="Position" />,
      selector: 'position'
    },
    {
      name: <FormattedMessage id="operation-unit-form-mobile" />,
      selector: 'phone'
    },
    {
      name: 'Email',
      selector: 'email',
      cell: (row) => <span>{row.email}</span>
    },
    {
      name: <FormattedMessage id="note" />,
      selector: 'note',
      cell: (row) => <span>{row.note}</span>
    }
  ]

  useEffect(() => {
    const typeOfContract = watch('formType')?.value

    let validateObj = {}
    switch (typeOfContract) {
      case 'Mẫu 1':
        validateObj = { ...ValidateSchemaObj, ...ContractForm1Schema }
        break
      case 'Mẫu 2':
        validateObj = { ...ValidateSchemaObj, ...ContractForm2Schema }
        break
      case 'Mẫu 3':
        validateObj = { ...ValidateSchemaObj, ...ContractForm3Schema }

        break
      case 'Mẫu 4':
        validateObj = { ...ValidateSchemaObj, ...ContractForm4Schema }
        break
      case 'Mẫu 5':
        validateObj = { ...ValidateSchemaObj, ...ContractForm5Schema }
        break
      // case 'Mẫu 6':
      //   validateObj = { ...ValidateSchemaObj }
      //   break
      case 'Mẫu 7':
        validateObj = { ...ValidateSchemaObj, ...ContractForm7Schema }
        break
      default:
        validateObj = ValidateSchemaObj
        break
    }

    setValidateSchemaState(validateObj)
  }, [watch('formType')?.value])

  useEffect(() => {
    const customerId = watch('customerId')?.value
    if (!customerId) return
    dispatch(
      getCustomerWithContactsById({
        id: customerId,
        isSavedToState: true,
        callback: (res) => {
          if (res) {
            setValue('taxCode', res.taxCode)
            setValue('address', res.address)
            setValue('contacts', res.contacts || [])
          }
        }
      })
    )
  }, [watch('customerId')])

  useEffect(() => {
    register('files')
    register('contacts')
    register('clocks')
  }, [register])

  const handleChangeClocks = async (changeClocks, changeId, callback) => {
    const changeItem = changeClocks.filter((item) => item.id === changeId)
    if (Number(initValues?.id) > 0) {
      Promise.all(handleCRUDOfClocks({ clocks: changeItem, contractId: initValues.id }))
        .then(() => {
          dispatch(
            getAllClockByContractId({
              id: initValues?.id,
              isSavedToState: true,
              callback
            })
          )
        })
        .catch(() => {
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
        })
    } else {
      setValue('clocks', changeClocks)
    }
  }
  const handleRemoveFile = (files) => (event) => {
    event.stopPropagation()
    const filesList = getValues('files')
    setValue(
      'files',
      filesList.filter((item) => item.fileName !== files.fileName || item.name !== files.name),
      { shouldValidate: true }
    )
  }

  const handleChangeFiles = (event) => {
    const filesNameCurent = watch('files')?.map((item) => item.fileName?.split(/\//)[1] || item.name)
    let files = Array.from(event.target.files).filter((item) => !filesNameCurent?.includes(item.name))
    files = files.concat(watch('files') || [])
    setValue('files', files, { shouldValidate: true })
  }

  const handleRemoveCycle = (index) => () => {
    if (fields.length > 1) remove(index)
  }

  const handleAppendCycle = () => {
    let newStartDate = {}
    const billingCycleWatch = watch('billingCycle')
    const lastCycleEndDate = billingCycleWatch[billingCycleWatch.length - 1].end

    if (lastCycleEndDate.value === END_OF_MONTH_OPTION.value || lastCycleEndDate.value === 31) {
      newStartDate = DAYS_OF_MONTH_OPTIONS[0]
    } else {
      newStartDate = DAYS_OF_MONTH_OPTIONS.find((item) => item.value === lastCycleEndDate.value + 1)
    }

    append({ ...formInitValues.billingCycle[0], start: newStartDate })
  }
  // const validateBillingCycle = (billingCycleArr) => {
  //   const billingCycleErr = (billingCycleArr || []).reduce((array, cycle, index) => {
  //     if (index === 0) return array
  //     const preCycleEnd = billingCycleArr[index - 1]
  //     if (
  //       ((preCycleEnd.value === END_OF_MONTH_OPTION.value || preCycleEnd.value === 31) && cycle.start?.value !== 1) ||
  //       preCycleEnd.value !== cycle.start?.value - 1
  //     ) {
  //       setError(`billingCycle[${index}].start`, {
  //         type: 'custom',
  //         message: <FormattedMessage id="Start date must be the next day of the previous period's end date" />,
  //         shouldFocus: true
  //       })
  //       setError(`billingCycle[${index - 1}].end`, {
  //         type: 'custom',
  //         message: <FormattedMessage id="Start date must be the next day of the previous period's end date" />,
  //         shouldFocus: true
  //       })
  //       return [...array, `billingCycle[${index}].start`]
  //     } else {
  //       clearErrors([`billingCycle[${index}].start`, `billingCycle[${index - 1}].end`])
  //       return array.filter((item) => item !== `billingCycle[${index}].start`)
  //     }
  //   }, [])

  //   return billingCycleErr.length > 0
  // }

  const handleSubmitForm = async (values) => {
    if (isReadOnly) {
      onSubmit?.(initValues)
      return
    }
    let listNamePostFile = []

    // if (validateBillingCycle()) {
    //   return
    // }
    // check trùng  mã khách hàng
    const dataCheck = { code: values.code }
    if (initValues?.id > 0) dataCheck.id = initValues?.id
    try {
      const checkDupCodeRes = await axios.post(API_CHECK_CODE_CONTRACT, dataCheck)

      if (checkDupCodeRes.status === 200 && checkDupCodeRes.data?.data) {
        setError('code', {
          type: 'custom',
          message: intl.formatMessage({ id: 'dubplicated-validate' }),
          shouldFocus: true
        })
        return
      }

      // handle on change file  ( --except remove file)

      const formData = new FormData()
      const curentListFileName = watch('files')?.map((item) => item.name || item.fileName)
      const listNewFiles = watch('files')?.filter((item) => !initValues?.files?.includes(item)) || []
      if (listNewFiles?.length > 0) {
        for (const file of listNewFiles) {
          formData.append('files', file)
        }
        const dataReponse = await axios.post(API_POST_FILES, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        listNamePostFile = dataReponse?.data?.data
      }

      listNamePostFile = listNamePostFile.concat(
        initValues?.files?.filter((item) => curentListFileName?.includes(item.name || item.fileName)) || []
      )
      //end
    } catch (err) {
      console.log('err', err)
      const alert =
        initValues?.id > 0 ? 'Failed to update data. Please try again' : 'Failed to create data. Please try again'
      showToast(
        'error',
        intl.formatMessage({
          id: alert
        })
      )
      return
    }
    if (!(values.clocks || [])?.filter((item) => !item.isDelete).length > 0) {
      showToast('error', <FormattedMessage id="Need at least 1 clock to add contract. Please try again" />)
      return
    }
    const payload = {
      state: GENERAL_STATUS.ACTIVE,
      code: values.code,
      type: 'CUSTOMER',
      projectId,
      customerId: values.customerId?.value,
      roofVendorId: null,
      startDate: values.startDate ? moment.utc(values.startDate) : null,
      endDate: values.endDate ? moment.utc(values.endDate) : null,
      files: listNamePostFile,
      billingPeriods: (values.billingCycle || []).map((item, index) => {
        const returnedCycle = {
          id: index + 1,
          startDay: item.start?.value,
          endDay: item.end?.value === END_OF_MONTH_OPTION.value ? 31 : item.end?.value,
          nextMonth: item.month?.value === MONTH_OPTIONS[1].value
        }
        if (item.end?.value === END_OF_MONTH_OPTION.value) {
          returnedCycle.endOfMonth = true
        }
        return returnedCycle
      }),
      alerts: {
        manualInputAlert: values.manualInputAlert,
        confirmAlert: values.confirmAlert,
        billingAlert: values.billingAlert
      }
    }
    let contractDetail = {
      id: values.formType?.value,
      name: values.formType?.value,
      roundPrecision: values.roundPrecision,
      vat: values.vat,
      unitPrice: {
        low: values.idlePrice,
        medium: values.midPointPrice,
        high: values.peakPrice
      }
    }

    switch (values.formType?.value) {
      case 'Mẫu 1':
        contractDetail = {
          ...contractDetail,
          payoutRatio: values.payoutRatio
        }
        break
      case 'Mẫu 2':
        contractDetail = {
          ...contractDetail,
          payoutRatio: values.payoutRatio,
          lossRate: values.lossRate
        }
        break
      case 'Mẫu 3':
        contractDetail = {
          ...contractDetail,
          lossRate: values.lossRate
        }
        break
      case 'Mẫu 4':
        contractDetail = {
          ...contractDetail,
          unitPriceRate: values.unitPriceRate,
          currencyUnit: values.currency?.value,
          foreignUnitPrice: {
            low: values.currencyLow,
            medium: values.currencyMedium,
            high: values.currencyHigh
          }
        }
        break
      case 'Mẫu 5':
        contractDetail = {
          ...contractDetail,
          revenueShareRatio: values.revenueShareRatio
        }
        break
      case 'Mẫu 7':
        contractDetail = {
          ...contractDetail,
          chargeRate: values.chargeRate
        }
        break

      default:
        break
    }

    onSubmit?.({ ...payload, details: contractDetail, clocks: values.clocks })
  }

  const handleCancel = () => {
    onCancel?.(isDirty)
  }

  // const handleChangeArrayField = (onChange, field, index) => (event) => {
  //   const dataBillingCycle = watch('billingCycle')
  //   if (field === 'start' && index !== 0) {
  //     const prevEnd = dataBillingCycle[index - 1].end?.value
  //     if (
  //       ((prevEnd === END_OF_MONTH_OPTION.value || prevEnd === 31) && event.value !== 1) ||
  //       prevEnd !== event.value - 1
  //     ) {
  //       setError(`billingCycle[${index - 1}].end`, {
  //         type: 'custom',
  //         message: <FormattedMessage id="Start date must be the next day of the previous period's end date" />
  //       })
  //     } else {
  //       clearErrors([`billingCycle[${index}].start`, `billingCycle[${index - 1}].end`])
  //     }
  //   }
  //   if (field === 'end' && index !== dataBillingCycle.length - 1) {
  //     const nextStart = dataBillingCycle[index + 1].start?.value

  //     if (
  //       ((event.value === END_OF_MONTH_OPTION.value || event.value === 31) && nextStart !== 1) ||
  //       event.value !== nextStart - 1
  //     ) {
  //       setError(`billingCycle[${index + 1}].start`, {
  //         type: 'custom',
  //         message: <FormattedMessage id="Start date must be the next day of the previous period's end date" />
  //       })
  //     } else {
  //       clearErrors([`billingCycle[${index}].end`, `billingCycle[${index + 1}].start`])
  //     }
  //   }
  //   onChange?.(event)
  // }

  const handleClickToFileInput = (e) => {
    e.target.value = null
  }
  const handleCLickFileName = (item) => async (e) => {
    e.preventDefault()

    const fileLink = await axios.get(`${API_FILES_GET_SINGED_URL}?fileName=${item?.fileName}`)

    if (fileLink.status === 200 && fileLink.data?.data) {
      if (item.url && isReadOnly) {
        const aTag = document.createElement('a')
        aTag.setAttribute('href', fileLink?.data?.data?.signedUrl)
        aTag.setAttribute('target', '_blank')
        aTag.click()
      }
    }
  }
  return (
    <FormProvider {...methods}>
      <Form className="billing-form" onSubmit={handleSubmit(handleSubmitForm)}>
        <Row>
          <Col className="mb-2" xs={6} lg={3}>
            <Label className="general-label" for="code">
              <FormattedMessage id="Contract number" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="code"
              name="code"
              disabled={isReadOnly}
              autoComplete="on"
              invalid={!isReadOnly && !!errors.code}
              valid={!isReadOnly && getValues('code')?.trim() && !errors.code}
              innerRef={register()}
              placeholder={intl.formatMessage({ id: 'Enter contract number' })}
            />
            {errors?.code && <FormFeedback>{errors?.code?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" xs={6} lg={2}>
            <Label className="general-label" for="startDate">
              <FormattedMessage id="Signed date" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              className="custom-icon-input-date"
              type="date"
              name="startDate"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.startDate}
              valid={!isReadOnly && getValues('startDate')?.trim() && !errors.startDate}
            />
            {errors?.startDate && <FormFeedback>{errors?.startDate?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" xs={6} lg={2}>
            <Label className="general-label" for="endDate">
              <FormattedMessage id="Expiration date" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              className="custom-icon-input-date"
              type="date"
              name="endDate"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.endDate}
              valid={!isReadOnly && getValues('endDate')?.trim() && !errors.endDate}
            />
            {errors?.endDate && <FormFeedback>{errors?.endDate?.message}</FormFeedback>}
          </Col>
          <Col xs={12} className=" mb-2 d-flex flex-column justify-content-end">
            <div className="d-flex align-items-end">
              <div className="mr-2">
                {watch('files')?.map((item) => (
                  <a
                    key={item?.fileName || item?.name}
                    onClick={handleCLickFileName(item)}
                    href={'#'}
                    className="d-block"
                  >
                    <Row className='mb-1'>
                      <Col xs={10}>{(item?.fileName && `${item?.fileName?.split(/\//)[1]}`) || item?.name}</Col>
                      <Col xs={1}>
                        {!isReadOnly && (
                          <span className="ml-1" role="button" onClick={handleRemoveFile(item)}>
                            <XCircle size={14} color="#838A9C" />
                          </span>
                        )}
                      </Col>
                    </Row>
                  </a>
                ))}
              </div>
              <div className="d-flex align-items-center">
                <Label
                  className={classNames('files-attachment-label', isReadOnly && 'files-attachment-label-disabled cursor-pointer')}
                  for="file"
                  role="button"
                >
                  <span >
                    <Attachment className={classNames('mr-1', isReadOnly && "opacity-50")}/>
                  </span>
                  <FormattedMessage id="Đính kèm file hợp đồng" />
                </Label>
                <Input
                  type="file"
                  disabled={isReadOnly}
                  id="file"
                  multiple
                  onChange={handleChangeFiles}
                  onClick={handleClickToFileInput}
                  className="d-none"
                />
              </div>
            </div>
            {errors?.files && <FormFeedback className="d-block">{errors?.files?.message}</FormFeedback>}
          </Col>
        </Row>

        <Row>
          <Col className="mb-2" xs={6} lg={3}>
            <Label className="general-label" for="customerId">
              <FormattedMessage id="Customer" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="customerId"
              id="customerId"
              isDisabled={isReadOnly}
              innerRef={register()}
              options={customers}
              className="react-select"
              classNamePrefix="select"
              placeholder={intl.formatMessage({ id: 'Select customer' })}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
            />
            {errors?.customerId && <FormFeedback className="d-block">{errors?.customerId?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" xs={6} lg={2}>
            <Label className="general-label" for="taxCode">
              <FormattedMessage id="operation-unit-form-taxCode" />
            </Label>
            <Input
              id="taxCode"
              name="taxCode"
              autoComplete="on"
              innerRef={register()}
              disabled
              invalid={!isReadOnly && !!errors.taxCode}
              valid={!isReadOnly && getValues('taxCode')?.trim() && !errors.taxCode}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-taxCode-placeholder' })}
            />
            {errors?.taxCode && <FormFeedback>{errors?.taxCode?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" xs={6} lg={5}>
            <Label className="general-label" for="address">
              <FormattedMessage id="operation-unit-form-address" />
            </Label>
            <Input
              id="address"
              name="address"
              autoComplete="on"
              innerRef={register()}
              disabled
              invalid={!isReadOnly && !!errors.address}
              valid={!isReadOnly && getValues('address')?.trim() && !errors.address}
              placeholder={intl.formatMessage({ id: 'operation-unit-form-address-placeholder' })}
            />
            {errors?.address && <FormFeedback>{errors?.address?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Label className="general-label" for="contacts">
              <FormattedMessage id="Notification recievers" />
            </Label>
            <Table tableId="project" columns={contactColumns} data={watch('contacts')} pagination={null} />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <h4 className="typo-section mb-2 text-uppercase">
              <FormattedMessage id="Power billing cycle" />
            </h4>

            {fields.map((item, index) => {
              const getValidStart = get(errors, `billingCycle[${index}].start`)
              const getValidEnd = get(errors, `billingCycle[${index}].end`)

              return (
                <div
                  key={item.id}
                  className={classNames('d-flex align-items-center ', index !== fields.length - 1 && 'my-2')}
                >
                  <div className="cycle-item-wrapper">
                    <Row>
                      <Col xs={12} lg="auto" className="d-flex align-items-center">
                        <Label className="general-label mb-0">
                          {`${intl.formatMessage({ id: 'Cycle' })} ${index + 1}`}
                          <span className="text-danger">&nbsp;(*)</span>
                        </Label>
                      </Col>
                      <Col xs={12} lg={3}>
                        <Controller
                          render={(field) => {
                            return (
                              <Select
                                {...field}
                                isDisabled={isReadOnly}
                                theme={selectThemeColors}
                                className="react-select"
                                classNamePrefix="select"
                                options={DAYS_OF_MONTH_OPTIONS}
                                formatOptionLabel={(option) => <>{option.label}</>}
                                // onChange={handleChangeArrayField(onChange, 'start', index)}
                              />
                            )
                          }}
                          control={control}
                          name={`billingCycle[${index}].start`}
                          innerRef={register()}
                          defaultValue={item.start}
                        />
                        {getValidStart && <FormFeedback className="d-block">{getValidStart?.message}</FormFeedback>}
                      </Col>
                      <Col xs={12} lg={3}>
                        <Controller
                          render={(field) => {
                            return (
                              <Select
                                {...field}
                                isDisabled={isReadOnly}
                                theme={selectThemeColors}
                                className="react-select"
                                classNamePrefix="select"
                                options={[...DAYS_OF_MONTH_OPTIONS, END_OF_MONTH_OPTION]}
                                formatOptionLabel={(option) => <>{option.label}</>}
                                // onChange={handleChangeArrayField(onChange, 'end', index)}
                              />
                            )
                          }}
                          control={control}
                          name={`billingCycle[${index}].end`}
                          innerRef={register()}
                          defaultValue={item.end}
                        />
                        {getValidEnd && <FormFeedback className="d-block">{getValidEnd?.message}</FormFeedback>}
                      </Col>
                      <Col xs={12} lg={3}>
                        <Controller
                          render={(field) => {
                            return (
                              <Select
                                {...field}
                                isDisabled={isReadOnly}
                                theme={selectThemeColors}
                                className="react-select"
                                classNamePrefix="select"
                                options={MONTH_OPTIONS}
                                formatOptionLabel={(option) => <>{option.label}</>}
                                // onChange={handleChangeArrayField(onChange, 'month', index)}
                              />
                            )
                          }}
                          control={control}
                          name={`billingCycle[${index}].month`}
                          innerRef={register()}
                          defaultValue={item.month}
                        />
                      </Col>

                      {!isReadOnly && fields.length > 1 && (
                        <Col xs={12} lg="auto" className="d-flex align-items-center">
                          <span role="button" onClick={handleRemoveCycle(index)}>
                            <Trash2 size={18} />
                          </span>
                        </Col>
                      )}
                    </Row>
                  </div>
                  {!isReadOnly && index === fields.length - 1 && (
                    <div className="ml-1" role="button" onClick={handleAppendCycle}>
                      <PlusCircle color="#e9eef6" fill="#0394FF" />
                    </div>
                  )}
                </div>
              )
            })}
          </Col>
        </Row>

        <div className="divider-dashed mb-2" />
        <Row className="mb-2">
          <Col xs={12} lg={5}>
            <Row>
              <Col className="mb-2" xs={6} lg={8}>
                <Label className="general-label" for="formType">
                  <FormattedMessage id="Power billing form" />
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  theme={selectThemeColors}
                  name="formType"
                  isDisabled={isReadOnly}
                  innerRef={register()}
                  options={setting.Elec_Selling_Type || []}
                  className="react-select"
                  classNamePrefix="select"
                  formatOptionLabel={(option) => <>{option.label}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                />
                {errors?.formType && <FormFeedback>{errors?.formType?.message}</FormFeedback>}
              </Col>
              <Col className="mb-2" xs={6} lg={4}>
                <Label className="general-label" for="vat">
                  <FormattedMessage id="VAT (%)" />
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Input
                  id="vat"
                  name="vat"
                  autoComplete="on"
                  innerRef={register()}
                  invalid={!isReadOnly && !!errors.vat}
                  disabled={isReadOnly}
                  valid={!isReadOnly && getValues('vat')?.trim() && !errors.vat}
                  placeholder={intl.formatMessage({ id: 'Enter' })}
                />
                {errors?.vat && <FormFeedback>{errors?.vat?.message}</FormFeedback>}
              </Col>
            </Row>
            <Row>
              {['Mẫu 1', 'Mẫu 2'].includes(watch('formType')?.value) && <ContractForm1 isReadOnly={isReadOnly} />}
              <Col className="mb-2" xs={6} lg={4}>
                <Label className="general-label" for="roundPrecision">
                  <FormattedMessage id="Rounding" />
                  <span className="text-danger">&nbsp;(*)</span>
                </Label>
                <Input
                  id="roundPrecision"
                  name="roundPrecision"
                  autoComplete="on"
                  innerRef={register()}
                  disabled={isReadOnly}
                  invalid={!isReadOnly && !!errors.roundPrecision}
                  valid={!isReadOnly && getValues('roundPrecision')?.trim() && !errors.roundPrecision}
                  placeholder={intl.formatMessage({ id: 'Enter' })}
                />
                {errors?.roundPrecision && <FormFeedback>{errors?.roundPrecision?.message}</FormFeedback>}
              </Col>
            </Row>
          </Col>
          <Col xs={0} lg={1} className="divider-vertical" />

          <Col xs={12} lg={{ size: 5, offset: 1 }}>
            <Row>
              <Col className="mb-2 d-flex align-items-center" xs={6} lg={9}>
                <Label className="general-label mb-0" for="manualInputAlert">
                  <FormattedMessage id="Remind to enter power index" />
                  <span className="text-danger">&nbsp;(*)</span>
                  <span className="font-weight-normal">
                    {' '}
                    (<FormattedMessage id="day" />){' '}
                  </span>
                  <span className="form-text-sub">
                    {' '}
                    (<FormattedMessage id="from the end of cycle" />){' '}
                  </span>
                </Label>
              </Col>
              <Col className="mb-2" xs={6} lg={3}>
                <Input
                  id="manualInputAlert"
                  name="manualInputAlert"
                  autoComplete="on"
                  innerRef={register()}
                  disabled={isReadOnly}
                  invalid={!isReadOnly && !!errors.manualInputAlert}
                  valid={!isReadOnly && getValues('manualInputAlert')?.trim() && !errors.manualInputAlert}
                  placeholder={intl.formatMessage({ id: 'Enter' })}
                />
                {errors?.manualInputAlert && <FormFeedback>{errors?.manualInputAlert?.message}</FormFeedback>}
              </Col>
            </Row>
            <Row>
              <Col className="mb-2 d-flex align-items-center" xs={6} lg={9}>
                <Label className="general-label mb-0" for="confirmAlert">
                  <FormattedMessage id="Remind customer to confirm" />
                  <span className="text-danger">&nbsp;(*)</span>
                  <span className="font-weight-normal">
                    {' '}
                    (<FormattedMessage id="day" />){' '}
                  </span>
                  <span className="form-text-sub">
                    {' '}
                    (<FormattedMessage id="from the end of cycle" />){' '}
                  </span>
                </Label>
              </Col>
              <Col className="mb-2" xs={6} lg={3}>
                <Input
                  id="confirmAlert"
                  name="confirmAlert"
                  autoComplete="on"
                  disabled={isReadOnly}
                  innerRef={register()}
                  invalid={!isReadOnly && !!errors.confirmAlert}
                  valid={!isReadOnly && getValues('confirmAlert')?.trim() && !errors.confirmAlert}
                  placeholder={intl.formatMessage({ id: 'Enter' })}
                />
                {errors?.confirmAlert && <FormFeedback>{errors?.confirmAlert?.message}</FormFeedback>}
              </Col>
            </Row>{' '}
            <Row>
              <Col className="mb-2 d-flex align-items-center" xs={6} lg={9}>
                <Label className="general-label mb-0" for="billingAlert">
                  <FormattedMessage id="Date of payment" />
                  <span className="text-danger">&nbsp;(*)</span>
                  <span className="font-weight-normal">
                    {' '}
                    (<FormattedMessage id="day" />){' '}
                  </span>
                  <span className="form-text-sub">
                    {' '}
                    (<FormattedMessage id="from the end of cycle" />){' '}
                  </span>
                </Label>
              </Col>
              <Col className="mb-2" xs={6} lg={3}>
                <Input
                  id="billingAlert"
                  name="billingAlert"
                  autoComplete="on"
                  disabled={isReadOnly}
                  innerRef={register()}
                  invalid={!isReadOnly && !!errors.billingAlert}
                  valid={!isReadOnly && getValues('billingAlert')?.trim() && !errors.billingAlert}
                  placeholder={intl.formatMessage({ id: 'Enter' })}
                />
                {errors?.billingAlert && <FormFeedback>{errors?.billingAlert?.message}</FormFeedback>}
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="divider-dashed mb-2" />
        <Row className="mb-2">
          <Col>
            <h4 className="typo-section mb-2">
              <FormattedMessage id="Unit price of electricity (VND)" />
            </h4>
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" xs={12} lg={4}>
            <Label className="general-label" for="peakPrice">
              <FormattedMessage id="Peak" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="peakPrice"
              name="peakPrice"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!isReadOnly && !!errors.peakPrice}
              valid={!isReadOnly && getValues('peakPrice')?.trim() && !errors.peakPrice}
              placeholder={intl.formatMessage({ id: 'Enter price' })}
            ></Input>
            {errors?.peakPrice && <FormFeedback>{errors?.peakPrice?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" xs={12} lg={4}>
            <Label className="general-label" for="midPointPrice">
              <FormattedMessage id="Mid-point" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="midPointPrice"
              name="midPointPrice"
              autoComplete="on"
              innerRef={register()}
              disabled={isReadOnly}
              invalid={!isReadOnly && !!errors.midPointPrice}
              valid={!isReadOnly && getValues('midPointPrice')?.trim() && !errors.midPointPrice}
              placeholder={intl.formatMessage({ id: 'Enter price' })}
            />
            {errors?.midPointPrice && <FormFeedback>{errors?.midPointPrice?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" xs={12} lg={4}>
            <Label className="general-label" for="idlePrice">
              <FormattedMessage id="Idle" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="idlePrice"
              name="idlePrice"
              autoComplete="on"
              innerRef={register()}
              invalid={!isReadOnly && !!errors.idlePrice}
              disabled={isReadOnly}
              valid={!isReadOnly && getValues('idlePrice')?.trim() && !errors.idlePrice}
              placeholder={intl.formatMessage({ id: 'Enter price' })}
            />
            {errors?.idlePrice && <FormFeedback>{errors?.idlePrice?.message}</FormFeedback>}
          </Col>
        </Row>
        {['Mẫu 2', 'Mẫu 3'].includes(watch('formType')?.value) && <ContractForm2 isReadOnly={isReadOnly} />}
        {watch('formType')?.value === 'Mẫu 4' && <ContractForm4 isReadOnly={isReadOnly} />}
        {watch('formType')?.value === 'Mẫu 5' && <ContractForm5 isReadOnly={isReadOnly} />}
        {watch('formType')?.value === 'Mẫu 7' && <ContractForm7 isReadOnly={isReadOnly} />}
        <div className="divider-dashed mb-2" />
        <Clock disabled={isReadOnly} data={watch('clocks')} onChange={handleChangeClocks} contractId={initValues?.id} />

        <Row>
          <Col className="d-flex justify-content-end align-items-center mb-2">
            <Button type="submit" color="primary" className={classNames('mr-1 px-3', submitClassname)}>
              {submitText || intl.formatMessage({ id: 'Save' })}
            </Button>{' '}
            <Button color="secondary" onClick={handleCancel}>
              {cancelText || intl.formatMessage({ id: 'Cancel' })}
            </Button>{' '}
          </Col>
        </Row>
      </Form>
    </FormProvider>
  )
}

PowerSellingCUForm.propTypes = {
  intl: object,
  isReadOnly: bool,
  submitText: string,
  initValues: object,
  onCancel: func,
  onSubmit: func,
  cancelText: string,
  submitClassname: string


}

export default injectIntl(PowerSellingCUForm)
