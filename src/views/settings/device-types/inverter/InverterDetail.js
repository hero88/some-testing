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
import { addDeviceTypeInverter, editDeviceTypeInverter } from '@src/views/settings/device-types/inverter/store/actions'

const InverterDetail = ({
  isShowInverterDetail,
  setIsShowInverterDetail,
  inverterDetailTitle,
  isEditInverter,
  isViewInverter,
  intl
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      deviceTypeInverter: { params: inverterParams, selectedInverter }
    } = useSelector(state => state)

  const SignupSchema = yup.object().shape({
    inverterModel: yup.string()
      .required(intl.formatMessage({ id: 'Inverter model is required' }))
      .min(3, intl.formatMessage({ id: 'Inverter model is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Inverter model is invalid - max' }, { max: 256 })),
    manufacturer: yup.string()
      .required(intl.formatMessage({ id: 'Inverter manufacturer is required' }))
      .min(3, intl.formatMessage({ id: 'Inverter manufacturer is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Inverter manufacturer is invalid - max' }, { max: 256 })),
    power: yup.number()
      //.transform((value) => (value === '' || isNaN(value) ? 0 : value))
      .typeError(intl.formatMessage({ id: 'Inverter power is valid number type' }))
      .integer(intl.formatMessage({ id: "Inverter power can't include a decimal point" }))
      .positive(intl.formatMessage({ id: 'Inverter power must be greater than zero' })),
    numberOfMPPT: yup.number()
      // .typeError(intl.formatMessage({ id: 'Inverter numberOfMPPT is valid number type' }))
      .nullable()
      .transform((value) => (value === '' || Number.isNaN(value) ? null : value))
      .integer(intl.formatMessage({ id: "Inverter numberOfMPPT can't include a decimal point" }))
      .min(1, intl.formatMessage({ id: 'Inverter numberOfMPPT is invalid - min'}, { min : 1}))
      .max(12, intl.formatMessage({ id: 'Inverter numberOfMPPT is invalid - max'}, { max : 12})),
    numberOfStringPerMPPT: yup.number()
      // .typeError(intl.formatMessage({ id: 'Inverter numberOfStringPer is valid number type' }))
      .nullable()
      .transform((value) => (value === '' || Number.isNaN(value) ? null : value))
      .integer(intl.formatMessage({ id: "Inverter numberOfStringPerMPPT can't include a decimal point" }))
      .min(1, intl.formatMessage({ id: 'Inverter numberOfStringPerMPPT is invalid - min'}, { min : 1}))
      .max(24, intl.formatMessage({ id: 'Inverter numberOfStringPerMPPT is invalid - max'}, { max : 24}))
  })

  const initInverter = {
    inverterModel: '',
    manufacturer: '',
    numberOfMPPT: '',
    power: null,
    numberOfStringPerMPPT: ''
  }

  const { register, errors, clearErrors, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues: initInverter
  })

  const onSubmit = async (data) => {
    const handleData = {
      inverterModel: data.inverterModel,
      manufacturer: data.manufacturer,
      power: data.power * 1000,
      numberOfMPPT: data.numberOfMPPT,
      numberOfStringPerMPPT: data.numberOfStringPerMPPT
    }

    if (isEditInverter) {
      dispatch(
        editDeviceTypeInverter({ id: selectedInverter.id, ...handleData }, inverterParams)
      )
    } else {
      dispatch(
        addDeviceTypeInverter({
          ...handleData
        }, inverterParams)
      )
    }

    setIsShowInverterDetail(false)
    reset(initInverter)
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
    setIsShowInverterDetail(false)
  }

  useEffect(async () => {
    if (isEditInverter || isViewInverter) {
      reset({
        ...selectedInverter,
        inverterModel: selectedInverter.inverterModel ? selectedInverter.inverterModel : '',
        power: selectedInverter.power ? selectedInverter.power / 1000 : '',
        numberOfMPPT: selectedInverter.numberOfMPPT ? selectedInverter.numberOfMPPT : '',
        manufacturer: selectedInverter.manufacturer ? selectedInverter.manufacturer : '',
        numberOfStringPerMPPT: selectedInverter.numberOfStringPerMPPT ? selectedInverter.numberOfStringPerMPPT : ''
      })
    } else {
      reset(initInverter)
    }
  }, [selectedInverter, isShowInverterDetail])

  return (
    <>
      <Modal
        isOpen={isShowInverterDetail}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={inverterDetailTitle} />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='inverterModel'>
                <FormattedMessage id='Device type model' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                id='inverterModel'
                name='inverterModel'
                innerRef={register({ required: true })}
                invalid={!!errors.inverterModel}
                readOnly={isViewInverter}
              />
              {errors && errors.inverterModel && <FormFeedback>{errors.inverterModel.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='manufacturer'><FormattedMessage id='Device type producer' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                id='manufacturer'
                name='manufacturer'
                innerRef={register({ required: true })}
                invalid={!!errors.manufacturer}
                readOnly={isViewInverter}
              />
              {errors && errors.manufacturer && <FormFeedback>{errors.manufacturer.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='power'>
                <FormattedMessage id='Device type power' />
                <span className='text-danger'>&nbsp;(*)</span>
              </Label>
              <Input
                type='number'
                step="any"
                id='power'
                name='power'
                innerRef={register({ required: true })}
                invalid={!!errors.power}
                readOnly={isViewInverter}
              />
              {errors && errors.power && <FormFeedback>{errors.power.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='numberOfMPPT'><FormattedMessage id='Device type MPPT number' /></Label>
              <Input
                type='number'
                step="any"
                id='numberOfMPPT'
                name='numberOfMPPT'
                innerRef={register({ required: true })}
                invalid={!!errors.numberOfMPPT}
                readOnly={isViewInverter}
              />
              {errors && errors.numberOfMPPT && <FormFeedback>{errors.numberOfMPPT.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for='numberOfStringPerMPPT'><FormattedMessage id='Device type string per MPPT' /></Label>
              <Input
                type='number'
                step="any"
                id='numberOfStringPerMPPT'
                name='numberOfStringPerMPPT'
                innerRef={register({ required: true })}
                invalid={!!errors.numberOfStringPerMPPT}
                readOnly={isViewInverter}
              />
              {errors && errors.numberOfStringPerMPPT && <FormFeedback>{errors.numberOfStringPerMPPT.message}</FormFeedback>}
            </FormGroup>
          </ModalBody>
          {
            !isViewInverter &&
            <ModalFooter>
              <Button color='primary' type='submit'>
                <FormattedMessage id={isEditInverter ? 'Update' : 'Add'} />
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

InverterDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowInverterDetail: PropTypes.bool.isRequired,
  setIsShowInverterDetail: PropTypes.func.isRequired,
  inverterDetailTitle: PropTypes.string.isRequired,
  isEditInverter: PropTypes.bool.isRequired,
  isViewInverter: PropTypes.bool.isRequired
}

export default injectIntl(InverterDetail)
