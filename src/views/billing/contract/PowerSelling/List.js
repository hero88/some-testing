import { array, bool, func, object, string } from 'prop-types'
import React, { useContext } from 'react'
import { Plus } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import Table from '@src/views/common/table/CustomDataTable'
import { Badge, Button, Col, Row, UncontrolledTooltip } from 'reactstrap'
import moment from 'moment'
import { DISPLAY_DATE_FORMAT, ROUTER_URL } from '@src/utility/constants'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { useHistory, useParams } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

function PowerSelling({ disabled, intl, data, onDelete }) {
  const { id } = useParams()
  const ability = useContext(AbilityContext)

  const history = useHistory()

  const handleDeleteContract = (contractItem) => () => {
    onDelete?.(contractItem)
  }

  const handleRedirectToUpdateContract = (contractItem, allowUpdate = null) => {
    return () => {
      history.push({
        pathname: ROUTER_URL.BILLING_PROJECT_UPDATE_CONTRACT_POWER_SELLING.replace(':projectId', id).replace(
          ':id',
          contractItem.id
        ),
        state: { allowUpdate }
      })
    }
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'No.' }),
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Contract number' }),
      selector: 'code',

      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Signed date' }),
      selector: 'startDate',
      cell: (row) => <span>{moment(row.startDate).format(DISPLAY_DATE_FORMAT)}</span>
    },
    {
      name: intl.formatMessage({ id: 'Customer Code' }),
      selector: 'customerCode',

      cell: (row) => <span>{row?.customer?.code}</span>
    },
    {
      name: intl.formatMessage({ id: 'Customer Company' }),
      selector: 'companyName',

      minWidth: '300px',
      cell: (row) => <span>{row?.customer?.fullName}</span>
    },
    {
      name: intl.formatMessage({ id: 'billing-customer-list-taxCode' }),
      selector: 'taxCode',

      cell: (row) => <span>{row?.customer?.taxCode}</span>
    },
    {
      name: intl.formatMessage({ id: 'Address' }),
      selector: 'address',

      minWidth: '350px',
      cell: (row) => {
        return (
          <>
            <div id={`view_name${row.id}`}>
              {row?.customer?.address?.length > 150
                ? `${row?.customer?.address?.slice(0, 150)}...`
                : row?.customer?.address}
            </div>
            {row?.customer?.address?.length > 150 && (
              <UncontrolledTooltip placement="auto" target={`view_name${row.id}`}>
                <FormattedMessage id={row.customer.address} />
              </UncontrolledTooltip>
            )}
          </>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',
      center: true,

      cell: (row) => (
        <>
          {' '}
          {ability.can(USER_ACTION.DETAIL, USER_FEATURE.PROJECT) && (
            <Badge>
              <IconView id={`viewBtn_${row.id}`} onClick={handleRedirectToUpdateContract(row)} />
            </Badge>
          )}
          {!disabled && [USER_ACTION.EDIT, USER_ACTION.CREATE].some((item) => ability.can(item, USER_FEATURE.PROJECT)) && (
            <>
              <Badge>
                <IconEdit id={`editBtn_${row.id}`} onClick={handleRedirectToUpdateContract(row, true)} />
              </Badge>
              <Badge onClick={handleDeleteContract(row)}>
                <IconDelete id={`deleteBtn_${row.id}`} />
              </Badge>
            </>
          )}
        </>
      )
    }
  ]

  const handleRedirectToCreateContract = () => {
    history.push(ROUTER_URL.BILLING_PROJECT_CREATE_CONTRACT_POWER_SELLING.replace(':projectId', id))
  }
  return (
    <>
      {' '}
      <Row className="mb-2 ">
        <Col className="d-flex justify-content-between align-items-end mb-2" xs={12}>
          <h4 className="typo-section">
            <FormattedMessage id="Power Selling Agreement" />
          </h4>

          {[USER_ACTION.EDIT, USER_ACTION.CREATE].some((item) => ability.can(item, USER_FEATURE.PROJECT)) && (
            <Button.Ripple
              color="primary"
              className="add-project add-contact-button"
              onClick={handleRedirectToCreateContract}
              hidden={disabled}
            >
              <Plus className="mr-1" /> <FormattedMessage id="Add power selling contract" />
            </Button.Ripple>
          )}
        </Col>
        <Col xs={12}>
          <Table tableId="project" columns={columns} data={data} pagination={null} />
        </Col>
      </Row>
    </>
  )
}

PowerSelling.propTypes = {
  intl: object,
  disabled: bool,
  projectId: string,
  data: array,
  onDelete: func
}

export default injectIntl(PowerSelling)
