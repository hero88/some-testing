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
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { PLACEHOLDER, STATE } from '@constants/common'
import { addAlertNote } from '@src/views/alert/store/action'

const NoteDetail = ({ intl, isOpenModal, setIsOpenModal }) => {
  // ** Store Vars
  const dispatch = useDispatch()

  const initState = {
    content: ''
  }

  const SignupSchema = yup.object().shape({
    content: yup.string()
      .required(intl.formatMessage({ id: 'Note content is required' }))
      .min(3, intl.formatMessage({ id: 'Note content is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Note content is invalid - max' }, { max: 256 }))
  })

  const { register, errors, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues: initState
  })

  const onSubmit = async (data) => {
    dispatch(addAlertNote({
      data: {
        ...data,
        state: STATE.ACTIVE
      }
    }))
    reset(initState)
  }

  return (
    <Modal
      isOpen={isOpenModal}
      toggle={() => setIsOpenModal(!isOpenModal)}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={() => setIsOpenModal(!isOpenModal)}>
          {intl.formatMessage({ id: 'Add new note' })}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='content'>
              <FormattedMessage id='Content' />
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='content'
              name='content'
              innerRef={register({ required: true })}
              invalid={!!errors.content}
              placeholder={PLACEHOLDER.ALERT_CONTENT}
            />
            {errors && errors.content && <FormFeedback>{errors.content.message}</FormFeedback>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type='submit' color='primary'>
            {intl.formatMessage({ id: 'Add' })}
          </Button>{' '}
        </ModalFooter>
      </Form>
    </Modal>
  )
}

NoteDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isOpenModal: PropTypes.bool.isRequired,
  setIsOpenModal: PropTypes.func.isRequired
}

export default injectIntl(NoteDetail)
