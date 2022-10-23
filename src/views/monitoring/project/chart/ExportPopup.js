import PropTypes from 'prop-types'
import { Button, CustomInput, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { injectIntl } from 'react-intl'

const ExportPopup = ({ intl, isOpen, setIsOpen, fileName, setFileName, fileFormat, setFileFormat, handleExport }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>{intl.formatMessage({ id: 'Export Excel' })}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Input
            type='text'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder={intl.formatMessage({ id: 'Enter file Name' })}
          />
        </FormGroup>
        <FormGroup>
          <CustomInput
            type='select'
            id='selectFileFormat'
            name='customSelect'
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
          >
            <option>xlsx</option>
          </CustomInput>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={handleExport}>
          {intl.formatMessage({ id: 'Export' })}
        </Button>
        <Button color='flat-danger' onClick={() => setIsOpen(!isOpen)}>
          {intl.formatMessage({ id: 'Cancel' })}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ExportPopup.propTypes = {
  intl: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
  setFileName: PropTypes.func.isRequired,
  fileFormat: PropTypes.string.isRequired,
  setFileFormat: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired
}

export default injectIntl(ExportPopup)
