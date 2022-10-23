import { Col } from 'reactstrap'
import React, {
  useEffect,
  useState
} from 'react'
import {
  Tree,
  TreeNode
} from 'react-organizational-chart'

import transformers from '@src/assets/images/singleline/transformers.svg'
import PVSmall from '@src/assets/images/singleline/PV-small.svg'
import solarClock from '@src/assets/images/singleline/solar-clock.svg'
import MCCBACBimg from '@src/assets/images/singleline/MCCBACB.svg'
import arrowSaleBuy from '@src/assets/images/singleline/arrow-sale-buy.svg'
import inverterSmall from '@src/assets/images/singleline/inverter-small.svg'
import TransformersCard from './TransformersCard'
import SolarClock from './SolarClock'
import MCCBACB from './MCCBACB'
import GridPV from './GridPV'
import Inverter from './Inverter'
import InverterStatus from './InverterStatus'
import Card from 'reactstrap/es/Card'
import CardHeader from 'reactstrap/es/CardHeader'
import CardBody from 'reactstrap/es/CardBody'
import NoteItem from './NoteItem'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  DEVICE_STATUS,
  DEVICE_TYPE,
  METER_TYPE,
  PROJECT_BUSINESS_MODEL
} from '@constants/project'
import { numberWithCommas } from '@utils'
import arrowRun from '@src/assets/images/singleline/arrow-down-run.svg'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import PropTypes from 'prop-types'
import { STATE } from '@constants/common'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import { useQuery } from '@hooks/useQuery'
import _orderBy from 'lodash/orderBy'
import _isNumber from 'lodash/isNumber'

const renderClassNameStatus = status => {
  switch (status) {
    case DEVICE_STATUS.WARNING:
      return 'text-warning'
    case DEVICE_STATUS.DANGER:
    case DEVICE_STATUS.INACTIVE:
      return 'text-danger'
    case DEVICE_STATUS.ACTIVE:
    default:
      return ''
  }
}

const renderClassNameInverter = status => {
  switch (status) {
    case DEVICE_STATUS.WARNING:
      return 'warning'
    case DEVICE_STATUS.DANGER:
    case DEVICE_STATUS.INACTIVE:
      return 'off'
    case DEVICE_STATUS.ACTIVE:
    default:
      return ''
  }
}

const SingleLine = ({ intl }) => {
  const {
      customerProject: { selectedProject }
    } = useSelector((state) => state),
    dispatch = useDispatch(),
    query = useQuery(),
    projectId = query.get('projectId')

  const [inverters1, setInverters1] = useState([]),
    [inverters2, setInverters2] = useState([]),
    [gridMeters1, setGridMeters1] = useState([]),
    [gridMeters2, setGridMeters2] = useState([]),
    [solarMeters1, setSolarMeters1] = useState([]),
    [solarMeters2, setSolarMeters2] = useState([]),
    [isShowLegend, setIsShowLegend] = useState(false)

  useEffect(async () => {
    if (projectId) {
      dispatch(
        getProjectById({
          id: projectId,
          fk: JSON.stringify(['users', 'devices', 'contacts'])
        })
      )
    }
  }, [])

  useEffect(() => {
    if (selectedProject && selectedProject?.devices?.length > 0) {
      const tempInverters1 = []
      const tempInverters2 = []
      const tempGridMeters1 = []
      const tempGridMeters2 = []
      const tempSolarMeters1 = []
      const tempSolarMeters2 = []
      const dtuIds = []

      selectedProject.devices.forEach((device) => {
        if (device.dtuId && !dtuIds.some(item => item === device.dtuId)) {
          dtuIds.push(device.dtuId)
        }

        if (device.typeDevice === DEVICE_TYPE.INVERTER && device.state === STATE.ACTIVE) {
          if (device.dtuId === dtuIds[0]) {
            tempInverters1.push(device)
          } else if (device.dtuId === dtuIds[1]) {
            tempInverters2.push(device)
          }
        }

        if (device.typeDevice === DEVICE_TYPE.METER && device.state === STATE.ACTIVE) {
          if (device.meterNetworkPlace === METER_TYPE.SOLAR) {
            if (device.dtuId === dtuIds[0]) {
              tempSolarMeters1.push(device)
            } else if (device.dtuId === dtuIds[1]) {
              tempSolarMeters2.push(device)
            }
          }

          if (device.meterNetworkPlace === METER_TYPE.GRID) {
            if (device.dtuId === dtuIds[0]) {
              tempGridMeters1.push(device)
            } else if (device.dtuId === dtuIds[1]) {
              tempGridMeters2.push(device)
            }
          }
        }
      })

      setInverters1(_orderBy(tempInverters1, inv => inv.name, 'asc'))
      setInverters2(_orderBy(tempInverters2, inv => inv.name, 'asc'))
      setGridMeters1(_orderBy(tempGridMeters1, inv => inv.name, 'asc'))
      setGridMeters2(_orderBy(tempGridMeters2, inv => inv.name, 'asc'))
      setSolarMeters1(_orderBy(tempSolarMeters1, inv => inv.name, 'asc'))
      setSolarMeters2(_orderBy(tempSolarMeters2, inv => inv.name, 'asc'))
    }
  }, [selectedProject])

  const renderInverters = (inverters) => {
    return (
      inverters.map((inverter, index) => {
        return (
          <TreeNode
            key={inverter.id}
            label={
              <InverterStatus
                isShowMCCBACB={inverter.status !== DEVICE_STATUS.INACTIVE && inverter.inverterOff === 'NO'}
                isShowMCCBACBOff={inverter.status === DEVICE_STATUS.INACTIVE || inverter.inverterOff === 'YES'}
                isShowArrowRun={inverter.status === DEVICE_STATUS.ACTIVE && inverter.inverterOff === 'NO'}
                isShowArrowWarning={inverter.status === DEVICE_STATUS.WARNING}
                isShowArrowOff={
                  inverter.status === DEVICE_STATUS.INACTIVE
                  || inverter.status === DEVICE_STATUS.DANGER
                  || inverter.inverterOff === 'YES'
                }
                isShowInverterMultiline
                inverter1={`${numberWithCommas(inverter.todayActivePower / 1000) || 0} kW`}
                inverter2={`${numberWithCommas(inverter.dailyYield / 1000) || 0} kWh`}
                inverterSingle1={
                  `${numberWithCommas(inverter.phaseAVoltage || 0, 0)} 
                  | ${numberWithCommas(inverter.phaseBVoltage || 0, 0)}
                  | ${numberWithCommas(inverter.phaseCVoltage || 0, 0)} V`
                }
                inverterSingle2={
                  `${numberWithCommas(inverter.phaseACurrent || 0)} 
                  | ${numberWithCommas(inverter.phaseBCurrent || 0)}
                  | ${numberWithCommas(inverter.phaseCCurrent || 0)} A`
                }
                status={inverter.inverterOff === 'YES' || inverter.status === DEVICE_STATUS.INACTIVE
                  ? 'OFF'
                  : 'RUN'}
                classNameInverter1={renderClassNameInverter(inverter.inverterOff === 'YES'
                  ? DEVICE_STATUS.INACTIVE
                  : inverter.status)}
                classNameInverter2={renderClassNameInverter(inverter.inverterOff === 'YES'
                  ? DEVICE_STATUS.INACTIVE
                  : inverter.status)}
                classNameStatus={renderClassNameStatus(inverter.inverterOff === 'YES'
                  ? DEVICE_STATUS.INACTIVE
                  : inverter.status)}
                numberOrder={index + 1}
              />
            }
          >
            <TreeNode label={<Inverter inverter={inverter}/>}>
              <TreeNode label={<GridPV textPV={`${numberWithCommas(inverter.totalDcPower / 1000 || 0)} kWp`}/>}/>
            </TreeNode>
          </TreeNode>
        )
      })
    )
  }

  return (
    <div className='row single-line'>
      <Card className='sidebar-project'>
        <span className='project-name'>{selectedProject?.name}</span>
        <aside className='level1'>
          <span>{selectedProject?.code}</span>
          <span>{selectedProject?.electricityCode}</span>
          <span>{selectedProject?.electricityName}</span>
        </aside>
        <aside className='level2'>
              <span>{_isNumber(selectedProject?.wattageDC)
                ? numberWithCommas(selectedProject.wattageDC / 1000)
                : '-'} kWp</span>
          <span><FormattedMessage id='DC power'/></span>
        </aside>
        <aside className='level2'>
              <span>{_isNumber(selectedProject?.wattageAC)
                ? numberWithCommas(selectedProject.wattageAC / 1000)
                : '-'} kW</span>
          <span><FormattedMessage id='AC power'/></span>
        </aside>
        <aside className='level2'>
              <span className='percent'>
                {
                  selectedProject?.wattageDC > 0 && _isNumber(selectedProject?.wattageAC)
                    ? numberWithCommas((
                      selectedProject?.wattageAC / selectedProject?.wattageDC
                    ) * 100)
                    : '-'
                }%
              </span>
          <span><FormattedMessage id='AC/DC ratio'/></span>
        </aside>
      </Card>
      <Card className='note'>
        <CardHeader className='d-flex justify-content-start'>
          <img
            id='singleLineArrowImage'
            className='img-fluid mr-1 zindex-1 cursor-pointer'
            src={arrowRun}
            alt='arrowRun'
            onClick={() => {
              setIsShowLegend(!isShowLegend)
            }}
          />
          {intl.formatMessage({ id: 'Legend' })}
        </CardHeader>
        {isShowLegend && (
          <CardBody>
            <NoteItem
              imgSrc={transformers}
              textNote={intl.formatMessage({ id: 'Transformer' })}
            />
            <NoteItem
              imgSrc={inverterSmall}
              textNote={intl.formatMessage({ id: 'Inverter' })}
            />
            <NoteItem
              imgSrc={solarClock}
              textNote={intl.formatMessage({ id: 'Meter' })}
            />
            <NoteItem
              imgSrc={MCCBACBimg}
              textNote='MCCB/ACB'
            />
            <NoteItem
              imgSrc={PVSmall}
              textNote='PV'
            />
            <NoteItem
              imgSrc={arrowSaleBuy}
              textNote={intl.formatMessage({ id: 'Sell buy energy direction' })}
            />
          </CardBody>
        )}
      </Card>
      <Col md={12}>
        <Tree
          lineWidth={'1px'}
          lineColor={'#00BCD4'}
          lineBorderRadius={'4px'}
          label={
            <TransformersCard
              leftText={`${selectedProject?.substationPower / 1000 || 0} KVA`}
              rightText={`${selectedProject?.eStation2 / 1000 || 0} KVA`}
              imgSrc={transformers}
              className2Clock={
                inverters2.length > 0
                  ? 'two-clock'
                  : ''
              }
              isShow2ndTransformer={selectedProject?.eStation2 > 0 && inverters2?.length > 0}
              isShow2ndGroup={inverters2?.length > 0}
              connectedPoint={selectedProject?.connectedPoint}
            />
          }
        >
          {/* Grid1, Solar1 */}
          <TreeNode
            label={
              <MCCBACB
                isShowNode={gridMeters1.length > 0}
                title={`${gridMeters1?.[0]?.name || ''}`}
                isShowRightLine
                className='grid1'
                singleNo1={
                  `${numberWithCommas(gridMeters1?.[0]?.phaseAVoltage || 0, 0)} 
                  | ${numberWithCommas(gridMeters1?.[0]?.phaseBVoltage || 0, 0)}
                  | ${numberWithCommas(gridMeters1?.[0]?.phaseCVoltage || 0, 0)} V`
                }
                singleNo2={
                  `${numberWithCommas(gridMeters1?.[0]?.phaseACurrent || 0)} 
                  | ${numberWithCommas(gridMeters1?.[0]?.phaseBCurrent || 0)}
                  | ${numberWithCommas(gridMeters1?.[0]?.phaseCCurrent || 0)} A`
                }
                bottomText={`${gridMeters1?.[0]?.totalPowerFactor || 0}`}
                totalActiveEnergy={
                  `${numberWithCommas((gridMeters1?.[0]?.dailyYield / 1000)) || 0}`
                }
                totalActiveEnergySub={
                  `${numberWithCommas((gridMeters1?.[0]?.totalActiveEnergySub / 1000)) || 0}`
                }
                realActivePower3SubphaseTotal={
                  `${numberWithCommas((gridMeters1?.[0]?.todayActivePower / 1000)) || 0}`
                }
              />
            }
          >
            {/* Solar meter */}
            <TreeNode
              label={
                <SolarClock
                  isShowNode={solarMeters1.length > 0}
                  isSolarMeter
                  imgClock
                  isShowArrowLeft
                  isShowNumberClockRight
                  isShowNumberSingleLeft
                  singleNo1={
                    `${numberWithCommas(solarMeters1?.[0]?.phaseAVoltage || 0, 0)} 
                  | ${numberWithCommas(solarMeters1?.[0]?.phaseBVoltage || 0, 0)}
                  | ${numberWithCommas(solarMeters1?.[0]?.phaseCVoltage || 0, 0)} V`
                  }
                  singleNo2={
                    `${solarMeters1?.[0]?.phaseACurrent || 0} 
                  | ${solarMeters1?.[0]?.phaseBCurrent || 0}
                  | ${solarMeters1?.[0]?.phaseCCurrent || 0} A`
                  }
                  title={`${solarMeters1?.[0]?.name || ''}`}
                  bottomText={`${solarMeters1?.[0]?.totalPowerFactor || 0}`}
                  className='mr1'
                  classNameGroup='solar'
                  isShowCustomer={selectedProject?.type === PROJECT_BUSINESS_MODEL.CUSTOMER.value
                  || selectedProject?.type === PROJECT_BUSINESS_MODEL.CUSTOMER_INDUSTRIAL_AREA.value
                  || selectedProject?.type === PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.value
                  }
                  textCustomer='KH'
                  totalActiveEnergy={
                    `${numberWithCommas((solarMeters1?.[0]?.dailyYield / 1000)) || 0}`
                  }
                  totalActiveEnergySub={
                    `${numberWithCommas((solarMeters1?.[0]?.totalActiveEnergySub / 1000)) || 0}`
                  }
                  realActivePower3SubphaseTotal={
                    `${numberWithCommas((solarMeters1?.[0]?.todayActivePower / 1000)) || 0}`
                  }
                />
              }
            >
              {/* Render group 1 inverters */}
              {inverters1.length > 0 && renderInverters(inverters1)}
            </TreeNode>
          </TreeNode>

          {/* Grid2, Solar2 */}
          {selectedProject?.eStation2 > 0 && inverters2.length > 0 && (
            <TreeNode
              label={
                <MCCBACB
                  isShowNode={gridMeters2.length > 0}
                  title={`${gridMeters2?.[0]?.name || ''}`}
                  isShowRightLine
                  className='grid1'
                  classNameOther='other'
                  singleNo1={
                    `${numberWithCommas(gridMeters2?.[0]?.phaseAVoltage || 0, 0)}
                  |${numberWithCommas(gridMeters2?.[0]?.phaseBVoltage || 0, 0)}
                  |${numberWithCommas(gridMeters2?.[0]?.phaseCVoltage || 0, 0)} V`
                  }
                  singleNo2={
                    `${gridMeters2?.[0]?.phaseACurrent || 0}
                  |${gridMeters2?.[0]?.phaseBCurrent || 0}
                  |${gridMeters2?.[0]?.phaseCCurrent || 0} A`
                  }
                  bottomText={`${gridMeters2?.[0]?.totalPowerFactor || 0}`}
                  totalActiveEnergy={
                    `${numberWithCommas((gridMeters2?.[0]?.dailyYield / 1000)) || 0}`
                  }
                  totalActiveEnergySub={
                    `${numberWithCommas((gridMeters2?.[0]?.totalActiveEnergySub / 1000)) || 0}`
                  }
                  realActivePower3SubphaseTotal={
                    `${numberWithCommas((gridMeters2?.[0]?.todayActivePower / 1000)) || 0}`
                  }
                />
              }
            >
              {/* Solar meter */}
              <TreeNode
                label={
                  <SolarClock
                    isShowNode={solarMeters2.length > 0}
                    isSolarMeter
                    imgClock
                    isShowArrowLeft
                    isShowNumberClockRight
                    isShowNumberSingleLeft
                    singleNo1={
                      `${numberWithCommas(solarMeters2?.[0]?.phaseAVoltage || 0, 0)}
                      |${numberWithCommas(solarMeters2?.[0]?.phaseBVoltage || 0, 0)}
                      |${numberWithCommas(solarMeters2?.[0]?.phaseCVoltage || 0, 0)} V`
                    }
                    singleNo2={
                      `${solarMeters2?.[0]?.phaseACurrent || 0}
                      |${solarMeters2?.[0]?.phaseBCurrent || 0}
                      |${solarMeters2?.[0]?.phaseCCurrent || 0} A`
                    }
                    title={`${solarMeters2?.[0]?.name || ''}`}
                    bottomText={`${solarMeters2?.[0]?.totalPowerFactor || 0}`}
                    className='mr1'
                    classNameGroup='solar'
                    isShowCustomer
                    textCustomer='KH'
                    totalActiveEnergy={
                      `${numberWithCommas((solarMeters2?.[0]?.dailyYield / 1000)) || 0}`
                    }
                    totalActiveEnergySub={
                      `${numberWithCommas((solarMeters2?.[0]?.totalActiveEnergySub / 1000)) || 0}`
                    }
                    realActivePower3SubphaseTotal={
                      `${numberWithCommas((solarMeters2?.[0]?.todayActivePower / 1000)) || 0}`
                    }
                  />
                }
              >
                {/* Render group 2 inverters */}
                {inverters2.length > 0 && renderInverters(inverters2)}
              </TreeNode>
            </TreeNode>
          )}
        </Tree>
      </Col>
    </div>
  )
}

SingleLine.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(SingleLine)
