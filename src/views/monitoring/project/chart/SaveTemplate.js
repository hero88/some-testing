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
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PropTypes from 'prop-types'
import { PLACEHOLDER } from '@constants/common'
import { useDispatch, useSelector } from 'react-redux'
import { addChartFilterTemplate, updateChartFilterTemplate } from '@src/views/monitoring/projects/store/actions'
import { getUserData } from '@src/auth/utils'
import { useEffect } from 'react'
import { useQuery } from '@hooks/useQuery'

const SaveTemplate = ({ intl, isOpen, setIsOpen, isEdit }) => {
  const query = useQuery()
  const projectId = query.get('projectId')
  const dispatch = useDispatch(),
    { customerProject: { chart } } = useSelector(state => state)
  const SignupSchema = yup.object().shape({
    templateName: yup.string()
      .required(intl.formatMessage({ id: 'Template name is required' }))
      .min(3, intl.formatMessage({ id: 'Template name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Template name is invalid - max' }, { max: 256 }))
  }, ['password', 'confirmPassword'])

  const {
    register,
    errors,
    handleSubmit,
    reset,
    getValues
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = (data) => {
    const userData = getUserData()
    if (isEdit) {
      dispatch(updateChartFilterTemplate({
        id: chart.currentTemplate.id,
        userId: userData?.id,
        projectId,
        name: data.templateName,
        data: chart.paramData
      }))
    } else {
      dispatch(addChartFilterTemplate({
        userId: userData?.id,
        projectId,
        name: data.templateName,
        data: chart.paramData
      }))
    }

    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen && isEdit) {
      reset({
        templateName: chart.currentTemplate.name
      })
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={() => setIsOpen(!isOpen)}>
          <FormattedMessage id={isEdit ? 'Edit template' : 'Save template'} />
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='templateName'><FormattedMessage id='Template name' /><span className='text-danger'>&nbsp;*</span></Label>
            <Input
              id='templateName'
              name='templateName'
              autoComplete='on'
              innerRef={register({ required: true })}
              invalid={!!errors.templateName}
              valid={getValues('templateName') !== '' && getValues('templateName') !== undefined && !errors.templateName}
              placeholder={PLACEHOLDER.USERNAME}
            />
            {errors && errors.templateName && <FormFeedback>{errors.templateName.message}</FormFeedback>}
          </FormGroup>
          <div>
            <FormattedHTMLMessage id='Save template note' />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' type='submit'>
            <FormattedMessage id={'Confirm'} />
          </Button>
          <Button color='secondary' onClick={() => setIsOpen(!isOpen)}>
            <FormattedMessage id='Cancel' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

SaveTemplate.propTypes = {
  intl: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired
}

export default injectIntl(SaveTemplate)
