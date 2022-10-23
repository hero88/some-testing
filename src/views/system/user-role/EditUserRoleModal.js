import React, { useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, Col, Row, Label, Input, Form, FormFeedback } from 'reactstrap'
import { selectThemeColors } from '@src/utility/Utils'
import { bool, func, object } from 'prop-types'
import { FormattedMessage, injectIntl, useIntl } from 'react-intl'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { getRoleByUserId, postUserRole } from './store/actions'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const EditUserRoleModal = ({ initValue, handldeOpenModal = () => {}, isOpen, handleFetchRoles = () => {} }) => {
  const dispatch = useDispatch()
  const { selectedRole } = useSelector((state) => state.userRole)
  const intl = useIntl()

  const ValidateSchema = yup.object().shape(
    {
      newRole: yup.object().shape({
        label: yup.string().required(intl.formatMessage({ id: 'required-validate' })),
        value: yup.string().required(intl.formatMessage({ id: 'required-validate' }))
      })
    },
    ['newRole']
  )
  const { control, errors, handleSubmit, register, getValues, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(ValidateSchema)
  })
  useEffect(() => {
    dispatch(getRoleByUserId({ id: initValue?.id }))
  }, [initValue, isOpen])
  useEffect(() => {
    if (!selectedRole[0]) setValue('curentRole', '')
  }, [selectedRole])
  const { roles } = useSelector((state) => state.permissionGroup)

  const labelRoles = roles.map((item) => ({ value: item.id, label: item.name }))

  const toggle = () => {
    handldeOpenModal(!isOpen)

  }

  const handleSubmitFilterForm = async () => {
    const payload = {}
    payload.userId = initValue?.id
    payload.roleId = getValues('newRole')?.value
    await dispatch(postUserRole(payload))
    handleFetchRoles()   
    toggle()

  }
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} zIndex={500} aria-labelledby="contained-modal-title-vcenter" centered>
        <Form className="billing-form">
          <ModalBody>
            <Row>
              <Col md={6} className="mt-1">
                <p>Họ & tên người sử dụng</p>
              </Col>
              <Col md={6} className="mt-1">
                <p className="full-name-label">{initValue?.fullName}</p>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mt-1">
                <Label className="general-label" for="exampleSelect">
                  {intl.formatMessage({ id: 'Curent Role' })}
                </Label>
                <Input
                  innerRef={register()}
                  value={selectedRole[0]?.name}
                  id="curentRole"
                  disabled
                  name="curentRole"
                  className="input"
                />
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mt-1">
                <Label className="general-label" for="exampleSelect">
                  {intl.formatMessage({ id: 'Curent Role' })}
                </Label>
                <Controller
                  as={Select}
                  control={control}
                  theme={selectThemeColors}
                  innerRef={register()}
                  name="newRole"
                  id="newRole"
                  options={labelRoles}
                  className="react-select"
                  classNamePrefix="select"
                  valid={!!getValues('newRole')?.value}
                  invalid={!!errors.newRole}
                  placeholder={intl.formatMessage({ id: 'Select Role' })}
                  formatOptionLabel={(option) => <>{option.label}</>}
                  noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                />
                {!!errors?.newRole && (
                  <FormFeedback className="d-block">{errors?.newRole?.value?.message}</FormFeedback>
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSubmit(handleSubmitFilterForm)}>
              {intl.formatMessage({ id: 'Finish' })}
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}
EditUserRoleModal.propTypes = {
  initValue: object,
  handldeOpenModal: func,
  isOpen: bool,
  handleFetchRoles: func
}

export default injectIntl(EditUserRoleModal)
