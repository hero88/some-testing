// ** Third Party Components
import classnames from 'classnames'
import AppCollapse from '@components/app-collapse'
import { CustomInput } from 'reactstrap'
import { Activity, BarChart2 } from 'react-feather'
import PropTypes from 'prop-types'
import { CHART_TYPE } from '@constants/common'

const CurveSidebar = ({ addParam, removeParam }) => {
  const renderItems = (items) => <AppCollapse data={items}/>

  const renderCheckboxItems = (items, parentId) => (
    items.map((item, index) => {
      return (
        <CustomInput
          key={index}
          type='checkbox'
          className='custom-control-Primary'
          onClick={(e) => {
            e.target.checked ? addParam(item) : removeParam(item)
          }}
          id={`${parentId}_${item.title}`}
          label={
            <>
              {item.type === CHART_TYPE.BAR
               ? <BarChart2 size={16}/>
               : <Activity size={16}/>
              }
              &nbsp;
              {item.title}
            </>
          }
        />
      )
    })
  )

  const inverterParams = [
      { title: 'Device status', type: CHART_TYPE.BAR },
      { title: 'Daily yield', type: CHART_TYPE.LINE }
    ],
    plantParams = [
      { title: 'Daily yield of plant', type: CHART_TYPE.BAR },
      { title: 'Plant total yield', type: CHART_TYPE.BAR },
      { title: 'Plant power', type: CHART_TYPE.LINE },
      { title: 'Power/Installed power of plant', type: CHART_TYPE.LINE }
    ],
    valueData = [
      {
        title: 'P035 # HCM-RPB-PE11002061045',
        content: renderCheckboxItems(plantParams, 'PLANT-01')
      }
    ],
    inverterData = [
      {
        title: 'INV-001-001',
        content: renderCheckboxItems(inverterParams, 'INV-001-001')
      },
      {
        title: 'INV-001-002',
        content: renderCheckboxItems(inverterParams, 'INV-001-002')
      },
      {
        title: 'INV-002-003',
        content: renderCheckboxItems(inverterParams, 'INV-002-003')
      }
    ],
    titleData = [
      { title: 'Plant', content: renderItems(valueData) },
      { title: 'Inverter', content: renderItems(inverterData) }
    ],
    data = [
      {
        title: 'P035 # HCM-RPB-PE11002061045',
        content: renderItems(titleData)
      }
    ]

  return (
    <div
      className={classnames(
        'sidebar-left',
        {
          show: true
        }
      )}
    >
      <AppCollapse data={data}/>
    </div>
  )
}

CurveSidebar.propTypes = {
  addParam: PropTypes.func.isRequired,
  removeParam: PropTypes.func.isRequired
}

export default CurveSidebar
