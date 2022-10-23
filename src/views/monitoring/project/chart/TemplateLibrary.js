import {
  Badge,
  Modal,
  ModalBody,
  ModalHeader, UncontrolledTooltip
} from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import moment from 'moment'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import React from 'react'

const TemplateLibrary = ({ intl, isOpen, setIsOpen, data, viewTemplate, editTemplate, deleteTemplate }) => {
  // ** Column header
  const columns = [
    {
      name: intl.formatMessage({ id: 'Template name' }),
      selector: 'name',
      cell: (row) => <div
        className='text-primary cursor-pointer'
        onClick={() => viewTemplate(row)}
      >{row.name}
      </div>,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Modify date' }),
      selector: 'modifyDate',
      cell: (row) => (
        Number(row.modifyDate) ? moment(Number(row.modifyDate)).format('DD/MM/YYYY HH:mm:ss') : ''
      ),
      minWidth: '150px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      cell: (row) => <div className='d-flex'>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <Badge onClick={() => editTemplate(row)} id={`editBtn_${row.id}`}>
          <IconEdit />
        </Badge>
        <UncontrolledTooltip placement='top' target={`editBtn_${row.id}`}>
          <FormattedMessage id='View' />
        </UncontrolledTooltip>
        <Badge
          onClick={() => deleteTemplate(row)}
          id={`inactiveBtn_${row.id}`}
        >
          <IconDelete />
        </Badge>
        <UncontrolledTooltip placement='top' target={`inactiveBtn_${row.id}`}>
          <FormattedMessage id='Delete' />
        </UncontrolledTooltip>
      </div>,
      minWidth: '50px',
      center: true
    }
  ]

  return (
    <Modal
      isOpen={isOpen}
      className='modal-dialog-centered modal-lg'
      backdrop='static'
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>
        <FormattedMessage id='Template library' />
      </ModalHeader>
      <ModalBody>
        <DataTable
          noHeader
          className='react-dataTable'
          fixedHeader
          fixedHeaderScrollHeight='calc(100vh - 340px)'
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
          data={data}
          persistTableHead
          noDataComponent={''}
        />
      </ModalBody>
    </Modal>
  )
}

TemplateLibrary.propTypes = {
  intl: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  viewTemplate: PropTypes.func.isRequired,
  editTemplate: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired
}

export default injectIntl(TemplateLibrary)
