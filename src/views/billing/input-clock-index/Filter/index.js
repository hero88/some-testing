import React, { useState, cloneElement, useEffect } from 'react'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Col, Row, Form } from 'reactstrap'
import { object, func } from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import { API_GET_ALL_CUSTOMER, API_GET_ALL_PROJECT, API_GET_LIST_CUSTOMER_BY_PROJECT_ID } from '@src/utility/constants'
import Select from 'react-select'
import { selectThemeColors, showToast } from '@src/utility/Utils'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import MonthPicker from '@src/views/common/MonthPicker'

const ALL_CUSTOMERS_OPTION = {
  value: 'all',
  label: <FormattedMessage id="All-customer" />
}
const ALL_PROJECTS_OPTION = {
  value: 'all',
  label: <FormattedMessage id="All projects" />
}

const intitValue = {
  projectId: ALL_PROJECTS_OPTION,
  customerId: ALL_CUSTOMERS_OPTION,
  month: moment()
}

const Filter = ({ intl, children, onSubmit = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [allCustomers, setAllCustomers] = useState([])
  const [customers, setCustomers] = useState([])

  const { handleSubmit, control, register, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: intitValue,
    shouldUnregister: false
  })

  useEffect(async () => {
    try {
      const [projectRes, customersRes] = await Promise.all([
        axios.get(API_GET_ALL_PROJECT),
        axios.get(API_GET_ALL_CUSTOMER)
      ])
      if (projectRes.status === 200 && projectRes.data.data) {
        setProjects(
          (projectRes.data.data || []).map((item) => ({
            value: item.id,
            label: item.name
          }))
        )
      }
      if (customersRes.status === 200 && customersRes.data.data) {
        setAllCustomers(
          (customersRes.data.data || []).map((item) => ({
            value: item.id,
            label: item.fullName
          }))
        )
      }
    } catch (error) {
      console.log('error', error)
      showToast('error', error.toString())
    }
  }, [])

  useEffect(async () => {
    try {
      if (!watch('projectId')?.value || watch('projectId')?.value === ALL_PROJECTS_OPTION.value) {
        setValue('customerId', ALL_CUSTOMERS_OPTION)
        setCustomers([ALL_CUSTOMERS_OPTION, ...allCustomers])
      } else {
        const customerByProjectRes = await axios(`${API_GET_LIST_CUSTOMER_BY_PROJECT_ID}/${watch('projectId')?.value}`)
        if (customerByProjectRes.status === 200 && customerByProjectRes.data.data) {
          const tempCustomers = customerByProjectRes.data.data || []
          if (tempCustomers?.length) {
            setValue('customerId', ALL_CUSTOMERS_OPTION)
            setCustomers([
              ALL_CUSTOMERS_OPTION,
              ...tempCustomers.map((item) => ({
                value: item.customerId,
                label: item.fullName
              }))
            ])
          } else {
            setValue('customerId', null)
            setCustomers([])
          }
        }
      }
    } catch (error) {
      showToast('error', error.toString())
    }
  }, [watch('projectId')?.value, allCustomers])

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmitForm = (formData) => {
    const { projectId, customerId, month } = formData
    const payload = {}
    if (projectId?.value && projectId?.value !== 'all') {
      payload.projectId = {
        value: projectId.value,
        type: 'exact'
      }
    }
    if (customerId?.value && customerId.value !== 'all') {
      payload.customerId = {
        value: customerId.value,
        type: 'exact'
      }
    }

    if (month) {
      payload.month = {
        value: Number(moment(month).format('MM')),
        type: 'exact'
      }
      payload.year = {
        value: Number(moment(month).format('YYYY')),
        type: 'exact'
      }
    }

    onSubmit?.(payload)
    toggle()
  }

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} aria-labelledby="contained-modal-title-vcenter" centered>
        <ModalHeader>{intl.formatMessage({ id: 'Filter electricity index' })}</ModalHeader>
        <Form className="billing-form" onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalBody>
            <Row>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="projectId">
                  {intl.formatMessage({ id: 'Projects' })}
                </Label>
                <Controller
                  control={control}
                  theme={selectThemeColors}
                  name="projectId"
                  id="projectId"
                  innerRef={register()}
                  render={(field) => {
                    return (
                      <Select
                        {...field}
                        blurInputOnSelect
                        noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} 
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        options={[ALL_PROJECTS_OPTION, ...projects]}
                        placeholder={intl.formatMessage({ id: 'Select projects' })}
                        formatOptionLabel={(option) => <>{option.label}</>}
                      />
                    )
                  }}
                />
              </Col>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="customerId">
                  {intl.formatMessage({ id: 'Customers' })}
                </Label>
                <Controller
                  control={control}
                  name="customerId"
                  id="customerId"
                  innerRef={register()}
                  render={(field) => {
                    return (
                      <Select
                        {...field}
                        placeholder={intl.formatMessage({ id: 'Select customer' })}
                        noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        options={[...customers]}
                        formatOptionLabel={(option) => <>{option.label}</>}
                      />
                    )
                  }}
                />
              </Col>
              <Col className="mb-2" xs={12}>
                <Label className="general-label" for="month">
                  {intl.formatMessage({ id: 'Month' })}
                </Label>

                <Controller
                  control={control}
                  name="month"
                  id="month"
                  innerRef={register()}
                  render={(fields) => {
                    return <MonthPicker {...fields} />
                  }}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {intl.formatMessage({ id: 'Finish' })}
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {cloneElement(children, { onClick: toggle })}
    </>
  )
}
Filter.propTypes = {
  children: object,
  onSubmit: func,
  intl: object.isRequired
}

export default injectIntl(Filter)
