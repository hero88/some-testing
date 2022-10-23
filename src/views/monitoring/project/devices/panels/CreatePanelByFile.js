import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Uppy from '@uppy/core'
import {
  ALLOWED_IMPORT_PANEL_FILE_EXTENSIONS,
  CHECKING_PANEL_FILE_EXTENSIONS,
  MULTI_FORMAT_INPUT_DATE,
  SHOW_ALL_ROWS
} from '@constants/common'
import XLSX from 'xlsx'
import _isNumber from 'lodash/isNumber'
import axios from 'axios'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { DragDrop } from '@uppy/react'

import { API_POST_AUTO_DEVICE } from '@constants/api'
import { showToast } from '@utils'
import { getAllPanels } from '@src/views/monitoring/project/devices/panels/store/actions'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import { useQuery } from '@hooks/useQuery'
import { DEVICE_TYPE, TYPE_MODEL } from '@constants/project'
import moment from 'moment'

const CreatePanelByFile = ({ intl, isShowCreatePanelByFile, setIsShowCreatePanelByFile }) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    query = useQuery(),
    projectId = query.get('projectId')

  const uppy = new Uppy({
    id: 'uppy',
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ALLOWED_IMPORT_PANEL_FILE_EXTENSIONS
    },
    allowMultipleUploads: true,
    autoProceed: true
  })

  uppy.on('complete', result => {
    try {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const fileData = reader.result
          const wb = XLSX.read(fileData, { type: 'binary' })

          wb.SheetNames.forEach(async (sheetName) => {
            try {
              const rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])

              const checkedData = rowObj.map((item, index) => {
                if (index > 0) {
                  if (!_isNumber(item?.panelMPPTPosition) || item?.panelMPPTPosition < 1 || item?.panelMPPTPosition > 12) {
                    throw new Error(intl.formatMessage({ id: 'MPPT position is not valid' }, { min: 1, max: 12 }))
                  }

                  if (!_isNumber(item?.array) || item?.array < 1 || item?.array > 24) {
                    throw new Error(intl.formatMessage({ id: 'Array is not valid' }, { min: 1, max: 24 }))
                  }

                  return (
                    {
                      ...item,
                      projectId,
                      typeModel: TYPE_MODEL.SUNGROW,
                      typeDevice: DEVICE_TYPE.PANEL,
                      verificationTime: item.verificationTime
                        ? moment(item.verificationTime, MULTI_FORMAT_INPUT_DATE).valueOf()
                        : undefined
                    }
                  )
                }

                return null
              })

              // ** Call API create panel automatically
              await axios.post(API_POST_AUTO_DEVICE, checkedData.filter(item => item))
                .then(response => {
                  if (response.data && response.data.status && response.data.data) {
                    showToast('success', response.data.message)

                    Promise.all([
                      // ** Get panels
                      dispatch(getAllPanels({
                        order: 'serialNumber asc',
                        fk: '["project"]',
                        getAll: 1,
                        rowsPerPage: SHOW_ALL_ROWS,
                        projectId
                      })),
                      // ** Get project by Id to update new panel
                      dispatch(getProjectById({
                        id: projectId,
                        fk: '*'
                      }))
                    ])

                    setIsShowCreatePanelByFile(false)
                  } else {
                    throw new Error(response.data.message)
                  }
                })
                .catch(e => {
                  showToast('error', `${e.response ? e.response.data.message : e.message}`)
                })
            } catch (e) {
              showToast('error', e.message)
            }
          })
        } catch (e) {
          showToast('error', e.message)
        }
      }

      if (CHECKING_PANEL_FILE_EXTENSIONS.includes(result.successful[0].extension)) {
        reader.readAsBinaryString(result.successful[0].data)
      } else {
        showToast('error', intl.formatMessage({ id: 'File is not valid' }))
      }
    } catch (e) {
      showToast('error', e.message)
    } finally {
      uppy.reset()
    }
  })

  return (
    <Modal
      isOpen={isShowCreatePanelByFile}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <ModalHeader toggle={() => setIsShowCreatePanelByFile(!isShowCreatePanelByFile)}>
        <FormattedMessage id='Create panels automatically by file' />
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm={12} className='mb-2'>
            <a
              href={process.env.REACT_APP_CSV_TEMPLATE_URL}
              download
              target='_blank' rel='noreferrer'
            >
              <FormattedMessage id='Download template CSV' />
            </a>
          </Col>

          <Col sm='12' className='upload-container upload-container__panel'>
            <DragDrop
              uppy={uppy}
              width='100%'
              note={intl.formatMessage({ id: 'Allowed extension' }, { extensions: '(.csv)' })}
              locale={{
                strings: {
                  // Text to show on the droppable area.
                  // `%{browse}` is replaced with a link that opens the system file selection dialog.
                  dropHereOr: intl.formatMessage({ id: 'Drop here or browse' }, { browse: '%{browse}' }),
                  // Used as the label for the link that opens the system file selection dialog.
                  browse: intl.formatMessage({ id: 'Upload' })
                }
              }}
            />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

CreatePanelByFile.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowCreatePanelByFile: PropTypes.bool.isRequired,
  setIsShowCreatePanelByFile: PropTypes.func.isRequired
}

export default injectIntl(CreatePanelByFile)
