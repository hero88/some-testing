import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown } from 'react-feather'
import { Card } from 'reactstrap'
import React from 'react'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { changeChartType, removeChartParam } from '@src/views/monitoring/projects/store/actions'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete-2.svg'
import { LightTooltip } from '@src/views/common/LightToolTip'
import { CHART_TYPE, STATISTICAL_PATTERN_TYPE } from '@constants/common'
import IconButton from '@mui/material/IconButton'

const ParamTable = ({ intl }) => {
  const dispatch = useDispatch()
  const { customerProject: { chart } } = useSelector(state => state)

  // Type option:
  const typeOptions = [
    { label: 'Bar', value: CHART_TYPE.BAR },
    { label: 'Line', value: CHART_TYPE.LINE }
  ]

  // Pattern options
  const patternOptions = [
    { label: 'Sample', value: STATISTICAL_PATTERN_TYPE.SAMPLE },
    { label: 'Difference', value: STATISTICAL_PATTERN_TYPE.DIFFERENCE }
  ]

  // ** Column header
  const columns = [
    {
      name: intl.formatMessage({ id: 'Display' }),
      // eslint-disable-next-line react/display-name
      cell: row => <span
        style={{
          backgroundColor: row.display,
          width: '20px',
          height: '20px',
          borderRadius: '50%'
        }}
      />,
      minWidth: '100px',
      maxWidth: '100px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Measure point' }),
      selector: 'measuringPoint',
      minWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Template' }),
      selector: 'templateType',
      cell: (row) => <Select
        className='react-select'
        classNamePrefix='select'
        menuPlacement='auto'
        menuPortalTarget={document.querySelector('body')}
        theme={selectThemeColors}
        defaultValue={typeOptions[0]}
        value={typeOptions.find(option => option.value === row.type)}
        onChange={(option) => {
          dispatch(changeChartType({
            ...row,
            type: option.value
          }))
        }}
        name='templateType'
        id='templateType'
        options={typeOptions}
        placeholder={intl.formatMessage({ id: 'Select type' })}
        formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
      />,
      minWidth: '200px',
      maxWidth: '200px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'Statistical pattern' }),
      selector: 'pattern',
      cell: (row) => <Select
        className='react-select'
        classNamePrefix='select'
        menuPlacement='auto'
        menuPortalTarget={document.querySelector('body')}
        theme={selectThemeColors}
        defaultValue={patternOptions[0]}
        value={patternOptions.find(option => option.value === row.pattern)}
        onChange={(option) => {
          dispatch(changeChartType({
            ...row,
            pattern: option.value
          }))
        }}
        name='templateType'
        id='templateType'
        options={patternOptions}
        placeholder={intl.formatMessage({ id: 'Select type' })}
        formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
      />,
      minWidth: '200px',
      maxWidth: '200px',
      center: true
    },
    {
      name: '',
      // eslint-disable-next-line react/display-name
      cell: (row) => <>
        <LightTooltip
          title={intl.formatMessage({ id: 'Delete' })}
          placement='top'
          arrow
        >
          <IconButton
            className='px-0'
            onClick={() => {
              dispatch(removeChartParam(row))
            }}
          >
            <IconDelete />
          </IconButton>
        </LightTooltip>
      </>,
      minWidth: '100px',
      maxWidth: '100px',
      center: true
    }
  ]

  return (
    <>
      <Card>
        <DataTable
          noHeader
          responsive
          className='react-dataTable react-dataTable--charts'
          fixedHeader
          fixedHeaderScrollHeight='240px'
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
          data={chart.paramData}
          persistTableHead
          noDataComponent={''}
        />
      </Card>
    </>
  )
}

ParamTable.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ParamTable)
