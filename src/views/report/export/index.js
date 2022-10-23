import { Badge, Card, CardBody, CardText, Col, CustomInput, Label, Row } from 'reactstrap'
import { ChevronDown } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import Flatpickr from 'react-flatpickr'
import { useState } from 'react'

import Breadcrumbs from '@src/views/common/breadcrumbs'

const ExportReport = ({ intl }) => {
  const [picker, setPicker] = useState(new Date()),
    [basic, setBasic] = useState(new Date())

  // Checkbox data
  const checkboxData = [
      { title: 'Project report', checked: true },
      { title: 'Inverter / Yield report', checked: false },
      { title: 'Meter / Yield report', checked: true },
      { title: 'Warning report', checked: true },
      { title: 'Daily report', checked: false },
      { title: 'Weekly report', checked: true },
      { title: 'Monthly report', checked: true },
      { title: 'Annual report', checked: true },
      { title: 'Overall report', checked: true },
      { title: 'Plant report', checked: true }
    ],
    checkboxColumns = [
      {
        selector: 'title',
        minWidth: '250px',
        maxWidth: '250px'
      },
      {
        // eslint-disable-next-line react/display-name
        cell: (row, index) => <CustomInput
          key={`${row.title}_${index}`}
          type='checkbox'
          className='custom-control-Primary'
          onClick={(e) => {
            console.log('Event gi day =====', e.target.checked)
          }}
          id={`${row.title}_${index}`}
          // checked={row.checked}
        />,
        minWidth: '50px',
        maxWidth: '50px'
      }
    ]
  // ** data
  const paramData = [
    {
      measureId: 'SC0002_SX',
      meterId: '18700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 1
    },
    {
      measureId: 'SC0003_SX',
      meterId: '28700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 0,
      day2: 0
    },
    {
      measureId: 'SC0004_SX',
      meterId: '38700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 0
    },
    {
      measureId: 'SC0004_SX',
      meterId: '38700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 0
    },
    {
      measureId: 'SC0004_SX',
      meterId: '38700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 0
    },
    {
      measureId: 'SC0004_SX',
      meterId: '38700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 0
    },
    {
      measureId: 'SC0004_SX',
      meterId: '38700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 0
    },
    {
      measureId: 'SC0004_SX',
      meterId: '38700039',
      manufacturer: 'VINASINO',
      meterType: 'ĐK 3 pha',
      day1: 1,
      day2: 0
    }
  ]
  // ** Column header
  const columns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      sortable: true,
      minWidth: '60px',
      maxWidth: '60px'
    },
    {
      name: intl.formatMessage({ id: 'Measure ID' }).toUpperCase(),
      // eslint-disable-next-line react/display-name
      cell: row => row.measureId,
      minWidth: '150px',
      maxWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Meter ID' }).toUpperCase(),
      selector: 'meterId',
      minWidth: '150px',
      maxWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Manufacturer' }).toUpperCase(),
      selector: 'manufacturer',
      minWidth: '150px',
      maxWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Meter type' }).toUpperCase(),
      selector: 'meterType',
      minWidth: '150px',
      maxWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Day 1' }).toUpperCase(),
      // eslint-disable-next-line react/display-name
      cell: row => <Badge color={`${row.day1 ? 'success' : 'danger'}`} pill>
        {row.day1}
      </Badge>,
      minWidth: '150px',
      maxWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Day 2' }).toUpperCase(),
      // eslint-disable-next-line react/display-name
      cell: row => <Badge color={`${row.day1 ? 'success' : 'danger'}`} pill>
        {row.day1}
      </Badge>,
      minWidth: '150px',
      maxWidth: '150px',
      sortable: true
    }
  ]

  const formatTypes = ['.xls', '.xlsx', '.csv', '.pdf']

  const renderFormatTypes = () => formatTypes.map((type, index) => (
    <CustomInput
      key={`type_${index}`}
      type='checkbox'
      className='custom-control-Primary'
      onClick={(e) => {
        console.log('Event gi day =====', e.target.checked)
      }}
      id={`type_${index}`}
      label={type}
    />
  ))

  return (
    <>
      <Breadcrumbs
        breadCrumbTitle={'Export'}
        breadCrumbParent={'Report'}
        breadCrumbActive={'Export'}
        handleClickBreadcrumb={() => console.log('Breadcrumb was clicked')}
      />
      <Row>
        <Col md={3}>
          <Card>
            <DataTable
              noHeader
              noTableHead
              responsive
              className='react-dataTable react-dataTable--meters'
              columns={checkboxColumns}
              data={checkboxData}
            />
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <DataTable
              noHeader
              pagination
              paginationServer
              className='react-dataTable react-dataTable--meters'
              columns={columns}
              sortIcon={<ChevronDown size={10}/>}
              data={paramData}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card>
            <CardBody>
              <CardText><FormattedMessage id='Export reports'/></CardText>
              <CardText><FormattedMessage id='Format:'/></CardText>
              {renderFormatTypes()}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <CardText><FormattedMessage id='Auto export to'/></CardText>
              <CustomInput
                type='checkbox'
                className='custom-control-primary'
                onClick={(e) => {
                  console.log('Event gi day =====', e.target.checked)
                }}
                id={`type_gcp`}
                inline
                label={
                  <>
                    <img
                      src={require('@src/assets/images/svg/google-icon.svg').default}
                      alt='Google logo'
                      className='avatar-24'
                    />
                    &nbsp;&nbsp;
                    <FormattedMessage id='Google cloud storage'/>
                  </>
                }
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <Label id='timepicker'>Time</Label>
              <Flatpickr
                className='form-control'
                value={basic}
                id='timepicker'
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: 'H:i',
                  time_24hr: true
                }}
                onChange={date => setBasic(date)}
              />
              <Label id='datepicker'>Frequency</Label>
              <Flatpickr
                value={picker}
                onChange={date => setPicker(date)}
                options={{
                  dateFormat: 'd/m/Y'
                }}
                className='form-control'
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

ExportReport.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ExportReport)
