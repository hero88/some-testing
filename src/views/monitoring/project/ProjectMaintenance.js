// ** Third party components
import {
  Button,
  Card,
  CardBody, Col, FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'
import { ChevronDown, Plus } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'

const ProjectMaintenance = ({ intl }) => {
  const maintenanceData = [
      {
        id: 'REE-USER-01',
        username: 'Binh Tran',
        powerBefore: '100 MWh',
        powerAfter: '101 MWh',
        date: moment().format('hh:mm:ss DD/MM/YYYY')
      },
      {
        id: 'REE-USER-02',
        username: 'Minh Tran',
        powerBefore: '101 MWh',
        powerAfter: '102 MWh',
        date: moment().add(1, 'h').format('hh:mm:ss DD/MM/YYYY')
      },
      {
        id: 'REE-USER-03',
        username: 'Tong Thanh',
        powerBefore: '102 MWh',
        powerAfter: '103 MWh',
        date: moment().add(2, 'h').format('hh:mm:ss DD/MM/YYYY')
      },
      {
        id: 'REE-USER-04',
        username: 'Long Nguyen',
        powerBefore: '103 MWh',
        powerAfter: '104 MWh',
        date: moment().add(3, 'h').format('hh:mm:ss DD/MM/YYYY')
      },
      {
        id: 'REE-USER-05',
        username: 'Hai Bui',
        powerBefore: '105 MWh',
        powerAfter: '106 MWh',
        date: moment().add(1, 'h').format('hh:mm:ss DD/MM/YYYY')
      },
      {
        id: 'REE-USER-06',
        username: 'Binh Tran',
        powerBefore: '107 MWh',
        powerAfter: '108 MWh',
        date: moment().add(4, 'h').format('hh:mm:ss DD/MM/YYYY')
      }
    ],
    columns = [
      {
        name: '#',
        cell: (row, index) => index + 1,
        sortable: true,
        minWidth: '60px',
        maxWidth: '60px'
      },
      {
        name: intl.formatMessage({ id: 'Id' }).toUpperCase(),
        cell: row => row.id,
        minWidth: '150px',
        maxWidth: '150px',
        sortable: true
      },
      {
        name: intl.formatMessage({ id: 'Username' }).toUpperCase(),
        cell: row => row.username,
        minWidth: '150px',
        maxWidth: '250px',
        sortable: true
      },
      {
        name: intl.formatMessage({ id: 'Power before' }).toUpperCase(),
        cell: row => row.powerBefore,
        minWidth: '150px',
        maxWidth: '150px',
        sortable: true
      },
      {
        name: intl.formatMessage({ id: 'Power after' }).toUpperCase(),
        cell: row => row.powerAfter,
        minWidth: '150px',
        maxWidth: '150px',
        sortable: true
      },
      {
        name: intl.formatMessage({ id: 'Date' }).toUpperCase(),
        cell: row => row.date,
        minWidth: '150px',
        maxWidth: '350px',
        sortable: true
      }
    ]

  return (
    <>
      <Card>
        <CardBody>
          <Row className='mt-2 mb-2'>
            <Col className='d-flex justify-content-end'>
              <Button.Ripple color='primary'>
                <Plus size={16}/>&nbsp;
                <FormattedMessage id='Add'/>
              </Button.Ripple>
            </Col>
          </Row>
          <Row className='mb-2'>
            <Col md={3}>
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  id='floatingMaintenanceDate'
                  placeholder={intl.formatMessage({ id: 'Maintenance date' })}
                />
                <Label for='floatingMaintenanceDate'>
                  {intl.formatMessage({ id: 'Maintenance date' })}
                </Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  id='floatingPowerBefore'
                  placeholder={intl.formatMessage({ id: 'Power before' })}
                />
                <Label for='floatingPowerBefore'>
                  {intl.formatMessage({ id: 'Power before' })}
                </Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  id='floatingPowerAfter'
                  placeholder={intl.formatMessage({ id: 'Power after' })}
                />
                <Label for='floatingPowerAfter'>
                  {intl.formatMessage({ id: 'Power after' })}
                </Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup className='form-label-group'>
                <Input
                  type='text'
                  id='floatingNextMaintenance'
                  placeholder={intl.formatMessage({ id: 'Next maintenance schedule' })}
                />
                <Label for='floatingNextMaintenance'>
                  {intl.formatMessage({ id: 'Next maintenance schedule' })}
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <h2 className='mb-2'><FormattedMessage id='Maintenance history'/></h2>
          <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable react-dataTable--meters'
            columns={columns}
            sortIcon={<ChevronDown size={10}/>}
            data={maintenanceData}
          />
        </CardBody>
      </Card>
    </>
  )
}

ProjectMaintenance.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ProjectMaintenance)
