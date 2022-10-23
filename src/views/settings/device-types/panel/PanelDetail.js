/// ** React Imports
import { useEffect } from 'react'

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
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import { addDeviceTypePanel, editDeviceTypePanel } from '@src/views/settings/device-types/panel/store/actions'
import { numberOneCommas, numberThreeCommas } from '@src/utility/Utils'

const PanelDetail = ({
  isShowPanelDetail,
  setIsShowPanelDetail,
  panelDetailTitle,
  isEditPanel,
  isViewPanel,
  intl
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      deviceTypePanel: { params: panelParams, selectedPanel }
    } = useSelector(state => state)

  const SignupSchema = yup.object().shape({
    panelModel: yup.string()
      .required(intl.formatMessage({ id: 'Panel model is required' }))
      .min(3, intl.formatMessage({ id: 'Panel model is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Panel model is invalid - max' }, { max: 256 })),
    manufacturer: yup.string()
      .required(intl.formatMessage({ id: 'Panel manufacturer is required' }))
      .min(3, intl.formatMessage({ id: 'Panel manufacturer is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Panel manufacturer is invalid - max' }, { max: 256 })),
    spv: yup.number()
      .typeError(intl.formatMessage({ id: 'Panel spv is valid number type' }))
      //.transform((value) => (value === '' || isNaN(value) ? 0 : value))
      .positive(intl.formatMessage({ id: 'Panel spv must be greater than zero' })),
    ppv: yup.number()
      .typeError(intl.formatMessage({ id: 'Panel ppv is valid number type' }))
      .positive(intl.formatMessage({ id: 'Panel ppv must be greater than zero' })),
    eff: yup.number()
      .typeError(intl.formatMessage({ id: 'Panel eff is valid number type' })),
    ambTemp: yup.number()
      .typeError(intl.formatMessage({ id: 'Panel ambTemp is valid number type' }))
      .positive(intl.formatMessage({ id: 'Panel ambTemp must be greater than zero' })),
    tempCoEff: yup.number()
      .typeError(intl.formatMessage({ id: 'Panel tempCoEff is valid number type' }))
  })

  const initPanel = {
    panelModel: '',
    manufacturer: '',
    spv: '',
    ppv: '',
    eff: '',
    ambTemp: '',
    tempCoEff: ''
  }

  const { register, errors, clearErrors, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues: initPanel
  })

  const onSubmit = async (data) => {
    const handleData = {
      panelModel: data.panelModel,
      manufacturer: data.manufacturer,
      ppv: data.ppv,
      spv: data.spv,
      eff: data.eff / 100,
      ambTemp: data.ambTemp,
      tempCoEff: data.tempCoEff / 100
    }

    if (isEditPanel) {
      dispatch(
        editDeviceTypePanel({ id: selectedPanel.id, ...handleData }, panelParams)
      )
    } else {
      dispatch(
        addDeviceTypePanel({
          ...handleData
        }, panelParams)
      )
    }

    setIsShowPanelDetail(false)
    reset(initPanel)
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
    setIsShowPanelDetail(false)
  }

  useEffect(async () => {
    if (isEditPanel || isViewPanel) {
      reset({
        ...selectedPanel,
        panelModel: selectedPanel.panelModel ? selectedPanel.panelModel : '',
        ppv: selectedPanel.ppv ? selectedPanel.ppv : '',
        spv: selectedPanel.spv ? selectedPanel.spv : '',
        manufacturer: selectedPanel.manufacturer ? selectedPanel.manufacturer : '',
        eff: selectedPanel.eff ? numberOneCommas(selectedPanel.eff) : '',
        ambTemp: selectedPanel.ambTemp ? selectedPanel.ambTemp : '',
        tempCoEff: selectedPanel.tempCoEff ? numberThreeCommas(selectedPanel.tempCoEff) : ''
      })
    } else {
      reset(initPanel)
    }
  }, [selectedPanel, isShowPanelDetail])

  return (
    <>
      <Modal
        isOpen={isShowPanelDetail}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={panelDetailTitle} />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='panelModel'>
                <FormattedMessage id='Device type model' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                id='panelModel'
                name='panelModel'
                innerRef={register({ required: true })}
                invalid={!!errors.panelModel}
                readOnly={isViewPanel}
              />
              {errors && errors.panelModel && <FormFeedback>{errors.panelModel.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='manufacturer'><FormattedMessage id='Device type producer' /><span className='text-danger'>&nbsp;(*)</span></Label>
              <Input
                id='manufacturer'
                name='manufacturer'
                innerRef={register({ required: true })}
                invalid={!!errors.manufacturer}
                readOnly={isViewPanel}
              />
              {errors && errors.manufacturer && <FormFeedback>{errors.manufacturer.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='ppv'>
                <FormattedMessage id='Device type maximum power' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                type='number'
                step='any'
                id='ppv'
                name='ppv'
                innerRef={register({ required: true })}
                invalid={!!errors.ppv}
                readOnly={isViewPanel}
              />
              {errors && errors.ppv && <FormFeedback>{errors.ppv.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='spv'><FormattedMessage id='Device type area' /> (m²)
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                type='number'
                step='any'
                id='spv'
                name='spv'
                innerRef={register({ required: true })}
                invalid={!!errors.spv}
                readOnly={isViewPanel}
              />
              {errors && errors.spv && <FormFeedback>{errors.spv.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='eff'><FormattedMessage id='Device type module Efficiency' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                type='number'
                step='any'
                id='eff'
                name='eff'
                innerRef={register({ required: true })}
                invalid={!!errors.eff}
                readOnly={isViewPanel}
              />
              {errors && errors.eff && <FormFeedback>{errors.eff.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='ambTemp'><FormattedMessage id='Device type ambient temperature' /> (°C)
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                type='number'
                step='any'
                id='ambTemp'
                name='ambTemp'
                innerRef={register({ required: true })}
                invalid={!!errors.ambTemp}
                readOnly={isViewPanel}
              />
              {errors && errors.ambTemp && <FormFeedback>{errors.ambTemp.message}</FormFeedback>}
            </FormGroup>

            <FormGroup>
              <Label for='tempCoEff'><FormattedMessage id='Device type tempCoEff' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                type='number'
                step='any'
                id='tempCoEff'
                name='tempCoEff'
                innerRef={register({ required: true })}
                invalid={!!errors.tempCoEff}
                readOnly={isViewPanel}
              />
              {errors && errors.tempCoEff && <FormFeedback>{errors.tempCoEff.message}</FormFeedback>}
            </FormGroup>
          </ModalBody>
          {
            !isViewPanel &&
            <ModalFooter>
              <Button color='primary' type='submit'>
                <FormattedMessage id={isEditPanel ? 'Update' : 'Add'} />
              </Button>
              <Button color='secondary' onClick={handleCancel}>
                <FormattedMessage id='Cancel' />
              </Button>
            </ModalFooter>
          }
        </Form>
      </Modal>
    </>
  )
}

PanelDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowPanelDetail: PropTypes.bool.isRequired,
  setIsShowPanelDetail: PropTypes.func.isRequired,
  panelDetailTitle: PropTypes.string.isRequired,
  isEditPanel: PropTypes.bool.isRequired,
  isViewPanel: PropTypes.bool.isRequired
}

export default injectIntl(PanelDetail)
