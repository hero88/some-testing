import { object } from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import Table from '@src/views/common/table/CustomDataTable'
import { deleteManualInputIndex, getInputClockIndex } from './store/actions'
import { useContext, useEffect } from 'react'
import {
  DISPLAY_DATE_FORMAT,
  ROUTER_URL,
  ROWS_PER_PAGE_DEFAULT,
  SET_INPUT_CLOCK_INDEX_PARAMS
} from '@src/utility/constants'
import moment from 'moment'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
// import { showToast } from '@src/utility/Utils'
import PageHeader from './PageHeader'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const MySweetAlert = withReactContent(SweetAlert)

const ClockMetric = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch()
  const { data, params, total } = useSelector((state) => state.billingInputClockIndex)

  const {
    layout: { skin }
  } = useSelector((state) => state)
  const history = useHistory()
  const { pagination = {}, filterValue = {} } = params
  const fetchInputClockIndex = (payload) => {
    dispatch(
      getInputClockIndex({
        ...params,
        ...payload
      })
    )
  }
  useEffect(() => {
    const initParams = {
      pagination: {
        rowsPerPage: ROWS_PER_PAGE_DEFAULT,
        currentPage: 1
      }
    }
    fetchInputClockIndex(initParams)
    return () => {
      dispatch({
        type: SET_INPUT_CLOCK_INDEX_PARAMS,
        payload: initParams
      })
    }
  }, [])

  const handleChangePage = (e) => {
    fetchInputClockIndex({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchInputClockIndex({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleFilter = (value) => {
    fetchInputClockIndex({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      filterValue: value
    })
  }

  const handleDeleteItem = (row) => () => {
    // if (row.state !== 'PENDING_NEW') {
    //   showToast('error', <FormattedMessage id="Cannot delete index that not in new state" />)
    //   return
    // }
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete operating customer title' }),
      text: intl.formatMessage({ id: 'Are you sure to delete this manual input index?' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
      customClass: {
        popup: classNames({
          'sweet-alert-popup--dark': skin === 'dark',
          'sweet-popup': true
        }),
        header: 'sweet-title',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1',
        actions: 'sweet-actions',
        content: 'sweet-content'
      },
      buttonsStyling: false
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        dispatch(
          deleteManualInputIndex({
            id: row.id,
            callback: () => {
              fetchInputClockIndex()
            }
          })
        )
      }
    })
  }
  const handleRedirectToViewPage = (id) => () => {
    if (id) history.push(`${ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK}/${id}`)
  }

  const handleRedirectToUpdatePage = (id) => () => {
    if (id) {
      history.push({
        pathname: `${ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK}/${id}`,
        state: {
          allowUpdate: true
        }
      })
    }
  }
  const columns = [
    {
      name: intl.formatMessage({ id: 'Month' }),
      cell: (row) => `${row.month < 10 ? `0${row.month}` : row.month}/${row.year}`
    },
    {
      name: intl.formatMessage({ id: 'Cycle' }),
      cell: (row) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        `${moment.utc(row.startDate).format(DISPLAY_DATE_FORMAT)} - ${moment
          .utc(row.endDate)
          .format(DISPLAY_DATE_FORMAT)}`
    },
    {
      name: intl.formatMessage({ id: 'Project' }),
      selector: 'projectName'
    },
    {
      name: intl.formatMessage({ id: 'Customers' }),
      selector: 'customerName'
    },
    {
      name: intl.formatMessage({ id: 'Alert status' }),
      selector: 'state',
      cell: () => <FormattedMessage id="Pending new" />
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',

      cell: (row) => (
        <>
          {ability.can(USER_ACTION.DETAIL, USER_FEATURE.BILL_PARAMS) && (
            <>
              <Badge onClick={handleRedirectToViewPage(row.id)}>
                <IconView id={`editBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                <FormattedMessage id="View Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.EDIT, USER_FEATURE.BILL_PARAMS) && (
            <>
              <Badge onClick={handleRedirectToUpdatePage(row.id)}>
                <IconEdit id={`updateBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`updateBtn_${row.id}`}>
                <FormattedMessage id="Update Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.DELETE, USER_FEATURE.BILL_PARAMS) && (
            <>
              <Badge>
                <IconDelete onClick={handleDeleteItem(row)} id={`deleteBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`deleteBtn_${row.id}`}>
                <FormattedMessage id="Delete Project" />
              </UncontrolledTooltip>
            </>
          )}
        </>
      ),
      center: true
    }
  ]

  return (
    <>
      <Row>
        <Col sm="12">
          <PageHeader onFilter={handleFilter} filterValue={filterValue} />

          <Table
            tableId="operation-unit"
            columns={columns}
            data={data}
            total={total}
            onPageChange={handleChangePage}
            onPerPageChange={handlePerPageChange}
            isSearching={JSON.stringify(filterValue) !== '{}'}
            {...pagination}
          />
        </Col>
      </Row>
    </>
  )
}

ClockMetric.propTypes = {
  intl: object.isRequired
}

export default injectIntl(ClockMetric)
