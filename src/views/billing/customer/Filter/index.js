import React, { useState, cloneElement } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Col, Row } from 'reactstrap'
import { object, func } from 'prop-types'
import './style.scss'
import { injectIntl } from 'react-intl'
import { GENERAL_STATUS as OPERATION_UNIT_STATUS, GENERAL_CUSTOMER_TYPE } from '@src/utility/constants/billing'
import moment from 'moment'
import { ISO_STANDARD_FORMAT } from '@src/utility/constants'

const intitValue = {
  type: 'all',    
  state: 'all',
  fromCreatedDate: moment().format(ISO_STANDARD_FORMAT),
  toCreatedDate: moment().format(ISO_STANDARD_FORMAT),
  fromModifyDate: moment().format(ISO_STANDARD_FORMAT),
  toModifyDate: moment().format(ISO_STANDARD_FORMAT)
}

const FilterCustomer = ({ intl, children, onSubmit = () => {} }) => {
  const [formData, setFormData] = useState(intitValue)

  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }
  const handleChange = (type) => (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [type]: e?.target?.value
    }))
  }

  const handleSubmit = () => {
    const { state, type, fromCreatedDate, toCreatedDate, fromModifyDate, toModifyDate } = formData
    const payload = {}
    if (state !== 'all') {
      payload.state = {
        value: state,
        type: 'exact'
      }
    }
    if (type !== 'all') {
      payload.type = {
        value: type,
        type: 'exact'
      }
    }

    if (moment(fromCreatedDate).isValid() || moment(toCreatedDate).isValid()) {
      payload.createDate = {
        value: {
          start: moment(fromCreatedDate).isValid() ? moment(fromCreatedDate).startOf('day') : null,
          end: moment(toCreatedDate).isValid() ? moment(toCreatedDate).endOf('day') : null
        },
        type: 'dateRange'
      }
    }
    if (moment(fromModifyDate).isValid() || moment(toModifyDate).isValid()) {
      payload.modifyDate = {
        value: {
          start: moment(fromModifyDate).isValid() ? moment(fromModifyDate).startOf('day') : null,
          end: moment(toModifyDate).isValid() ? moment(toModifyDate).endOf('day') : null
        },
        type: 'dateRange'
      }
    }
    onSubmit?.(payload)
    toggle()
  }

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} zIndex={500} aria-labelledby="contained-modal-title-vcenter" centered>
        <ModalHeader>{intl.formatMessage({ id: 'FIlterCustomer' })}</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12} className="mb-2">
              <Label className="general-label" for="exampleSelect">
                {intl.formatMessage({ id: 'Company-Types' })}
              </Label>

              <Input value={formData.type} onChange={handleChange('type')} type="select" name="type" id="exampleSelect">
                <option value="all">{intl.formatMessage({ id: 'All-customer' })}</option>
                {GENERAL_CUSTOMER_TYPE.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md={12} className="mb-2">
              <Label className="general-label" for="exampleSelect">
                {intl.formatMessage({ id: 'Status' })}
              </Label>

              <Input
                value={formData.state}
                onChange={handleChange('state')}
                type="select"
                name="state"
                id="exampleSelect"
              >
                <option value="all">{intl.formatMessage({ id: 'AllStatus' })}</option>
                <option value={OPERATION_UNIT_STATUS.ACTIVE}>{intl.formatMessage({ id: 'Active' })}</option>
                <option value={OPERATION_UNIT_STATUS.INACTIVE}>{intl.formatMessage({ id: 'Inactive' })}</option>
              </Input>
            </Col>
            <Col md={12}>
              <Label className="general-label" for="exampleSelect">
                {intl.formatMessage({ id: 'CreatedDate' })}
              </Label>

              <Row className="mb-2">
                <Col md={6}>
                  <Input
                    name="fromCreatedDate"
                    autoComplete="on"
                    type="date"
                    className="custom-icon-input-date"
                    value={formData.fromCreatedDate}
                    onChange={handleChange('fromCreatedDate')}
                  />
                </Col>

                <Col md={6}>
                  <Input
                    name="toCreatedDate"
                    autoComplete="on"
                    type="date"
                    className="custom-icon-input-date"
                    value={formData.toCreatedDate}
                    onChange={handleChange('toCreatedDate')}
                  />
                </Col>
              </Row>
              <Label className="general-label" for="exampleSelect">
                {intl.formatMessage({ id: 'ModifyDate' })}
              </Label>
              <Row>
                <Col md={6}>
                  <Input
                    name="fromModifyDate"
                    autoComplete="on"
                    type="date"
                    className="custom-icon-input-date"
                    value={formData.fromModifyDate}
                    onChange={handleChange('fromModifyDate')}
                  />
                </Col>

                <Col md={6}>
                  <Input
                    name="toModifyDate"
                    autoComplete="on"
                    type="date"
                    className="custom-icon-input-date"
                    value={formData.toModifyDate}
                    onChange={handleChange('toModifyDate')}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'Finish' })}
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            {intl.formatMessage({ id: 'Cancel' })}
          </Button>
        </ModalFooter>
      </Modal>
      {cloneElement(children, { onClick: toggle })}
    </>
  )
}
FilterCustomer.propTypes = {
  children: object,
  onSubmit: func,
  intl: object.isRequired
}

export default injectIntl(FilterCustomer)
