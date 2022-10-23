// ** Third party components
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row
} from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import PropTypes from 'prop-types'
import { WithContext as ReactTags } from 'react-tag-input'

// ** Custom components
import {
  DEVICE_TYPE,
  PROJECT_BUSINESS_MODEL_OPTIONS,
  renderProjectStatusText
} from '@constants/project'
import { PLACEHOLDER, STATE as STATUS } from '@constants/common'
import { numberWithCommas, selectThemeColors } from '@utils'
import GetLocationModal from '@src/views/settings/projects/GetLocationModal'
import { ELECTRICITY_REGEX, EMAIL_REGEX, PROJECT_CODE, VN_PHONE_REGEX } from '@constants/regex'
import { getProvinceOptions } from '@constants/province'
import {
  editProject,
  getIndustrialAreas,
  getInvestors
} from '@src/views/monitoring/projects/store/actions'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { useQuery } from '@hooks/useQuery'
import { getDevices } from '@src/views/monitoring/project/devices/store/actions'

const KeyCodes = {
  comma: 188,
  enter: [10, 13]
}

const delimiters = [...KeyCodes.enter, KeyCodes.comma]

const ProjectGeneral = ({ intl }) => {
  const query = useQuery()
  const projectId = query.get('projectId')
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      auth: { userData },
      customerProject: { params, selectedProject, industrialAreas, investors },
      device: { devices }
    } = useSelector((state) => state),
    [openLocationMap, setOpenLocationMap] = useState({ isOpen: false, isECoordinate: false }),
    [projectLocation, setProjectLocation] = useState(null),
    [electricityLocation, setElectricityLocation] = useState(null),
    [industrialAreaOptions, setIndustrialAreaOptions] = useState([]),
    [investorOptions, setInvestorOptions] = useState([]),
    [provinceOptions, setProvinceOptions] = useState([]),
    [tags, setTags] = useState([]),
    [isManagerEmailInvalid, setIsManagerEmailInvalid] = useState(false),
    [acPower, setACPower] = useState(0),
    [dcPower, setDCPower] = useState(0)

  // ** Init schema
  const initSchema = {
    name: yup
      .string()
      .required(intl.formatMessage({ id: 'Project name is required' }))
      .min(3, intl.formatMessage({ id: 'Project name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Project name is invalid - max' }, { max: 256 })),
    code: yup
      .string()
      .required(intl.formatMessage({ id: 'Project code is required' }))
      .min(4, intl.formatMessage({ id: 'Project code is invalid - min' }, { min: 4 }))
      .max(256, intl.formatMessage({ id: 'Project code is invalid - max' }, { max: 256 }))
      .matches(PROJECT_CODE, intl.formatMessage({ id: 'Must be uppercase' })),
    electricityCode: yup
      .string()
      .required(intl.formatMessage({ id: 'Electricity code is required' }))
      .matches(ELECTRICITY_REGEX, intl.formatMessage({ id: 'Electricity code is invalid' })),
    phone: yup.string().matches(VN_PHONE_REGEX, intl.formatMessage({ id: 'Phone number is invalid' })),
    startDate: yup.mixed()
      .required(intl.formatMessage({ id: 'Start date is required' }))
      .typeError(intl.formatMessage({ id: 'Start date is invalid' })),
    investor: yup.object()
      .required(intl.formatMessage({ id: 'Investor is required' }))
      .typeError(intl.formatMessage({ id: 'Investor is invalid' }))
      .oneOf(investorOptions, intl.formatMessage({ id: 'Investor is invalid' })),
    province: yup.object()
      .required(intl.formatMessage({ id: 'Province is required' }))
      .typeError(intl.formatMessage({ id: 'Province is invalid' }))
      .oneOf(provinceOptions, intl.formatMessage({ id: 'Province is invalid' })),
    industrialArea: yup.object()
      .required(intl.formatMessage({ id: 'Industrial area is required' }))
      .typeError(intl.formatMessage({ id: 'Industrial area is invalid' }))
      .oneOf(industrialAreaOptions, intl.formatMessage({ id: 'Industrial area is invalid' })),
    type: yup.object()
      .required(intl.formatMessage({ id: 'Business model is required' }))
      .typeError(intl.formatMessage({ id: 'Business model is invalid' }))
      .oneOf(PROJECT_BUSINESS_MODEL_OPTIONS, intl.formatMessage({ id: 'Business model is invalid' }))
  }

  const [dynamicSchema, setDynamicSchema] = useState(initSchema)
  const SignupSchema = yup.object().shape(dynamicSchema, ['investor'])

  const { control, register, errors, handleSubmit, reset, setValue, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data, isAddDevice = false) => {
    const cleanData = { ...data }

    if (cleanData.eName) {
      cleanData.electricityId = cleanData.eName.value
      cleanData.electricityName = cleanData.eName.label

      // Change customerId and customerName of EVN's contacts when change selected Electricity name 
      const initContacts = selectedProject?.contacts
      const tempContacts = []
      if (initContacts?.length > 0) {
        initContacts?.forEach(({ type, customerId, customerName, fullName, position, phone, email }) => {
          tempContacts.push({
            type,
            customerId: type === 'ENV' && customerName !== cleanData.eName.label ? cleanData.eName.value : customerId,
            customerName: type === 'ENV' && customerName !== cleanData.eName.label
              ? cleanData.eName.label
              : customerName,
            fullName,
            position,
            phone,
            email
          })
        })
      }
      cleanData.contacts = [...tempContacts]
    } else {
      cleanData.electricityId = 0
      cleanData.electricityName = ''
    }

    // Remove EVN contact when un-select electricity name
    if (cleanData.eName === null) {
      const initContacts = selectedProject?.contacts
      if (initContacts?.length > 0) {
        const tempContacts = initContacts.filter(contact => contact.type !== 'ENV')
        cleanData.contacts = [...tempContacts]
      }
    }

    if (cleanData.province) {
      cleanData.provinceName = cleanData.province.label
      cleanData.provinceCode = cleanData.province.value
    } else {
      cleanData.provinceName = ''
      cleanData.provinceCode = 0
    }

    if (cleanData.industrialArea) {
      cleanData.industrialAreaId = cleanData.industrialArea.value
      cleanData.industrialAreaName = cleanData.industrialArea.label
    } else {
      cleanData.industrialAreaId = 0
      cleanData.industrialAreaName = ''
    }

    if (cleanData.investor) {
      cleanData.investorId = cleanData.investor.value
      cleanData.investorName = cleanData.investor.label
    } else {
      cleanData.investorId = 0
      cleanData.investorName = ''
    }

    if (cleanData.firstDayOfTerm) {
      cleanData.firstDayOfTerm = moment(cleanData.firstDayOfTerm[0]).format('YYYY-MM-DD HH:mm:ss')
    } else {
      cleanData.firstDayOfTerm = 0
    }

    if (cleanData.lastDayOfTerm) {
      cleanData.lastDayOfTerm = moment(cleanData.lastDayOfTerm[0]).format('YYYY-MM-DD HH:mm:ss')
    } else {
      cleanData.lastDayOfTerm = 0
    }

    cleanData.startDate = cleanData?.startDate ? moment(cleanData.startDate[0]).valueOf() : undefined
    delete cleanData.province
    delete cleanData.coordinate
    delete cleanData.eCoordinate
    delete cleanData.eName
    delete cleanData.industrialArea
    delete cleanData.investor

    await dispatch(
      editProject(
        {
          ...cleanData,
          id: selectedProject.id,
          userId: userData.id,
          type: cleanData?.type?.value,
          wattageAC: Number(acPower),
          wattageDC: Number(dcPower),
          substationPower: Number(cleanData?.substationPower) * 1000,
          eStation2: Number(cleanData?.eStation2) * 1000,
          emailsManager: tags.map(item => item.id)
        },
        params,
        isAddDevice
      )
    )
  }

  const initForm = () => {
    // Set values for manager emails
    if (selectedProject?.emailsManager?.length) {
      const tempData = []
      selectedProject.emailsManager.forEach(email => {
        tempData.push({ id: email, text: email })
      })

      setTags(tempData)
    }

    reset({
      ...selectedProject,
      name: selectedProject?.name ? selectedProject.name : '',
      phone: selectedProject?.phone ? selectedProject.phone : '',
      eName: selectedProject?.electricity?.name && selectedProject?.electricity?.id
        ? { label: selectedProject?.electricity?.name, value: selectedProject?.electricity?.id }
        : null,
      firstDayOfTerm: selectedProject?.firstDayOfTerm ? [new Date((selectedProject?.firstDayOfTerm))] : null,
      lastDayOfTerm: selectedProject?.lastDayOfTerm ? [new Date((selectedProject?.lastDayOfTerm))] : null,
      substationPower: selectedProject?.substationPower / 1000,
      eStation2: selectedProject?.eStation2 / 1000,
      investor: selectedProject?.investor?.id
        ? investorOptions.find(option => option.value === selectedProject.investor.id)
        : null,
      type: selectedProject?.type
        ? PROJECT_BUSINESS_MODEL_OPTIONS.find((option) => option.value === selectedProject.type)
        : null,
      province:
        selectedProject?.provinceCode && selectedProject?.provinceName
          ? provinceOptions.find(option => option.value === selectedProject.provinceCode)
          : null,
      startDate: selectedProject?.startDate ? [new Date(Number(selectedProject?.startDate))] : [new Date()],
      industrialArea: selectedProject?.industrial?.id
        ? industrialAreaOptions.find(option => option.value === selectedProject.industrial.id)
        : null
    })
  }

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    if (EMAIL_REGEX.test(tag.text)) {
      setTags(currentState => [...currentState, tag])
      setIsManagerEmailInvalid(false)
    } else {
      setIsManagerEmailInvalid(true)
    }
  }

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    setTags(newTags)
  }

  const renderDeviceInfo = ({ devices, type }) => {
    return devices?.length > 0
      ? devices.map((device, index) => {
        return (
          <Row key={index}>
            <Col md={3}>
              <Label>
                <FormattedMessage id={type === 'panelType' ? 'Number of PV' : 'Number of inverter'}/>
              </Label>
              <Input
                value={device.count}
                readOnly
              />
            </Col>
            <Col md={3}>
              <Label>
                <FormattedMessage id={type === 'panelType' ? 'PV power' : 'Inverter power'}/> {type === 'panelType'
                ? '(Wp)'
                : '(kW)'}
              </Label>
              <Input
                value={numberWithCommas(device.ppv || device.power / 1000 || 0, 0)}
                readOnly
              />
            </Col>
            <Col md={3}>
              <Label>
                <FormattedMessage id='Manufacturer'/>
              </Label>
              <Input
                value={device.manufacturer || intl.formatMessage({ id: 'Others' })}
                readOnly
              />
            </Col>
            <Col md={3}>
              <Label>
                <FormattedMessage id={type === 'panelType' ? 'PV type' : 'Inverter type'}/>
              </Label>
              <Input
                value={type === 'panelType'
                  ? device.panelModel
                  : device.inverterModel || intl.formatMessage({ id: 'Others' })}
                readOnly
              />
            </Col>
          </Row>
        )
      })
      : null
  }

  const groupDevices = ({ devices, key, valueKey }) => {
    const result = {}

    if (devices?.length) {
      devices.forEach(device => {
        if (!result[device[key]]) {
          result[device[key]] = {
            ...device[valueKey],
            count: 1
          }
        } else {
          result[device[key]].count += 1
        }
      })
    }

    return renderDeviceInfo({ devices: Object.values(result), type: valueKey })
  }

  // Set industrial area options
  useEffect(() => {
    if (industrialAreas?.length) {
      setIndustrialAreaOptions(
        industrialAreas.map((area) => (
          {
            label: area.name,
            value: area.id
          }
        ))
      )
    }
  }, [industrialAreas])

  // Set investor options
  useEffect(() => {
    if (investors?.length) {
      setInvestorOptions(
        investors.map((investor) => (
          {
            label: investor.name,
            value: investor.id
          }
        ))
      )
    }
  }, [investors])

  useEffect(() => {
    // Reset dynamic schema
    setDynamicSchema(initSchema)
  }, [industrialAreaOptions, investorOptions])

  useEffect(() => {
    Promise.all([
      dispatch(
        getIndustrialAreas({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      ),
      dispatch(
        getInvestors({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      ),
      dispatch(
        getDevices({
          state: [STATUS.ACTIVE].toString(),
          projectId,
          fk: '*',
          rowsPerPage: -1
        })
      )
    ])
    setProvinceOptions(getProvinceOptions())
  }, [])

  useEffect(() => {
    if (projectLocation && projectLocation.lat && projectLocation.lng) {
      setValue('coordinate', `${projectLocation.lat}, ${projectLocation.lng}`)
    } else {
      setValue('coordinate', '')
    }
  }, [projectLocation])

  useEffect(() => {
    if (electricityLocation && electricityLocation.lat && electricityLocation.lng) {
      setValue('eCoordinate', `${electricityLocation.lat}, ${electricityLocation.lng}`)
    } else {
      setValue('eCoordinate', '')
    }
  }, [electricityLocation])

  useEffect(() => {
    // Reset dynamic schema
    setDynamicSchema(initSchema)
    initForm()
  }, [selectedProject])

  useEffect(() => {
    if (devices.length > 0) {
      let tempACPower = 0,
        tempDCPower = 0

      devices.forEach(device => {
        if (device.typeDevice === DEVICE_TYPE.INVERTER) {
          tempACPower += device?.inverterType?.power || 0
        }

        if (device.typeDevice === DEVICE_TYPE.PANEL) {
          tempDCPower += device?.panelType?.ppv || 0
        }
      })

      setValue('wattageAC', numberWithCommas(tempACPower / 1000, 1))
      setValue('wattageDC', numberWithCommas(tempDCPower / 1000, 1))
      setACPower(tempACPower)
      setDCPower(tempDCPower)
    }
  }, [devices])

  return (
    <>
      <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for='name'>
                <FormattedMessage id='Project name'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='name'
                name='name'
                defaultValue=''
                innerRef={register({ required: true })}
                invalid={!!errors.name}
                placeholder={PLACEHOLDER.PROJECT_NAME}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='type'>
                <FormattedMessage id='Business model'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Select}
                control={control}
                theme={selectThemeColors}
                defaultValue={selectedProject?.type ? selectedProject.type : null}
                name='type'
                id='type'
                options={PROJECT_BUSINESS_MODEL_OPTIONS}
                className='react-select--project line-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select business model' })}
                formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.type && <div className='text-danger font-small-3'>{errors.type.message}</div>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='code'>
                <FormattedMessage id='Project code'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <InputGroup>
                <Input
                  id='code'
                  name='code'
                  defaultValue=''
                  innerRef={register({ required: true })}
                  invalid={!!errors.code}
                  placeholder={PLACEHOLDER.PROJECT_CODE}
                  readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                />
                <InputGroupAddon addonType='append'>
                  {
                    `# ${watch('province')?.value ? watch('province')?.value : ''}${selectedProject?.partner?.code
                      ? `-${selectedProject?.partner?.code}` : ''}${watch('electricityCode') ? `-${watch(
                      'electricityCode')}` : ''}`
                  }
                </InputGroupAddon>
                {errors && errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='electricityCode'>
                <FormattedMessage id='Electricity code'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='electricityCode'
                name='electricityCode'
                defaultValue=''
                innerRef={register({ required: true })}
                invalid={!!errors.electricityCode}
                placeholder={PLACEHOLDER.PROJECT_CODE}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.electricityCode && <FormFeedback>{errors.electricityCode.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='startDate'>
                <FormattedMessage id='Date of commission'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Flatpickr}
                control={control}
                defaultValue={new Date()}
                id='startDate'
                name='startDate'
                className='form-control'
                options={{
                  dateFormat: 'd/m/Y'
                }}
                disabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.startDate && <div className='text-danger font-small-3'>{errors.startDate.message}</div>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='investor'>
                <FormattedMessage id='Investor'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable
                theme={selectThemeColors}
                id='investor'
                name='investor'
                defaultValue={null}
                options={investorOptions}
                className='react-select--project line-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select investor' })}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.investor && <div className='text-danger font-small-3'>{errors.investor.message}</div>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='eName'>
                <FormattedMessage id='Electricity name'/>
              </Label>
              <Input
                id='eName'
                name='eName'
                defaultValue={selectedProject?.electricityCustomer?.fullName}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='status'>
                <FormattedMessage id='Status'/>
              </Label>
              {renderProjectStatusText(selectedProject?.status)}
            </FormGroup>
          </Col>
          {/*===================DIVIDER===================*/}
          <Col xl={12} className='mb-1'>
            <hr/>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='province'>
                <FormattedMessage id='Province'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable={true}
                theme={selectThemeColors}
                defaultValue={selectedProject?.locations?.length > 0 ? selectedProject.locations[0].province : null}
                name='province'
                id='province'
                options={provinceOptions}
                className='react-select--project line-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select a province' })}
                formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.province && <div className='text-danger font-small-3'>{errors.province.message}</div>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='managerEmails'>
                <FormattedMessage id='Manager emails'/>
              </Label>
              <ReactTags
                classNames={{
                  tags: 'manager-email',
                  tagInput: 'tagInputClass',
                  tagInputField: 'form-control mb-1',
                  selected: 'selectedClass',
                  tag: 'tagClass',
                  remove: 'btn btn-flat-danger p-50',
                  suggestions: 'suggestionsClass',
                  activeSuggestion: 'activeSuggestionClass'
                }}
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
                placeholder={PLACEHOLDER.EMAIL}
                inputFieldPosition='top'
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {
                isManagerEmailInvalid &&
                <div className='text-danger font-small-3 mt-1'>{intl.formatMessage({ id: 'Email is invalid' })}</div>
              }
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='industrialArea'>
                <FormattedMessage id='Industrial area'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable={true}
                theme={selectThemeColors}
                defaultValue={null}
                name='industrialArea'
                id='industrialArea'
                options={industrialAreaOptions}
                className='react-select--project line-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select a industrial area' })}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.industrialArea && <div className='text-danger font-small-3'>{errors.industrialArea.message}</div>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='connectedPoint'>
                <FormattedMessage id='Connected point'/>
              </Label>
              <Input
                id='connectedPoint'
                name='connectedPoint'
                defaultValue=''
                innerRef={register()}
                invalid={!!errors.connectedPoint}
                placeholder={PLACEHOLDER.CONNECTED_POINT}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.connectedPoint && <FormFeedback>{errors.connectedPoint.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='firstDayOfTerm'>
                <FormattedMessage id='First date of term'/>
              </Label>
              <Controller
                as={Flatpickr}
                control={control}
                defaultValue={new Date()}
                id='firstDayOfTerm'
                name='firstDayOfTerm'
                className='form-control'
                options={{
                  dateFormat: 'd/m/Y'
                }}
                disabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.firstDayOfTerm && <FormFeedback>{errors.firstDayOfTerm.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='lastDayOfTerm'>
                <FormattedMessage id='End date of term'/>
              </Label>
              <Controller
                as={Flatpickr}
                control={control}
                defaultValue={new Date()}
                id='lastDayOfTerm'
                name='lastDayOfTerm'
                className='form-control'
                options={{
                  dateFormat: 'd/m/Y'
                }}
                disabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.lastDayOfTerm && <FormFeedback>{errors.lastDayOfTerm.message}</FormFeedback>}
            </FormGroup>
          </Col>
          {/*===================DIVIDER===================*/}
          <Col xl={12} className='mb-1'>
            <hr/>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for='wattageDC'>
                <FormattedMessage id='Installed power DC'/> (kWp)
              </Label>
              <Input
                readOnly
                id='wattageDC'
                name='wattageDC'
                defaultValue={numberWithCommas(dcPower / 1000, 1)}
                placeholder={PLACEHOLDER.INSTALLED_POWER_DC}
              />
            </FormGroup>
          </Col>
          <Col md={9}>
            <FormGroup>
              {
                groupDevices({
                  devices: devices?.filter(device => device.typeDevice === DEVICE_TYPE.PANEL),
                  key: 'panelTypeId',
                  valueKey: 'panelType'
                })
              }
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for='wattageAC'>
                <FormattedMessage id='Installed power AC'/> (kW)
              </Label>
              <Input
                readOnly
                id='wattageAC'
                name='wattageAC'
                defaultValue={numberWithCommas(acPower / 1000, 1)}
                placeholder={PLACEHOLDER.INSTALLED_POWER_AC}
              />
            </FormGroup>
          </Col>
          <Col md={9}>
            <FormGroup>
              {
                groupDevices({
                  devices: devices?.filter(device => device.typeDevice === DEVICE_TYPE.INVERTER),
                  key: 'inverterTypeId',
                  valueKey: 'inverterType'
                })
              }
            </FormGroup>
          </Col>
          {/*===================DIVIDER===================*/}
          <Col xl={12} className='mb-1'>
            <hr/>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='substationBrand'>
                <FormattedMessage id='Transformer manufacturer'/> 1
              </Label>
              <Input
                id='substationBrand'
                name='substationBrand'
                defaultValue=''
                innerRef={register()}
                invalid={!!errors.substationBrand}
                placeholder={PLACEHOLDER.TRANSFORMER_MANUFACTURER}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.substationBrand && <FormFeedback>{errors.substationBrand.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='substationPower'>
                <FormattedMessage id='Transformer capacity'/> 1 (KVA)
              </Label>
              <Input
                type='number'
                min={0}
                id='substationPower'
                name='substationPower'
                defaultValue={0}
                innerRef={register()}
                invalid={!!errors.substationPower}
                placeholder={PLACEHOLDER.TRANSFORMER_CAPACITY}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.substationPower && <FormFeedback>{errors.substationPower.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}/>
          <Col md={4}>
            <FormGroup>
              <Label for='eStation1'>
                <FormattedMessage id='Transformer manufacturer'/> 2
              </Label>
              <Input
                id='eStation1'
                name='eStation1'
                defaultValue=''
                innerRef={register()}
                invalid={!!errors.eStation1}
                placeholder={PLACEHOLDER.TRANSFORMER_MANUFACTURER}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.eStation1 && <FormFeedback>{errors.eStation1.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='eStation2'>
                <FormattedMessage id='Transformer capacity'/> 2 (KVA)
              </Label>
              <Input
                type='number'
                min={0}
                id='eStation2'
                name='eStation2'
                defaultValue={0}
                innerRef={register()}
                invalid={!!errors.eStation2}
                placeholder={PLACEHOLDER.TRANSFORMER_CAPACITY}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.eStation2 && <FormFeedback>{errors.eStation2.message}</FormFeedback>}
            </FormGroup>
          </Col>
        </Row>
        {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
          <Row>
            <Col className='d-flex justify-content-end'>
              <Button className='mr-1' color='primary' type='submit'>
                <FormattedMessage id={'Update'}/>
              </Button>
              <Button color='secondary' onClick={initForm}>
                <FormattedMessage id='Cancel'/>
              </Button>
            </Col>
          </Row>
        )}
      </Form>
      {openLocationMap.isOpen && (
        <GetLocationModal
          isOpen={openLocationMap.isOpen}
          setIsOpen={setOpenLocationMap}
          projectLocation={openLocationMap.isECoordinate ? electricityLocation : projectLocation}
          setProjectLocation={openLocationMap.isECoordinate ? setElectricityLocation : setProjectLocation}
        />
      )}
    </>
  )
}

ProjectGeneral.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(ProjectGeneral)
