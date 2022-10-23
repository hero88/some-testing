/// ** React Imports
import { useEffect } from 'react'
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
import { addMeter, editMeter } from './store/actions'
import { selectThemeColors } from '@utils'
import { METER_TYPE_MODEL_OPTIONS, METER_TYPE_OPTIONS, selectTypeModelLabel } from '@constants/project'
import { DISPLAY_DATE_FORMAT_CALENDAR, PLACEHOLDER } from '@constants/common'
import { useQuery } from '@hooks/useQuery'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import { DatePicker } from 'element-react/next'
import moment from 'moment'

const MeterDetail = ({ meterDetailModal, setMeterDetailModal, meterDetailTitle, currentMeter, isEditMeter, intl }) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      meter: { params: meterParams }
    } = useSelector((state) => state)
  const query = useQuery()
  const projectId = query.get('projectId')

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
    model: yup
      .string()
      .required(intl.formatMessage({ id: 'Model is required' }))
      .min(3, intl.formatMessage({ id: 'Model is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Model is invalid - max' }, { max: 256 })),
    manufacturer: yup
      .string()
      .required(intl.formatMessage({ id: 'Manufacturer is required' }))
      .min(3, intl.formatMessage({ id: 'Manufacturer is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Manufacturer is invalid - max' }, { max: 256 })),
    meterNetworkPlace: yup
      .object()
      .required(intl.formatMessage({ id: 'Meter type is required' }))
      .typeError(intl.formatMessage({ id: 'Meter type is required' })),
    measuringPointCode: yup
      .string()
      .required(intl.formatMessage({ id: 'MeasuringPointCode is required' }))
      .min(3, intl.formatMessage({ id: 'MeasuringPointCode is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'MeasuringPointCode is invalid - max' }, { max: 256 })),
    dateOfInstallation: yup
      .string()
      .typeError(intl.formatMessage({ id: 'Installed date is required' }))
      .required(intl.formatMessage({ id: 'Installed date is required' })),
    verificationTime: yup
      .string()
      .typeError(intl.formatMessage({ id: 'Inspection valid until is required is required' }))
      .required(intl.formatMessage({ id: 'Inspection valid until is required is required' }))
  })

  const { control, register, errors, clearErrors, handleSubmit, reset, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data) => {
    data.projectId = Number(projectId)
    data.verificationTime = data?.verificationTime ? moment(data.verificationTime).valueOf() : undefined
    data.dateOfInstallation = data?.dateOfInstallation ? moment(data.dateOfInstallation).valueOf() : undefined
    data.meterNetworkPlace = data.meterNetworkPlace.value
    data.typeModel = METER_TYPE_MODEL_OPTIONS[0].value

    if (isEditMeter) {
      await dispatch(
        editMeter(
          {
            id: currentMeter.id,
            ...data
          },
          meterParams
        )
      )
    } else {
      await dispatch(
        addMeter(
          {
            ...data
          },
          meterParams
        )
      )
    }

    dispatch(getProjectById({ id: projectId, fk: JSON.stringify(['users', 'devices']) }))

    setMeterDetailModal(false)
    reset({})
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
    setMeterDetailModal(false)
  }

  useEffect(() => {
    if (isEditMeter) {
      reset({
        ...currentMeter,
        typeModel:
          currentMeter && currentMeter.typeModel
            ? { label: selectTypeModelLabel(currentMeter.typeModel), value: currentMeter.typeModel }
            : null,
        verificationTime: currentMeter?.verificationTime
          ? new Date(Number(currentMeter?.verificationTime))
          : null,
        dateOfInstallation: currentMeter?.dateOfInstallation
          ? new Date(Number(currentMeter?.dateOfInstallation))
          : null,
        meterNetworkPlace: currentMeter?.meterNetworkPlace
          ? {
            label: currentMeter.meterNetworkPlace,
            value: currentMeter.meterNetworkPlace
          }
          : null
      })
    } else {
      reset({
        verificationTime: null,
        dateOfInstallation: null
      })
    }
  }, [currentMeter, meterDetailModal])

  return (
    <>
      <Modal isOpen={meterDetailModal} className='modal-dialog-centered' backdrop='static'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={meterDetailTitle} />
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
              <Label for='measuringPointCode'>
                <FormattedMessage id='Measurement point code' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='measuringPointCode'
                name='measuringPointCode'
                innerRef={register({ required: true })}
                invalid={!!errors.measuringPointCode}
                valid={getValues('measuringPointCode') !== '' && getValues('measuringPointCode') !== undefined && !errors.measuringPointCode}
                placeholder={PLACEHOLDER.MEASUREMENT_POINT_CODE}
              />
              {errors && errors.measuringPointCode && <FormFeedback>{errors.measuringPointCode.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='serialNumber'>
                <FormattedMessage id='Meter S/N' />
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
            <FormGroup>
              <Label for='model'>
                <FormattedMessage id='Model' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='model'
                name='model'
                innerRef={register({ required: true })}
                invalid={!!errors.model}
                valid={getValues('model') !== '' && getValues('model') !== undefined && !errors.model}
                placeholder={PLACEHOLDER.DEVICE_MODEL}
              />
              {errors && errors.model && <FormFeedback>{errors.model.message}</FormFeedback>}
            </FormGroup>
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
            <FormGroup>
              <Label for='dateOfInstallation'>
                <FormattedMessage id='Installed date' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={DatePicker}
                control={control}
                id='dateOfInstallation'
                name='dateOfInstallation'
                className='form-control'
                firstDayOfWeek={1}
                format={DISPLAY_DATE_FORMAT_CALENDAR}
                placeholder={intl.formatMessage({ id: 'Select installed date' })}
              />
              {
                errors && errors.dateOfInstallation &&
                <div className='text-danger font-small-3'>{errors.dateOfInstallation.message}</div>
              }
            </FormGroup>
            <FormGroup>
              <Label for='verificationTime'>
                <FormattedMessage id='Inspection valid until' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={DatePicker}
                control={control}
                id='verificationTime'
                name='verificationTime'
                className='form-control'
                firstDayOfWeek={1}
                format={DISPLAY_DATE_FORMAT_CALENDAR}
                placeholder={intl.formatMessage({ id: 'Select inspection valid until' })}
              />
              {
                errors && errors.verificationTime &&
                <div className='text-danger font-small-3'>{errors.verificationTime.message}</div>
              }
            </FormGroup>
            <FormGroup>
              <Label for='manufacturer'>
                <FormattedMessage id='Manufacturer' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='manufacturer'
                name='manufacturer'
                innerRef={register({ required: true })}
                invalid={!!errors.manufacturer}
                valid={
                  getValues('manufacturer') !== '' && getValues('manufacturer') !== undefined && !errors.manufacturer
                }
                placeholder={PLACEHOLDER.MANUFACTURER}
              />
              {errors && errors.manufacturer && <FormFeedback>{errors.manufacturer.message}</FormFeedback>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>
              <FormattedMessage id={isEditMeter ? 'Update' : 'Add'} />
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

MeterDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  meterDetailModal: PropTypes.bool.isRequired,
  setMeterDetailModal: PropTypes.func.isRequired,
  meterDetailTitle: PropTypes.string.isRequired,
  currentMeter: PropTypes.object,
  isEditMeter: PropTypes.bool.isRequired
}

export default injectIntl(MeterDetail)
