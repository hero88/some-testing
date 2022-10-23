import { useEffect, useState } from 'react'

import CurveSidebar, { CHART_TYPE } from '@src/views/monitoring/curve/Sidebar'
import CurveChart from '@src/views/monitoring/curve/CurveChart'
import ParamTable from '@src/views/monitoring/project/chart/ParamTable'

const CurvePage = () => {
  const randomColor = () => `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`

  const [params, setParams] = useState([])
  // ** Meter data
  const paramData = [
    {
      display: randomColor(),
      measuringPoint: 'Test 01',
      plant: 'P035 # HCM',
      type: CHART_TYPE.BAR,
      pattern: 'abc'
    },
    {
      display: randomColor(),
      measuringPoint: 'Test 01',
      plant: 'P035 # HCM',
      type: CHART_TYPE.BAR,
      pattern: 'abc'
    },
    {
      display: randomColor(),
      measuringPoint: 'Test 01',
      plant: 'P035 # HCM',
      type: CHART_TYPE.BAR,
      pattern: 'abc'
    }
  ]

  useEffect(() => {
    setParams(paramData)
  }, [])

  const addParam = (param) => {
    setParams(currentParams => [
      ...currentParams,
      {
        display: randomColor(),
        measuringPoint: param.title,
        plant: param.title,
        type: param.type,
        pattern: 'abc'
      }
    ])
  }

  const removeParam = (param) => {
    const currentParams = params.filter(item => param.title !== item.measuringPoint)
    setParams(currentParams)
  }

  return (
    <>
      <CurveSidebar
        addParam={addParam}
        removeParam={removeParam}
      />
      <div className='content-wrapper'>
        <div className='content-body'>
          <CurveChart/>
          <ParamTable
            paramData={params}
          />
        </div>
      </div>
    </>
  )
}

CurvePage.propTypes = {}

export default CurvePage
