import { yupResolver } from '@hookform/resolvers/yup'
import {
  API_CHECK_CODE_CONTRACT,
  API_FILES_GET_SINGED_URL,
  API_POST_FILES,
  NUMBER_REGEX,
  REAL_NUMBER,
  SET_FORM_DIRTY
} from '@src/utility/constants'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import Table from '@src/views/common/table/CustomDataTable'
import axios from 'axios'
import { bool, func, object, string } from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import * as yup from 'yup'
import { getAllRoofVendor, getRoofVendorWithContactsById } from '../../roof-rental-unit/store/actions'
import ContractByPercentage from './typesOfContracts/ContractByPercentage'
import MonthlyRent from './typesOfContracts/CyclicalContract'
import { useParams } from 'react-router-dom'
import { XCircle } from 'react-feather'
import { ReactComponent as Attachment } from '@src/assets/images/svg/attachment-file.svg'
import { getSettingValuesByCode } from '@src/views/billing/settings/store/actions'
import { GENERAL_STATUS, VALUE_OF_ROOF_CONTRACT } from '@src/utility/constants/billing'
import '@src/@core/scss/billing-sweet-alert.scss'
import classNames from 'classnames'

const RoofVendorContractCUForm = ({ intl, onCancel, initValues, isReadOnly, onSubmit, submitClassname }) => {
  const [valueSetting, setValueSetting] = useState([])
  const defaultValues = {
    contractType: valueSetting[0]
  }
  const { setting } = useSelector((state) => state.settings)
  const defaultValid = {
    roofVendorName: yup.object().shape({
      label: yup.string().required(intl.formatMessage({ id: 'required-validate' })),
      value: yup.string().required(intl.formatMessage({ id: 'required-validate' }))
    }),
    contractCode: yup
      .string()
      .required(intl.formatMessage({ id: 'required-validate' }))
      .max(50, intl.formatMessage({ id: 'max-validate' })),
    effectiveDate: yup.string().required(intl.formatMessage({ id: 'required-validate' })),
    expirationDate: yup.string().required(intl.formatMessage({ id: 'required-validate' })),
    contractType: yup.object().shape({
      label: yup.string().required(intl.formatMessage({ id: 'required-validate' })),
      value: yup.string().required(intl.formatMessage({ id: 'required-validate' }))
    })
  }

  const dispatch = useDispatch()
  useEffect(async () => {
    dispatch(
      getSettingValuesByCode({
        isSavedToState: true,
        code: 'Roof_Vendor_Contract'
      })
    )
  }, [])
  useEffect(() => {
    setValueSetting(
      (setting?.Roof_Vendor_Contract || [])?.map((item) => ({
        ...item,
        value: VALUE_OF_ROOF_CONTRACT[item?.value] || 0
      }))
    )
  }, [setting])
  const {
    billingContacts: { contacts }
  } = useSelector((state) => state)
  const { projectId } = useParams()
  useEffect(() => {
    dispatch(getAllRoofVendor())
  }, [])

  const { data } = useSelector((state) => state.roofUnit)

  const listOfRoofvendor = data
    .filter((item) => item.state === GENERAL_STATUS.ACTIVE)
    .map((item) => {
      return { value: item.id, label: item.name }
    })

  const [validForm, setValidForm] = useState(defaultValid)

  const columns = [
    {
      name: <FormattedMessage id="No." />,
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: <FormattedMessage id="represent" />,
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
  const ValidateSchema = yup.object().shape(validForm)
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(isReadOnly ? yup.object().shape({}) : ValidateSchema),
    defaultValues: initValues || defaultValues
  })
  const {
    handleSubmit,
    getValues,
    errors,
    control,
    register,
    reset,
    watch,
    setValue,
    setError,
    formState: { isDirty }
  } = methods

  useEffect(() => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: isDirty
    })
  }, [isDirty])

  const typeContract = watch('contractType', valueSetting[0])
  const selectRoofVendor = watch(
    'roofVendorName',
    listOfRoofvendor.find((item) => item.value === initValues?.roofId)
  )
  useEffect(() => {
    setValue('roofVendorName', selectRoofVendor)
    setValue('taxCode', data.find((item) => item.id === selectRoofVendor?.value)?.taxCode)
    setValue('address', data.find((item) => item.id === selectRoofVendor?.value)?.address)
    if (selectRoofVendor) {
      dispatch(getRoofVendorWithContactsById({ id: selectRoofVendor?.value, isSavedToState: true }))
    }
  }, [selectRoofVendor])
  const isCyclicalContract = useMemo(() => typeContract?.value === 2 || typeContract?.value === 3, [typeContract])

  useEffect(() => {
    // thay đổi valid tùy theo các subform
    setValidForm(defaultValid)
    if (isCyclicalContract) {
      setValidForm({
        ...defaultValid,
        rentalAmount: yup
          .string()
          .required(intl.formatMessage({ id: 'required-validate' }))
          .max(16, intl.formatMessage({ id: 'max-validate' }))
          .matches(REAL_NUMBER, {
            // lấy kiểu số  thực
            message: intl.formatMessage({ id: 'invalid-character-validate' }),
            excludeEmptyString: true
          }),
        announcementDate: yup
          .string()
          .required(intl.formatMessage({ id: 'required-validate' }))
          .max(2, intl.formatMessage({ id: 'max-validate' }))
          .matches(NUMBER_REGEX, {
            // lấy kiểu số  thực
            message: intl.formatMessage({ id: 'invalid-character-validate' }),
            excludeEmptyString: true
          }),
        confirmationReminder: yup
          .string()
          .required(intl.formatMessage({ id: 'required-validate' }))
          .max(2, intl.formatMessage({ id: 'max-validate' }))
          .matches(NUMBER_REGEX, {
            // lấy kiểu số  thực
            message: intl.formatMessage({ id: 'invalid-character-validate' }),
            excludeEmptyString: true
          }),
        startDate: yup
          .string()
          .required(intl.formatMessage({ id: 'required-validate' }))
          .max(10, intl.formatMessage({ id: 'max-validate' }))
      })
    } else if (typeContract?.value === 4) {
      setValidForm({
        ...defaultValid,
        percentTurnover: yup
          .string()
          .required(intl.formatMessage({ id: 'required-validate' }))
          .max(16, intl.formatMessage({ id: 'max-validate' }))
          .matches(REAL_NUMBER, {
            message: intl.formatMessage({ id: 'invalid-character-validate' }),
            excludeEmptyString: true
          }),
        confirmationReminder: yup
          .string()
          .required(intl.formatMessage({ id: 'required-validate' }))
          .max(2, intl.formatMessage({ id: 'max-validate' }))
          .matches(NUMBER_REGEX, {
            // lấy kiểu số  thực
            message: intl.formatMessage({ id: 'invalid-character-validate' }),
            excludeEmptyString: true
          })
      })
    }
  }, [typeContract])

  useEffect(() => {
    const contractValue = {
      ...initValues,
      roofVendorName: listOfRoofvendor.find((item) => item.value === initValues?.roofId),
      contractType: valueSetting.find((item) => item.value === initValues?.typeContract),
      taxCode: data.find((item) => item.id === selectRoofVendor?.value)?.taxCode,
      address: data.find((item) => item.id === selectRoofVendor?.value)?.address
    }
    reset(contractValue)
  }, [initValues])
  const handleProcessFormData = async (value) => {
    let listNamePostFile = []

    const dataCheck = { code: value?.contractCode }
    if (initValues?.id) dataCheck.id = initValues?.id
    try {
      const checkDupCodeRes = await axios.post(API_CHECK_CODE_CONTRACT, dataCheck)
      if (checkDupCodeRes.status === 200 && checkDupCodeRes.data?.data) {
        setError('contractCode', { type: 'custom', message: intl.formatMessage({ id: 'dubplicated-validate' }) })
        return
      }

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
    } catch (err) {
      console.log('err', err)
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
    const newValue = {
      ...value,
      state: 'ACTIVE',
      code: value?.contractCode,
      type: 'ROOF_VENDOR',
      projectId,
      roofVendorId: Number(value?.roofVendorName?.value),
      startDate: value?.effectiveDate,
      endDate: value?.expirationDate,
      files: listNamePostFile,
      alerts: {
        confirmAlert: value?.confirmationReminder,
        billingAlert: value?.announcementDate
      },
      details: {
        id: value?.contractType?.label,
        rentalAmount: value?.rentalAmount,
        percent: value?.percentTurnover,
        startDate: value?.startDate
      }
    }
    onSubmit?.(newValue)
  }
  useEffect(() => {
    register('files')
  }, [register])
  const handleCancelForm = () => {
    onCancel?.(isDirty)
  }

  const handleChangeFiles = (event) => {
    const filesNameCurent = watch('files')?.map((item) => item.fileName?.split(/\//)[1] || item.name)
    let files = Array.from(event.target.files).filter((item) => !filesNameCurent?.includes(item.name))
    files = files.concat(watch('files') || [])
    setValue('files', files, { shouldValidate: true })
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
      <Form className="billing-form" onSubmit={handleSubmit(handleProcessFormData)}>
        <Row>
          <Col className="mb-3" md={3} xs={12} lg={4}>
            <Label className="general-label">
              <FormattedMessage id="contract-code" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="contractCode"
              name="contractCode"
              autoComplete="on"
              disabled={isReadOnly}
              innerRef={register()}
              invalid={!!errors.contractCode}
              valid={getValues('contractCode')?.trim() && !errors.contractCode && !isReadOnly}
              placeholder={intl.formatMessage({ id: 'Enter the contract code' })}
            />
            {errors?.contractCode && <FormFeedback>{errors?.contractCode?.message}</FormFeedback>}
          </Col>
          <Col md={2} xs={12} lg={2}>
            <Label className="general-label" for="status">
              <FormattedMessage id="effectiveDate" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              id="effectiveDate"
              name="effectiveDate"
              disabled={isReadOnly}
              autoComplete="on"
              innerRef={register()}
              invalid={!!errors.effectiveDate}
              valid={getValues('effectiveDate')?.trim() && !errors.effectiveDate && !isReadOnly}
              type="date"
              className="custom-icon-input-date"
            />
            {errors?.effectiveDate && <FormFeedback>{errors?.effectiveDate?.message}</FormFeedback>}
          </Col>
          <Col md={2} xs={12} lg={2}>
            <Label className="general-label">
              <FormattedMessage id="expirationDate" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>

            <Input
              id="expirationDate"
              name="expirationDate"
              disabled={isReadOnly}
              autoComplete="on"
              innerRef={register()}
              invalid={!!errors.expirationDate}
              valid={getValues('expirationDate')?.trim() && !errors.expirationDate && !isReadOnly}
              type="date"
              className="custom-icon-input-date"
            />
            {errors?.expirationDate && <FormFeedback>{errors?.expirationDate?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
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
                    <Row className="mb-1">
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
                  className={classNames(
                    'files-attachment-label ml-2',
                    isReadOnly && 'files-attachment-label-disabled cursor-pointer'
                  )}
                  for="file"
                  role="button"
                >
                  <span>
                    <Attachment className={classNames('mr-1', isReadOnly && 'opacity-50')} />
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
          <Col className="mb-3" md={3} xs={12} lg={4}>
            <Label className="general-label">
              <FormattedMessage id="Roof rental unit name" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              as={Select}
              control={control}
              isDisabled={isReadOnly}
              theme={selectThemeColors}
              name="roofVendorName"
              options={listOfRoofvendor}
              id="roofVendorName"
              autoComplete="on"
              innerRef={register()}
              className="react-select"
              classNamePrefix="select"
              valid={!!getValues('roofVendorName')?.value}
              invalid={!!errors.roofVendorName}
              placeholder={intl.formatMessage({ id: 'Select roof rental vendor' })}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
              
            />
            {!!errors?.roofVendorName && (
              <FormFeedback className="d-block">{errors?.roofVendorName?.value?.message}</FormFeedback>
            )}
          </Col>

          <Col md={2} xs={12} lg={2}>
            <Label className="general-label">
              <FormattedMessage id="operation-unit-form-taxCode" />
            </Label>
            <Input id="taxCode" name="taxCode" innerRef={register()} autoComplete="on" disabled={true} />
          </Col>

          <Col md={6} xs={12} lg={6}>
            <Label className="general-label">
              <FormattedMessage id="operation-unit-form-address" />
            </Label>
            <Input id="address" name="address" innerRef={register()} autoComplete="on" disabled={true} />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <Label className="general-label">
              <FormattedMessage id="notification-recipients" />
            </Label>
            <Table columns={columns} pagination={null} data={selectRoofVendor ? contacts : []} />
          </Col>
        </Row>
        <Row>
          <div className="divider-dashed mb-2" />
        </Row>
        <Row>
          <Col className="mb-3" md={3} xs={12} lg={4}>
            <Label className="general-label">
              <FormattedMessage id="roof-rental-contract-type" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Controller
              as={Select}
              control={control}
              isDisabled={isReadOnly}
              theme={selectThemeColors}
              name="contractType"
              options={valueSetting}
              id="contractType"
              autoComplete="on"
              innerRef={register()}
              className="react-select"
              classNamePrefix="select"
              valid={!!getValues('contractType')?.value}
              invalid={!!errors.contractType}
              formatOptionLabel={(option) => <> {option.label}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />}
              blurInputOnSelect
            />
            {!!errors?.contractType && (
              <FormFeedback className="d-block">{errors?.contractType?.value?.message}</FormFeedback>
            )}
          </Col>
        </Row>
        {isCyclicalContract && <MonthlyRent isReadOnly={isReadOnly} typeContract={typeContract} />}
        {typeContract?.value === 4 && <ContractByPercentage isReadOnly={isReadOnly} />}
        <Row>
          <Col className="d-flex justify-content-end align-items-center mb-2">
            <Button type="submit" color="primary" className={classNames('mr-1 px-3 ', submitClassname)}>
              {intl.formatMessage({ id: isReadOnly ? 'Update' : 'Save' })}
            </Button>{' '}
            <Button color="secondary" onClick={handleCancelForm}>
              {intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
            </Button>{' '}
          </Col>
        </Row>
      </Form>
    </FormProvider>
  )
}

RoofVendorContractCUForm.propTypes = {
  intl: object.isRequired,
  onSubmit: func,
  onCancel: func,
  initValues: object,
  submitText: string,
  isReadOnly: bool,
  submitClassname: string
}

export default injectIntl(RoofVendorContractCUForm)
