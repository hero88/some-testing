import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'

// ** Third Party Components
import {
  Button,
  CustomInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import PropTypes from 'prop-types'
import _orderBy from 'lodash/orderBy'

import AppCollapse from '@components/app-collapse'
import { getAllProjects } from '@src/views/monitoring/projects/store/actions'
import { ALERT_STATUS, ALERT_TYPE, STATE } from '@constants/common'
import { DEVICE_TYPE } from '@constants/project'
import { useQuery } from '@hooks/useQuery'
import { ROUTER_URL } from '@constants/router'
import { useHistory } from 'react-router-dom'

const ActiveSidebar = ({
  intl,
  selectedProjectIds,
  setSelectedProjectIds,
  selectedDeviceIds,
  setSelectedDeviceIds,
  selectedStatuses,
  setSelectedStatuses,
  selectedOthers,
  setSelectedOthers,
  onFilter,
  resetFilter,
  isOpen,
  setIsOpen,
  isHideProjectFilter
}) => {
  const history = useHistory()

  // ** Store
  const {
      auth: { userData },
      customerProject: { allData: projectAllData, selectedProject }
    } = useSelector((state) => state),
    dispatch = useDispatch()
  const query = useQuery()
  const projectId = query.get('projectId')

  // ** State
  const [inverters, setInverters] = useState([]),
    [meters, setMeters] = useState([])

  const checkValueInArray = ({ selectedData, item, isChecked }) => {
    const ids = [...selectedData]
    const index = ids.findIndex((id) => id === item.id)

    if (isChecked && index === -1) {
      ids.push(item.id)
    } else if (!isChecked && index > -1) {
      ids.splice(index, 1)
    }

    return ids
  }

  // Checking which is selected to expand
  const checkingActiveParents = (data) => {
    const tempActiveParents = []

    data.forEach((item, index) => {
      if (item.keyObj && Object.values(item.keyObj).some(bool => bool)) {
        tempActiveParents.push(index)
      }
    })

    return tempActiveParents
  }

  const renderCheckboxItems = (items, parentId) => {
    return items.map((item, index) => {
      return (
        <CustomInput
          key={index}
          type='checkbox'
          className='custom-control-Primary'
          checked={
            parentId === 'project'
              ? selectedProjectIds.findIndex((id) => id === item.id) > -1
              : parentId === 'inverter' || parentId === 'meter'
                ? selectedDeviceIds.findIndex((id) => id === item.id) > -1
                : parentId === 'status' && selectedStatuses
                  ? selectedStatuses.findIndex((id) => id === item.id) > -1
                  : selectedOthers.findIndex((id) => id === item.id) > -1
          }
          onChange={(e) => {
            switch (parentId) {
              case 'project':
                setSelectedProjectIds(
                  checkValueInArray({
                    selectedData: selectedProjectIds,
                    item,
                    isChecked: e.target.checked
                  })
                )
                break
              case 'inverter':
              case 'meter':
                setSelectedDeviceIds(
                  checkValueInArray({
                    selectedData: selectedDeviceIds,
                    item,
                    isChecked: e.target.checked
                  })
                )
                break
              case 'status':
                if (setSelectedStatuses) {
                  setSelectedStatuses(
                    checkValueInArray({
                      selectedData: selectedStatuses,
                      item,
                      isChecked: e.target.checked
                    })
                  )
                }

                break
              case 'other':
                setSelectedOthers(
                  checkValueInArray({
                    selectedData: selectedOthers,
                    item,
                    isChecked: e.target.checked
                  })
                )
                break
              default:
                break
            }
          }}
          value={item.id}
          id={`ckb_${item.name}_${parentId}_${item.id}`}
          label={parentId === 'project' ? `${item.code} - ${item.name}` : item.name}
        />
      )
    })
  }

  const otherParams = [
      { id: ALERT_TYPE.INVERTER_OFFLINE, name: intl.formatMessage({ id: 'Inverter offline' }) },
      { id: ALERT_TYPE.INVERTER_OVERHEAT, name: intl.formatMessage({ id: 'Inverter overheat' }) },
      { id: ALERT_TYPE.LOW_EFFICIENCY, name: intl.formatMessage({ id: 'Low efficiency' }) },
      { id: ALERT_TYPE.UNSTABLE_NETWORK, name: intl.formatMessage({ id: 'Unstable network / data interrupted' }) },
      { id: ALERT_TYPE.LOW_COS_PHI, name: 'Cos φ' },
      { id: ALERT_TYPE.METER_OFFLINE, name: intl.formatMessage({ id: 'Meter offline alert' }) },
      {
        id: ALERT_TYPE.FAULT_EVENT_OF_EACH_INVERTERS,
        name: intl.formatMessage({ id: 'Faults/events for each type of inverters' })
      },
      {
        id: ALERT_TYPE.DIFF_BTW_INVERTER_AND_METER,
        name: intl.formatMessage({ id: 'Different between meter and inverter alert' })
      },
      { id: ALERT_TYPE.ASYNC_INVERTER, name: intl.formatMessage({ id: 'Async inverters alert' }) },
      { id: ALERT_TYPE.YIELD_AT_LOW_COST_TIME, name: intl.formatMessage({ id: 'Having yield at low cost time alert' }) },
      {
        id: ALERT_TYPE.LOW_EFF_OF_EACH_INVERTER,
        name: intl.formatMessage({ id: 'Low efficiency of each inverter of project' })
      },
      {
        id: ALERT_TYPE.HAVE_DIFF_YIELD_BTW_PROJECT,
        name: intl.formatMessage({ id: 'Having different yield between projects of industrial area' })
      },
      { id: ALERT_TYPE.INSPECTION_EXPIRED, name: intl.formatMessage({ id: 'Inspection date is expired alert' }) },
      { id: ALERT_TYPE.PV_SENSOR_OVERHEAT, name: intl.formatMessage({ id: 'Panel sensor overheat' }) },
      { id: ALERT_TYPE.INVERTER_STRING_ALERT, name: intl.formatMessage({ id: 'Inverter String alert' }) }
    ],
    statuses = [
      { id: ALERT_STATUS.NEW, name: intl.formatMessage({ id: 'New' }) },
      { id: ALERT_STATUS.IN_PROGRESS, name: intl.formatMessage({ id: 'In progress' }) },
      { id: ALERT_STATUS.UN_RESOLVED, name: intl.formatMessage({ id: 'Unresolved' }) }
    ],
    titleData = [
      {
        keyObj: selectedProjectIds,
        title: intl.formatMessage({ id: 'Project' }),
        content: renderCheckboxItems(projectAllData, 'project'),
        isHide: isHideProjectFilter
      },
      {
        keyObj: selectedDeviceIds,
        title: intl.formatMessage({ id: 'Inverter' }),
        content: renderCheckboxItems(inverters, 'inverter'),
        isHide: false
      },
      {
        keyObj: selectedDeviceIds,
        title: intl.formatMessage({ id: 'Meter' }),
        content: renderCheckboxItems(meters, 'meter'),
        isHide: false
      },
      {
        keyObj: selectedStatuses,
        title: intl.formatMessage({ id: 'Status' }),
        content: renderCheckboxItems(statuses, 'status'),
        isHide: false
      },
      {
        keyObj: selectedOthers,
        title: intl.formatMessage({ id: 'Others' }),
        content: renderCheckboxItems(otherParams, 'other'),
        isHide: false
      }
    ]

  // ** Component did mount
  useEffect(async () => {
    await Promise.all([
      dispatch(getAllProjects({
        state: [STATE.ACTIVE].toString(),
        userId: userData?.user?.id,
        rowsPerPage: -1,
        fk: JSON.stringify(['devices'])
      }))
    ])
  }, [])

  useEffect(() => {
    setMeters([])
    setInverters([])

    for (const projectId of selectedProjectIds) {
      const tempSelectedProject = projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM
        ? selectedProject
        : projectAllData.find(project => project.id === projectId)

      if (tempSelectedProject?.devices?.length > 0) {
        tempSelectedProject.devices.forEach(device => {
          if (device.typeDevice === DEVICE_TYPE.INVERTER) {
            setInverters(currentState => _orderBy([
              ...currentState,
              { ...device, name: `${tempSelectedProject.code} - ${device.name}` }
            ], ['name']))
          }

          if (device.typeDevice === DEVICE_TYPE.METER) {
            setMeters(currentState => [
              ...currentState,
              { ...device, name: `${tempSelectedProject.code} - ${device.name}` }
            ])
          }
        })
      }
    }
  }, [selectedProjectIds])

  useEffect(() => {
    if (projectId && history.location.pathname === ROUTER_URL.PROJECT_ALARM) {
      setSelectedProjectIds([projectId])
    }
  }, [projectId])

  return (
    <Modal isOpen={isOpen} className='modal-dialog-centered modal-dialog-filter' backdrop='static'>
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>
        <FormattedMessage id='Filter'/>
      </ModalHeader>
      <ModalBody>
        <AppCollapse
          data={
            selectedStatuses
              ? titleData.filter(item => !item.isHide)
              : titleData.filter((item, index) => index !== 3 && !item.isHide)
          }
          active={checkingActiveParents(titleData)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color='primary'
          onClick={() => {
            onFilter()
            setIsOpen(!isOpen)
          }}
        >
          <FormattedMessage id='Finish'/>
        </Button>
        <Button
          color='secondary'
          onClick={() => {
            resetFilter()
            setIsOpen(!isOpen)
          }}
        >
          <FormattedMessage id='Cancel'/>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ActiveSidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  selectedProjectIds: PropTypes.array,
  setSelectedProjectIds: PropTypes.func,
  selectedDeviceIds: PropTypes.array,
  setSelectedDeviceIds: PropTypes.func,
  selectedStatuses: PropTypes.array,
  setSelectedStatuses: PropTypes.func,
  selectedOthers: PropTypes.array,
  setSelectedOthers: PropTypes.func,
  onFilter: PropTypes.func,
  resetFilter: PropTypes.func,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  isHideProjectFilter: PropTypes.bool
}

export default injectIntl(ActiveSidebar)
