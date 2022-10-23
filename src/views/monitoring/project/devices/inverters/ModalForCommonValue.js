import React from 'react'
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useForm } from 'react-hook-form'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
// import { useQuery } from '@hooks/useQuery'
import axios from 'axios'

// ** Store & Actions
// import axios from 'axios'

const ModalForCommonValue = ({ modalForCommonValue, setModalForCommonValue, selectedInverters }) => {
  // const query = useQuery()
  // const projectId = query.get('projectId')

  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => {
    console.log(selectedInverters)
    console.log(data)
    const entries = Object.entries(data)
    // for (let i = 0; i < selectedInverters?.length; i++) {
    //   if (entries[0][1] !== '') {
    //     const body = {
    //       control_type: 'power_control',
    //       site: projectId,
    //       inverter_type: inverterType,
    //       device_sn: selectedInverters[i],
    //       control_values: { absolute_output_power : entries[0][1], percentage_output_power: null}
    //     }
    //     Promise.all(axios.post('http://localhost:5001/api/remote/send_command_to_inverter', body)).then((values) => {
    //       console.log(values)
    //     })
    //   }

    //   if (entries[1][1] !== '') {
    //     const body = {
    //       control_type: 'power_control',
    //       site: projectId,
    //       inverter_type: inverterType,
    //       device_sn: selectedInverters[i],
    //       control_values: { absolute_output_power : null, percentage_output_power: entries[1][1]}
    //     }
    //     axios
    //     .post(
    //       'http://localhost:5001/api/remote/send_command_to_inverter',
    //       body
    //     )
    //     .then(response => alert(response.data.status.commandExecutionStatus))
    //     .catch(error => console.log(error))
    //     console.log(body)
    //   }
    // }

    const listInv = ['A2004250015', 'B2004250015', 'C2004250015']
    const listOfBodies = []
    for (let i = 0; i < listInv.length; i++) {
      if (entries[0][1] !== '') {
        const body = {
          control_type: 'power_control',
          site: 'local-debug',
          device_sn: listInv[i],
          control_values: { absolute_output_power: entries[0][1], percentage_output_power: null }
        }
        listOfBodies.push(body)
      }
    }

    async function sendRequestToMultipleInverters() {
      for (const body of listOfBodies) {
        await axios
          .post('http://localhost:5001/api/remote/send_command_to_inverter', body)
          .then((response) => alert(response.data.status.commandExecutionStatus))
          .catch((error) => console.log(error))
      }
    }

    sendRequestToMultipleInverters()

    // axios
    //   .post('http://localhost:5001/api/remote/send_command_to_inverter', body)
    //   .then((response) => alert(response.data.status.commandExecutionStatus))
    //   .catch((error) => console.log(error))
    setModalForCommonValue(false)
    reset({})
  }

  const toggle = () => {
    reset(
      {},
      {
        keepDirty: true,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false
      }
    )
    setModalForCommonValue(false)
  }

  return (
    <>
      <Modal isOpen={modalForCommonValue} backdrop="static" className="modal-dialog-centered">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggle}>Mời bạn nhập</ModalHeader>
          <ModalBody>
            <div>{JSON.stringify(selectedInverters)}</div>
            <FormGroup>
              <Label for="absoluteValue">
                <FormattedMessage id="Absolute value" />
              </Label>
              <Input type="number" id="absoluteValue" name="absolute_output_power" innerRef={register} />
            </FormGroup>
            <FormGroup>
              <Label for="percentageValue">
                <FormattedMessage id="Percentage value" />
              </Label>
              <Input type="number" id="percentageValue" name="percentage_output_power" innerRef={register} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Nhấn em đi
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Bỏ đi mà làm người
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}

ModalForCommonValue.propTypes = {
  modalForCommonValue: PropTypes.bool.isRequired,
  setModalForCommonValue: PropTypes.func.isRequired,
  selectedInverters: PropTypes.array.isRequired
}

export default injectIntl(ModalForCommonValue)
