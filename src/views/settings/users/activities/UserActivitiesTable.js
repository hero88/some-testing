import React, { useEffect, useState, useRef } from 'react'
import { ChevronDown } from 'react-feather'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import { getUsersActivities } from '../store/actions'
import CustomNoRecords from '@src/views/common/CustomNoRecords'
import SpinnerGrowColors from '@src/views/common/SpinnerGrowColors'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Table,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  UncontrolledTooltip,
  CustomInput
} from 'reactstrap'
import XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroup from 'reactstrap/es/InputGroup'
import { DISPLAY_DATE_TIME_FORMAT, ROWS_PER_PAGE_DEFAULT } from '@constants/common'

const UserActivitiesTable = ({ intl }) => {
  const tableRef = useRef()

  const dispatch = useDispatch()
  const {
    user: store,
    layout: { requestCount }
  } = useSelector((store) => store)
  const [rowsPerPage, setRowsPerPage] = useState(store?.paramsActivities?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [currentPage, setCurrentPage] = useState(store?.paramsActivities?.page || 1),
    [searchValue, setSearchValue] = useState(store?.paramsActivities?.q || ''),
    [modal, setModal] = useState(false),
    [fileName, setFileName] = useState(''),
    [fileFormat, setFileFormat] = useState('xlsx')

  const fetchUsersActivities = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      fk: '*',
      state: '*',
      ...queryParam
    }

    await dispatch(getUsersActivities(initParam))
  }

  useEffect(async () => {
    await Promise.all([fetchUsersActivities()])
  }, [])
  const columns = [
    {
      name: intl.formatMessage({ id: 'Username' }).toUpperCase(),
      cell: (row) => row.user.username,
      minWidth: '150px',
      maxWidth: '250px'
    },
    {
      name: intl.formatMessage({ id: 'Full name' }).toUpperCase(),
      cell: (row) => row.user.fullName,
      minWidth: '150px',
      maxWidth: '250px'
    },
    {
      name: intl.formatMessage({ id: 'Action' }).toUpperCase(),
      cell: (row) => row.summary,
      minWidth: '350px',
      maxWidth: '900px'
    },
    {
      name: intl.formatMessage({ id: 'Date' }).toUpperCase(),
      cell: (row) => moment(row.createDateFormatted).format(DISPLAY_DATE_TIME_FORMAT),
      minWidth: '150px',
      maxWidth: '250px'
    }
  ]
  const handlePagination = (page) => {
    fetchUsersActivities({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }
  const handlePerPage = (e) => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchUsersActivities({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
  }

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchUsersActivities({ q: value })
    }
  }

  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchUsersActivities()
    }
  }

  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
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

  const renderTableData = store.activitiesData.map((col) => {
    return (
      <tr key={col.id}>
        <td>{col.user.username}</td>
        <td>{col.user.fullName}</td>
        <td>{col.summary}</td>
        <td>{moment(col.createDateFormatted).format(DISPLAY_DATE_TIME_FORMAT)}</td>
      </tr>
    )
  })
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

  return (
    <>
      <Card className='p-2'>
        <Row className="mb-1">
          <Col sm="6">

            <InputGroup className='input-group-merge'>
              <Input
                className=""
                type="search"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={handleChangeSearch}
                onKeyPress={handleFilterKeyPress}
                placeholder={`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}`}
              />
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <InputGroupAddon addonType='append'>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <InputGroupText>
                  {/* eslint-disable-next-line react/jsx-no-undef */}
                  <IconSearch/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <UncontrolledTooltip placement="top" target={`search-input`}>
              {`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}`}
            </UncontrolledTooltip>

          </Col>
          <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1" sm="6">
            <Table innerRef={tableRef} className="table-hover-animation mt-2" hidden={true}>
              <thead>
              <tr>
                <th>{intl.formatMessage({ id: 'Username' }).toUpperCase()}</th>
                <th>{intl.formatMessage({ id: 'Full name' }).toUpperCase()}</th>
                <th>{intl.formatMessage({ id: 'Action' }).toUpperCase()}</th>
                <th>{intl.formatMessage({ id: 'Date' }).toUpperCase()}</th>
              </tr>
              </thead>
              <tbody>{renderTableData}</tbody>
            </Table>
            <div className="d-flex align-items-center">
              <Label for="sort-select">
                <FormattedMessage id="Show" />
              </Label>

              <Input
                className="dataTable-select"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={(e) => handlePerPage(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              {
                <Button.Ripple color="primary" className="add-project" onClick={() => toggleModal()}>
                  <FormattedMessage id="Export" />
                </Button.Ripple>
              }
            </div>
          </Col>
        </Row>
        <DataTable
          tableRef
          noHeader
          pagination
          paginationServer
          className="react-dataTable react-dataTable--meters"
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
          data={store.activitiesData}
          noDataComponent={store.activitiesData && requestCount === 0 ? <CustomNoRecords /> : ''}
          progressPending={requestCount > 0}
          progressComponent={<SpinnerGrowColors />}
          paginationComponent={CustomPagination}
        />
      </Card>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-dialog-centered"
        onClosed={() => setFileName('')}
      >
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
    </>
  )
}

UserActivitiesTable.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(UserActivitiesTable)
