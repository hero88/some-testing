import { useState } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'reactstrap'
import { injectIntl } from 'react-intl'
import YeildReportTable from '@src/views/report/projects/YieldReportTable'
import { renderReports } from '@src/views/report/projects'

const StatisticsReport = () => {
  const [isOpenTable, setIsOpenTable] = useState(false),
    [title, setTitle] = useState('')

  const toggleTable = (type) => {
    setTitle(type)
    setIsOpenTable(!isOpenTable)
  }

  // Reports
  const reports = [
    { label: 'Daily report', icon: require('@src/assets/images/svg/report/daily-report.svg').default },
    { label: 'Weekly report', icon: require('@src/assets/images/svg/report/weekly-report.svg').default },
    { label: 'Monthly report', icon: require('@src/assets/images/svg/report/monthly-report.svg').default },
    { label: 'Annual report', icon: require('@src/assets/images/svg/report/annual-report.svg').default },
    { label: 'Overall report', icon: require('@src/assets/images/svg/report/overall-report.svg').default }
  ]

  return (
    <>
      <Row>
        {renderReports({reports, toggleTable})}
      </Row>
      <YeildReportTable
        title={title}
        toggle={toggleTable}
        isOpen={isOpenTable}
      />
    </>
  )
}

StatisticsReport.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(StatisticsReport)
