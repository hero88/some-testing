import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import PropTypes from 'prop-types'
import InverterChart from '@src/views/monitoring/devices/inverter/InverterChart'
import { FormattedMessage } from 'react-intl'

const ChartModal = ({ isOpen, toggle, selectedParam }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className='modal-dialog-centered modal-device-chart'>
      <ModalHeader toggle={toggle}>
        {selectedParam ? <FormattedMessage id={selectedParam.title}/> : ''}
      </ModalHeader>
      <ModalBody>
        <InverterChart
          isParam
          selectedParam={selectedParam}
        />
      </ModalBody>
    </Modal>
  )
}

ChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedParam: PropTypes.object
}

export default ChartModal
