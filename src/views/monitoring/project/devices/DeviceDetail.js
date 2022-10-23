/// ** React Imports
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import PropTypes from 'prop-types'

// ** Custom Components
import { addDevice, editDevice } from './store/actions'
import { selectThemeColors } from '@utils'
import {
  DEVICE_STATUS,
  DEVICE_TYPE,
  DEVICE_TYPE_OPTIONS,
  METER_TYPE_MODEL_OPTIONS,
  METER_TYPE_OPTIONS,
  TYPE_MODEL
} from '@constants/project'
import { useQuery } from '@hooks/useQuery'
import { PLACEHOLDER, STATE } from '@constants/common'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'

const DeviceDetail = ({
  active,
  setActive,
  isShowDeviceModal,
  setIsShowDeviceModal,
  deviceDetailTitle,
  currentDevice,
  isEditDevice,
  intl
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      device: { params: deviceParams },
      inverter: { data: inverterData, params: inverterParams, types: inverterTypes },
      meter: { params: meterParams },
      panel: { params: panelParams, types: panelTypes }
    } = useSelector((state) => state),
    query = useQuery()

  // ** State
  const [deviceType, setDeviceType] = useState(active),
    [inverterOptions, setInverterOptions] = useState([]),
    [inverterTypeOptions, setInverterTypeOptions] = useState([]),
    [panelTypeOptions, setPanelTypeOptions] = useState([])

  useEffect(() => {
    if (inverterData.length) {
      setInverterOptions(
        inverterData.map((customer) => ({
          label: customer.name,
          value: customer.id
        }))
      )
    }
  }, [inverterData])

  // Set inverter types
  useEffect(() => {
    if (inverterTypes.length) {
      setInverterTypeOptions(
        inverterTypes.map((type) => ({
          label: `${type.manufacturer} - ${type.inverterModel}`,
          value: type.id
        }))
      )
    }
  }, [inverterTypes])

  // Set panel types
  useEffect(() => {
    if (panelTypes.length) {
      setPanelTypeOptions(
        panelTypes.map((type) => ({
          label: `${type.panelModel} - ${type.ppv}`,
          value: type.id
        }))
      )
    }
  }, [panelTypes])

  const SignupSchema = yup.object().shape({
    name: yup
      .string()
      .required(intl.formatMessage({ id: 'Device name is required' }))
      .min(3, intl.formatMessage({ id: 'Device name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Device name is invalid - max' }, { max: 256 })),
    serialNumber: yup
      .string()
      .required(intl.formatMessage({ id: 'Serial number is required' }))
      .min(3, intl.formatMessage({ id: 'Serial number is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Serial number is invalid - max' }, { max: 256 })),
    typeDevice: yup
      .mixed()
      .required(intl.formatMessage({ id: 'Device type is required' }))
      .oneOf(DEVICE_TYPE_OPTIONS, intl.formatMessage({ id: 'Device type is required' })),
    typeModel: yup
      .mixed()
      .when('typeDevice', {
        is: (option) => {
          const isInverter = option && option.value === DEVICE_TYPE.INVERTER
          setDeviceType(option?.value || DEVICE_TYPE.INVERTER)
          setActive(option?.value || DEVICE_TYPE.INVERTER)

          // Only validate array when device type === PANEL
          return isInverter
        },
        then: yup
          .mixed()
          .required(intl.formatMessage({ id: 'Model type is required' }))
          .oneOf(
            deviceType === DEVICE_TYPE.INVERTER ? inverterTypeOptions : panelTypeOptions,
            intl.formatMessage({ id: 'Model type is required' })
          ),
        otherwise: yup.mixed()
      }),
    array: yup.number().when('typeDevice', {
      is: (option) => {
        const isPanel = option && option.value === DEVICE_TYPE.PANEL

        setDeviceType(option?.value || DEVICE_TYPE.METER)
        setActive(option?.value || DEVICE_TYPE.METER)

        // Only validate array when device type === PANEL
        return isPanel
      },
      then: yup
        .number()
        .required(intl.formatMessage({ id: 'Array is required' }))
        .typeError(intl.formatMessage({ id: 'Array must be a number' }))
        .min(1, intl.formatMessage({ id: 'Array is invalid - min' }, { min: 1 }))
        .max(24, intl.formatMessage({ id: 'Array is invalid - max' }, { max: 24 })),
      otherwise: yup.number()
    })
  })

  const { control, register, errors, clearErrors, handleSubmit, reset, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data, isContinue) => {
    data.projectId = query.get('projectId')
    data.verificationTime = data?.verificationTime ? moment(data.verificationTime[0]).valueOf() : undefined

    if (deviceType === DEVICE_TYPE.METER && data.meterNetworkPlace) {
      data.meterNetworkPlace = data.meterNetworkPlace.value
    } else {
      delete data.meterNetworkPlace
    }

    data.typeDevice = data?.typeDevice?.value
    data.withInverter = deviceType === DEVICE_TYPE.PANEL ? data.inverter?.value : undefined
    data.inverterTypeId = deviceType === DEVICE_TYPE.INVERTER ? data?.typeModel?.value : undefined
    data.panelTypeId = deviceType === DEVICE_TYPE.PANEL ? data?.typeModel?.value : undefined

    if (deviceType === DEVICE_TYPE.METER) {
      data.typeModel = METER_TYPE_MODEL_OPTIONS[0].value
    } else {
      data.typeModel = TYPE_MODEL.SUNGROW
    }

    const params = deviceType === DEVICE_TYPE.INVERTER
                   ? inverterParams
                   : deviceType === DEVICE_TYPE.METER
                     ? meterParams
                     : deviceType === DEVICE_TYPE.PANEL
                       ? panelParams
                       : deviceParams

    if (isEditDevice) {
      await dispatch(
        editDevice(
          {
            id: currentDevice.id,
            ...data
          },
          params
        )
      )
    } else {
      await dispatch(
        addDevice(
          {
            ...data,
            status: DEVICE_STATUS.ACTIVE,
            state: STATE.ACTIVE
          },
          params
        )
      )
    }

    dispatch(getProjectById({ id: data.projectId, fk: JSON.stringify(['users', 'devices']) }))

    if (!isContinue) {
      setIsShowDeviceModal(false)
      reset({})
    } else {
      reset({
        typeDevice: data.typeDevice,
        typeModel: data.typeModel,
        inverter: data.inverter
      })
    }
  }

  const handleCancel = () => {
    clearErrors()
    reset(
      {},
      {
        keepErrors: true,
        keepDirty: true,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false
      }
    )
    setIsShowDeviceModal(false)
  }

  useEffect(() => {
    if (isEditDevice) {
      reset({
        ...currentDevice
      })
    } else {
      reset({})
    }
  }, [currentDevice])

  return (
    <>
      <Modal isOpen={isShowDeviceModal} className='modal-dialog-centered' backdrop='static'>
        <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={deviceDetailTitle} />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='name'>
                <FormattedMessage id='Device name' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='name'
                name='name'
                innerRef={register({ required: true })}
                invalid={!!errors.name}
                valid={getValues('name') !== '' && getValues('name') !== undefined && !errors.name}
                placeholder={PLACEHOLDER.DEVICE_NAME}
              />
              {errors && errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='serialNumber'>
                <FormattedMessage id='Device S/N' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='serialNumber'
                name='serialNumber'
                innerRef={register({ required: true })}
                invalid={!!errors.serialNumber}
                valid={
                  getValues('serialNumber') !== '' && getValues('serialNumber') !== undefined && !errors.serialNumber
                }
                placeholder={PLACEHOLDER.DEVICE_SN}
              />
              {errors && errors.serialNumber && <FormFeedback>{errors.serialNumber.message}</FormFeedback>}
            </FormGroup>
            {
              <FormGroup>
                <Label for='typeDevice'>
                  <FormattedMessage id='Device type' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isClearable
                  theme={selectThemeColors}
                  defaultValue={
                    currentDevice && currentDevice.typeDevice
                    ? currentDevice.typeDevice
                    : active === DEVICE_TYPE.INVERTER
                      ? DEVICE_TYPE_OPTIONS[1]
                      : DEVICE_TYPE_OPTIONS[0]
                  }
                  name='typeDevice'
                  id='typeDevice'
                  options={DEVICE_TYPE_OPTIONS}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder={intl.formatMessage({ id: 'Select type' })}
                  formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                />
                {errors && errors.typeDevice && (
                  <div className='text-danger font-small-3'>{errors.typeDevice.message}</div>
                )}
              </FormGroup>
            }
            {
              deviceType !== DEVICE_TYPE.METER &&
              <FormGroup>
                <Label for='typeModel'>
                  <FormattedMessage id='Type' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isClearable
                  theme={selectThemeColors}
                  defaultValue={null}
                  name='typeModel'
                  id='typeModel'
                  options={
                    active === DEVICE_TYPE.INVERTER
                    ? inverterTypeOptions
                    : panelTypeOptions
                  }
                  className='react-select'
                  classNamePrefix='select'
                  placeholder={intl.formatMessage({ id: 'Select type' })}
                />
                {errors && errors.typeModel && (
                  <div className='text-danger font-small-3'>{errors.typeModel.message}</div>
                )}
              </FormGroup>
            }
            {deviceType === DEVICE_TYPE.METER && (
              <FormGroup>
                <Label for='meterNetworkPlace'>
                  <FormattedMessage id='Meter type' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isClearable
                  theme={selectThemeColors}
                  name='meterNetworkPlace'
                  id='meterNetworkPlace'
                  defaultValue={METER_TYPE_OPTIONS[0]}
                  options={METER_TYPE_OPTIONS}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder={intl.formatMessage({ id: 'Select meter type' })}
                  formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                />
                {errors && errors.meterNetworkPlace && (
                  <div className='text-danger font-small-3'>{errors.meterNetworkPlace.message}</div>
                )}
              </FormGroup>
            )}
            {deviceType === DEVICE_TYPE.PANEL && (
              <FormGroup>
                <Label for='inverter'>
                  <FormattedMessage id='Inverter' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  isClearable={true}
                  theme={selectThemeColors}
                  defaultValue={null}
                  name='inverter'
                  id='inverter'
                  options={inverterOptions}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder={intl.formatMessage({ id: 'Select an inverter' })}
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label for='verificationTime'>
                <FormattedMessage id='Inspection valid until' />
              </Label>
              <Controller
                as={Flatpickr}
                control={control}
                defaultValue={new Date()}
                id='verificationTime'
                name='verificationTime'
                className='form-control'
                options={{
                  dateFormat: 'd/m/Y'
                }}
              />
              {errors && errors.verificationTime && <FormFeedback>{errors.verificationTime.message}</FormFeedback>}
            </FormGroup>
            {deviceType === DEVICE_TYPE.PANEL && (
              <FormGroup>
                <Label for='array'>
                  <FormattedMessage id='Array - Only for Panel' />
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
                <Input
                  type='number'
                  min={1}
                  max={24}
                  step={1}
                  id='array'
                  name='array'
                  innerRef={register()}
                  invalid={!!errors.array}
                  valid={getValues('array') !== '' && getValues('array') !== undefined && !errors.array}
                  disabled={deviceType !== DEVICE_TYPE.PANEL}
                  placeholder={PLACEHOLDER.PANEL_ARRAY}
                />
                {errors && errors.array && <FormFeedback>{errors.array.message}</FormFeedback>}
              </FormGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>
              <FormattedMessage id={isEditDevice ? 'Update' : 'Add'} />
            </Button>
            <Button color='primary' onClick={handleSubmit((data) => onSubmit(data, true))}>
              <FormattedMessage id={'Create and add another'} />
            </Button>
            <Button color='secondary' onClick={handleCancel}>
              <FormattedMessage id='Cancel' />
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}

DeviceDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowDeviceModal: PropTypes.bool.isRequired,
  setIsShowDeviceModal: PropTypes.func.isRequired,
  deviceDetailTitle: PropTypes.string.isRequired,
  currentDevice: PropTypes.object,
  isEditDevice: PropTypes.bool.isRequired,
  active: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired
}

export default injectIntl(DeviceDetail)
