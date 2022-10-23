import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Calendar, ChevronDown, FilePlus } from 'react-feather'
import DataTable from 'react-data-table-component'
import Flatpickr from 'react-flatpickr'
import { useState, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  CustomInput,
  Table,
  Badge
} from 'reactstrap'
import XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
// import moment from 'moment'

export const renderAlertStatus = (status) => {
  switch (status) {
    case 'OK':
      return (
        <Badge pill color="light-info">
          <FormattedMessage id="OK" />
        </Badge>
      )
    case 'WARN':
      return (
        <Badge pill color="light-warning">
          <FormattedMessage id="WARN" />
        </Badge>
      )
    case 'ERROR':
      return (
        <Badge pill color="light-danger">
          <FormattedMessage id="ERROR" />
        </Badge>
      )
    default:
      return null
  }
}
const WarningReportTable = ({ intl, isOpen, toggle }) => {
  const tableRef = useRef()
  const [picker, setPicker] = useState(new Date()),
    [modal, setModal] = useState(false),
    [fileName, setFileName] = useState('DefaultReport'),
    [fileFormat, setFileFormat] = useState('xlsx')

  const reportData = [
      {
        iD: 'P001',
        areaCode: 'HCM',
        customerCode: 'BOO',
        projectName: 'Nhà máy nước BOO',
        power: '879',
        sellingForm: 'KH',
        totalWarning: '14',
        i1: 'CB1, L1',
        i2: 'CB1',
        i3: 'L1',
        i4: 'L1',
        i5: 'CB1',
        i6: 'L1',
        i7: 'L1',
        i8: 'L1',
        i9: 'CB1',
        i10: 'L1',
        i11: 'L1',
        i12: 'L2',
        solarWatch: 'CB2',
        gridWatch: 'CB1',
        status: 'ERROR'
      },
      {
        iD: 'P002',
        areaCode: 'ĐN',
        customerCode: 'CAD',
        projectName: 'Nhà máy sản xuất kẹo',
        power: '700',
        sellingForm: 'EVN',
        totalWarning: '4',
        i1: 'CB1, L1',
        i2: '',
        i3: '',
        i4: '',
        i5: '',
        i6: '',
        i7: '',
        i8: '',
        i9: '',
        i10: '',
        i11: '',
        i12: '',
        solarWatch: 'CB1, L1 ',
        gridWatch: '',
        status: 'WARN'
      },
      {
        iD: 'P001',
        areaCode: 'HN',
        customerCode: 'CUU',
        projectName: 'Nhà máy điện hạt nhân',
        power: '879',
        sellingForm: 'EVN',
        totalWarning: '0',
        i1: '',
        i2: '',
        i3: '',
        i4: '',
        i5: '',
        i6: '',
        i7: '',
        i8: '',
        i9: '',
        i10: '',
        i11: '',
        i12: '',
        solarWatch: '',
        gridWatch: '',
        status: 'OK'
      }
    ],
    dailyColumns = [
      {
        name: intl.formatMessage({ id: 'STT' }).toUpperCase(),
        cell: (row, index) => index + 1,
        minWidth: '50px',
        maxWidth: '50px'
      },
      {
        name: intl.formatMessage({ id: 'ID' }).toUpperCase(),
        cell: (row) => row.iD,
        minWidth: '80px',
        maxWidth: '80px'
      },
      {
        name: intl.formatMessage({ id: 'Mã vùng' }).toUpperCase(),
        cell: (row) => row.areaCode,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: intl.formatMessage({ id: 'Customer Code' }).toUpperCase(),
        cell: (row) => row.customerCode,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: intl.formatMessage({ id: 'Project name' }).toUpperCase(),
        cell: (row) => row.projectName,
        minWidth: '150px',
        maxWidth: '250px'
      },
      {
        name: intl.formatMessage({ id: 'Power (kWp)' }).toUpperCase(),
        cell: (row) => row.power,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: intl.formatMessage({ id: 'Selling Form' }).toUpperCase(),
        cell: (row) => row.sellingForm,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: intl.formatMessage({ id: 'Total Warning' }).toUpperCase(),
        cell: (row) => row.totalWarning,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I1',
        cell: (row) => row.i1,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I2',
        cell: (row) => row.i2,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I3',
        cell: (row) => row.i3,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I4',
        cell: (row) => row.i4,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I5',
        cell: (row) => row.i5,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'T6',
        cell: (row) => row.i6,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I7',
        cell: (row) => row.i7,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I8',
        cell: (row) => row.i8,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I9',
        cell: (row) => row.i9,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I10',
        cell: (row) => row.i10,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I11',
        cell: (row) => row.i11,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: 'I12',
        cell: (row) => row.i12,
        minWidth: '100px',
        maxWidth: '100px'
      },
      {
        name: intl.formatMessage({ id: 'Solar Watch' }).toUpperCase(),
        cell: (row) => row.solarWatch,
        minWidth: '200px',
        maxWidth: '200px',
        sortable: true
      },
      {
        name: intl.formatMessage({ id: 'Grid Watch' }).toUpperCase(),
        cell: (row) => row.gridWatch,
        minWidth: '200px',
        maxWidth: '200px',
        sortable: true
      },
      {
        name: intl.formatMessage({ id: 'Status' }).toUpperCase(),
        cell: (row) => renderAlertStatus(row.status),
        minWidth: '200px',
        maxWidth: '200px',
        sortable: true
      }
    ]

  const CustomPagination = () => {
    // const count = Math.ceil(store.total / rowsPerPage)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        // forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        // onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  const handleExport = () => {
    toggleModal()
    const bookType = fileFormat
    const wb = XLSX.utils.table_to_book(tableRef.current, { sheet: 'Sheet JS' })
    const wbout = XLSX.write(wb, { bookType, bookSST: true, type: 'binary' })

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }
    const file = fileName.length ? `${fileName}.${fileFormat}` : `excel-sheet.${fileFormat}`

    return FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), file)
  }

  const renderTableData = reportData.map((col, index) => {
    return (
      <tr key={col.iD}>
        <td>{index + 1}</td>
        <td>{col.iD}</td>
        <td>{col.areaCode}</td>
        <td>{col.customerCode}</td>
        <td>{col.projectName}</td>
        <td>{col.power}</td>
        <td>{col.sellingForm}</td>
        <td>{col.totalWarning}</td>
        <td>{col.i1}</td>
        <td>{col.i2}</td>
        <td>{col.i3}</td>
        <td>{col.i4}</td>
        <td>{col.i5}</td>
        <td>{col.i6}</td>
        <td>{col.i7}</td>
        <td>{col.i8}</td>
        <td>{col.i9}</td>
        <td>{col.i10}</td>
        <td>{col.i11}</td>
        <td>{col.i12}</td>
        <td>{col.solarWatch}</td>
        <td>{col.gridWatch}</td>
        <td>{col.status}</td>
      </tr>
    )
  })
  return (
    <Modal className="table-modal" scrollable isOpen={isOpen} toggle={toggle} onClosed={() => setPicker(new Date())}>
      <ModalHeader toggle={toggle}>{intl.formatMessage({ id: 'Warning Report' }).toUpperCase()}</ModalHeader>
      <ModalBody>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex justify-content-start">
            <Button.Ripple className="btn-icon" color="flat-primary">
              <Calendar size={16} />
            </Button.Ripple>
            <Flatpickr
              value={picker}
              onChange={(date) => setPicker(date)}
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y'
              }}
              className="form-control w-100"
            />
          </div>
          <Button.Ripple color="primary" outline onClick={() => toggleModal()}>
            <FilePlus size={16} />
            <FormattedMessage id="Export" />
          </Button.Ripple>
        </div>
        <Row>
          <Col md={12} style={{ textAlign: 'center' }}>
            {intl.formatMessage({ id: 'Inverter Warning Report' }).toUpperCase()}
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable react-dataTable--meters mt-2"
          columns={dailyColumns}
          sortIcon={<ChevronDown size={10} />}
          data={reportData}
          paginationComponent={CustomPagination}
        />
        <Table innerRef={tableRef} className="table-hover-animation mt-2" hidden={true}>
          <thead>
            <tr>
              <th> {intl.formatMessage({ id: 'Inverter Warning Report' }).toUpperCase()}</th>
            </tr>
            <tr>
              <th>{intl.formatMessage({ id: 'STT' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'ID' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Area Code' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Customer Code' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Project name' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Power (kWp)' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Selling Form' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Total Warning' }).toUpperCase()}</th>
              <th>I1</th>
              <th>I2</th>
              <th>I3</th>
              <th>I4</th>
              <th>I5</th>
              <th>I6</th>
              <th>I7</th>
              <th>I8</th>
              <th>I9</th>
              <th>I10</th>
              <th>I11</th>
              <th>I12</th>
              <th>{intl.formatMessage({ id: 'Solar Watch' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Grid Watch' }).toUpperCase()}</th>
              <th>{intl.formatMessage({ id: 'Status' }).toUpperCase()}</th>
            </tr>
          </thead>
          <tbody>{renderTableData}</tbody>
        </Table>
      </ModalBody>
      <Modal isOpen={modal} toggle={() => toggleModal()} className="modal-dialog-centered">
        <ModalHeader toggle={() => toggleModal()}>{intl.formatMessage({ id: 'Export Excel' })}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={intl.formatMessage({ id: 'Enter file Name' })}
            />
          </FormGroup>
          <FormGroup></FormGroup>
          <FormGroup>
            <CustomInput
              type="select"
              id="selectFileFormat"
              name="customSelect"
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
            >
              <option>xlsx</option>
            </CustomInput>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleExport()}>
            {intl.formatMessage({ id: 'Export' })}
          </Button>
          <Button color="flat-danger" onClick={() => toggleModal()}>
            {intl.formatMessage({ id: 'Cancel' })}
          </Button>
        </ModalFooter>
      </Modal>
    </Modal>
  )
}

WarningReportTable.propTypes = {
  intl: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

export default injectIntl(WarningReportTable)
