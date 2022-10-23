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
import { addInverter, editInverter } from './store/actions'
import { selectThemeColors } from '@utils'
import { PLACEHOLDER } from '@constants/common'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import { useQuery } from '@hooks/useQuery'
import { TYPE_MODEL } from '@constants/project'

const InverterDetail = ({
  inverterDetailModal,
  setInverterDetailModal,
  inverterDetailTitle,
  currentInverter,
  isEditInverter,
  intl
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      inverter: { params: inverterParams, types: inverterTypes }
    } = useSelector(state => state)
  const query = useQuery()
  const projectId = query.get('projectId')
  const [inverterTypeOptions, setInverterTypeOptions] = useState([])

  const SignupSchema = yup.object().shape({
    name: yup.string()
      .required(intl.formatMessage({ id: 'Device name is required' }))
      .min(3, intl.formatMessage({ id: 'Device name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Device name is invalid - max' }, { max: 256 })),
    serialNumber: yup.string()
      .required(intl.formatMessage({ id: 'Serial number is required' }))
      .min(3, intl.formatMessage({ id: 'Serial number is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Serial number is invalid - max' }, { max: 256 })),
    inverterType: yup.mixed()
      .required(intl.formatMessage({ id: 'Model type is required' }))
      .oneOf(inverterTypeOptions, intl.formatMessage({ id: 'Model type is required' }))
  })

  const { control, register, errors, clearErrors, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data) => {
    data.inverterTypeId = data?.typeModel?.value
    data.projectId = Number(projectId)

    if (data?.inverterType?.value) {
      data.inverterTypeId = data.inverterType.value
      data.typeModel = data.inverterType.label.includes('SMA') ? TYPE_MODEL.SMA : TYPE_MODEL.SUNGROW
    }

    if (isEditInverter) {
      await dispatch(
        editInverter(
          {
            id: currentInverter.id,
            ...data
          },
          inverterParams
        )
      )
    } else {
      await dispatch(
        addInverter({
          ...data
        }, inverterParams)
      )
    }

    dispatch(getProjectById({ id: projectId, fk: JSON.stringify(['users', 'devices']) }))

    setInverterDetailModal(false)
    reset({})
  }

  const handleCancel = () => {
    clearErrors()
    reset({}, {
      keepErrors: true,
      keepDirty: true,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false
    })
    setInverterDetailModal(false)
  }

  useEffect(() => {
    if (isEditInverter) {
      reset({
        ...currentInverter,
        inverterType: inverterTypeOptions.find(type => type.value === currentInverter?.inverterTypeId)
      })
    }
  }, [currentInverter, inverterDetailModal])

  // Set inverter types
  useEffect(() => {
    if (inverterTypes.length) {
      setInverterTypeOptions(
        inverterTypes.map((type) => (
          {
            label: `${type.manufacturer} - ${type.inverterModel} - ${type.power / 1000} kW`,
            value: type.id
          }
        ))
      )
    }
  }, [inverterTypes])

  return (
    <>
      <Modal
        isOpen={inverterDetailModal}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={inverterDetailTitle} />
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
                placeholder={PLACEHOLDER.DEVICE_NAME}
              />
              {errors && errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='serialNumber'>
                <FormattedMessage id='Inverter S/N' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='serialNumber'
                name='serialNumber'
                innerRef={register({ required: true })}
                invalid={!!errors.serialNumber}
                placeholder={PLACEHOLDER.DEVICE_SN}
              />
              {errors && errors.serialNumber && <FormFeedback>{errors.serialNumber.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='inverterType'>
                <FormattedMessage id='Type' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable
                theme={selectThemeColors}
                defaultValue={null}
                name='inverterType'
                id='inverterType'
                options={inverterTypeOptions}
                className='react-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select type' })}
              />
              {
                errors && errors.inverterType &&
                <div className='text-danger font-small-3'>{errors.inverterType.message}</div>
              }
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>
              <FormattedMessage id={isEditInverter ? 'Update' : 'Add'} />
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

InverterDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  inverterDetailModal: PropTypes.bool.isRequired,
  setInverterDetailModal: PropTypes.func.isRequired,
  inverterDetailTitle: PropTypes.string.isRequired,
  currentInverter: PropTypes.object,
  isEditInverter: PropTypes.bool.isRequired
}

export default injectIntl(InverterDetail)
