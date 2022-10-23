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
import { addPanel, editPanel } from './store/actions'
import { selectThemeColors } from '@utils'
import { useQuery } from '@hooks/useQuery'
import { PLACEHOLDER, STATE } from '@constants/common'
import { DEVICE_STATUS, DEVICE_TYPE, TYPE_MODEL } from '@constants/project'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'

const PanelDetail = ({
  panelDetailModal,
  setPanelDetailModal,
  panelDetailTitle,
  currentPanel,
  isEditPanel,
  intl
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      customerProject: { selectedProject },
      inverter: { selectedInverter },
      panel: { params: panelParams, types: panelTypes }
    } = useSelector(state => state)
  const query = useQuery()
  const projectId = query.get('projectId')

  const [inverterOptions, setInverterOptions] = useState([]),
    [panelTypeOptions, setPanelTypeOptions] = useState([])

  const SignupSchema = yup.object().shape({
    name: yup.string()
      .required(intl.formatMessage({ id: 'Device name is required' }))
      .min(3, intl.formatMessage({ id: 'Device name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Device name is invalid - max' }, { max: 256 })),
    serialNumber: yup.string()
      .required(intl.formatMessage({ id: 'Serial number is required' }))
      .min(3, intl.formatMessage({ id: 'Serial number is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Serial number is invalid - max' }, { max: 256 })),
    typeModel: yup.mixed()
      .required(intl.formatMessage({ id: 'Model type is required' }))
      .oneOf(panelTypeOptions, intl.formatMessage({ id: 'Model type is required' })),
    array: yup.number()
      .required(intl.formatMessage({ id: 'Array is required' }))
      .typeError(intl.formatMessage({ id: 'Array must be a number' }))
      .min(1, intl.formatMessage({ id: 'Array is invalid - min' }, { min: 1 }))
      .max(24, intl.formatMessage({ id: 'Array is invalid - max' }, { max: 24 })),
    panelMPPTPosition: yup.number()
      .required(intl.formatMessage({ id: 'MPPT position is required' }))
      .typeError(intl.formatMessage({ id: 'MPPT position must be a number' }))
      .min(1, intl.formatMessage({ id: 'MPPT position is invalid - min' }, { min: 1 }))
      .max(12, intl.formatMessage({ id: 'MPPT position is invalid - max' }, { max: 12 }))
  })

  const { control, register, errors, clearErrors, handleSubmit, reset, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data) => {
    data.withInverter = data.inverter ? data.inverter.value : undefined
    data.panelTypeId = data.typeModel.value
    data.projectId = projectId
    data.typeModel = TYPE_MODEL.SUNGROW

    if (isEditPanel) {
      await dispatch(
        editPanel(
          {
            id: currentPanel.id,
            ...data
          },
          panelParams
        )
      )
    } else {
      await dispatch(
        addPanel({
          ...data,
          status: DEVICE_STATUS.ACTIVE
        }, panelParams)
      )
    }

    dispatch(getProjectById({ id: projectId, fk: JSON.stringify(['users', 'devices']) }))

    setPanelDetailModal(false)
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
    setPanelDetailModal(false)
  }

  useEffect(() => {
    if (isEditPanel) {
      reset({
        ...currentPanel,
        inverter: inverterOptions.find(inv => inv.value === currentPanel?.withInverter),
        typeModel: panelTypeOptions.find(type => type.value === currentPanel?.panelTypeId)
      })
    }
  }, [currentPanel, panelDetailModal])

  // Set inverter options
  useEffect(() => {
    if (selectedProject?.devices?.length) {
      setInverterOptions(selectedProject.devices
        .filter(item => item.state === STATE.ACTIVE && item.typeDevice === DEVICE_TYPE.INVERTER)
        .map((customer) => ({
          label: customer.name,
          value: customer.id
        })))
    }
  }, [selectedProject])

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

  return (
    <>
      <Modal
        isOpen={panelDetailModal}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={panelDetailTitle} />
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
                <FormattedMessage id='Solar panel S/N' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='serialNumber'
                name='serialNumber'
                innerRef={register({ required: true })}
                invalid={!!errors.serialNumber}
                valid={getValues('serialNumber') !== '' && getValues('serialNumber') !== undefined
                && !errors.serialNumber}
                placeholder={PLACEHOLDER.DEVICE_SN}
              />
              {errors && errors.serialNumber && <FormFeedback>{errors.serialNumber.message}</FormFeedback>}
            </FormGroup>
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
                defaultValue={selectedInverter ? { label: selectedInverter.name, value: selectedInverter.id } : null}
                name='inverter'
                id='inverter'
                options={inverterOptions}
                className='react-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select an inverter' })}
              />
            </FormGroup>
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
                defaultValue={panelTypeOptions.find(type => type.value === currentPanel?.panelTypeId) || null}
                name='typeModel'
                id='typeModel'
                options={panelTypeOptions}
                className='react-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select type' })}
              />
              {
                errors && errors.typeModel &&
                <div className='text-danger font-small-3'>{errors.typeModel.message}</div>
              }
            </FormGroup>
            <FormGroup>
              <Label for='panelMPPTPosition'><FormattedMessage id='MPPT position' /><span
                className='text-danger'
              >&nbsp;*</span></Label>
              <Input
                type='number'
                min={1}
                max={12}
                step={1}
                id='panelMPPTPosition'
                name='panelMPPTPosition'
                innerRef={register({ required: true })}
                invalid={!!errors.panelMPPTPosition}
                valid={getValues('panelMPPTPosition') !== '' && getValues('panelMPPTPosition') !== undefined && !errors.panelMPPTPosition}
                placeholder={PLACEHOLDER.PANEL_MPPT}
              />
              {errors && errors.panelMPPTPosition && <FormFeedback>{errors.panelMPPTPosition.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='array'><FormattedMessage id='Array' /><span
                className='text-danger'
              >&nbsp;*</span></Label>
              <Input
                type='number'
                min={1}
                max={24}
                step={1}
                id='array'
                name='array'
                innerRef={register({ required: true })}
                invalid={!!errors.array}
                valid={getValues('array') !== '' && getValues('array') !== undefined && !errors.array}
                placeholder={PLACEHOLDER.PANEL_ARRAY}
              />
              {errors && errors.array && <FormFeedback>{errors.array.message}</FormFeedback>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>
              <FormattedMessage id={isEditPanel ? 'Update' : 'Add'} />
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

PanelDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  panelDetailModal: PropTypes.bool.isRequired,
  setPanelDetailModal: PropTypes.func.isRequired,
  panelDetailTitle: PropTypes.string.isRequired,
  currentPanel: PropTypes.object,
  isEditPanel: PropTypes.bool.isRequired
}

export default injectIntl(PanelDetail)
