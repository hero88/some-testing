// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components

// ** Tables
import InverterTable from './InverterTable'

// ** Inverter detail Modal
import InverterDetail from './InverterDetail'

import PropTypes from 'prop-types'
import CreatePanelByFile from '@src/views/monitoring/project/devices/panels/CreatePanelByFile'

const Inverters = () => {
  const [inverterDetailModal, setInverterDetailModal] = useState(false),
    [isEditInverter, setIsEditInverter] = useState(false),
    [currentInverter, setCurrentInverter] = useState(null),
    [isShowCreatePanelByFile, setIsShowCreatePanelByFile] = useState(false)

  const addInverter = () => {
    setInverterDetailModal(true)
    setIsEditInverter(false)
  }

  const editInverter = (inverter) => {
    setInverterDetailModal(true)
    setCurrentInverter(inverter)
    setIsEditInverter(true)
  }

  return (
    <Fragment>
      <InverterTable
        addInverter={addInverter}
        editInverter={editInverter}
        setIsShowCreatePanelByFile={setIsShowCreatePanelByFile}
      />
      <InverterDetail
        inverterDetailModal={inverterDetailModal}
        setInverterDetailModal={setInverterDetailModal}
        inverterDetailTitle={isEditInverter ? 'Edit inverter' : 'Add new inverter'}
        currentInverter={isEditInverter ? currentInverter : null}
        isEditInverter={isEditInverter}
      />
      {isShowCreatePanelByFile && (
        <CreatePanelByFile
          isShowCreatePanelByFile={isShowCreatePanelByFile}
          setIsShowCreatePanelByFile={setIsShowCreatePanelByFile}
        />
      )}
    </Fragment>
  )
}

Inverters.propTypes = {
  setIsShowSolarPanelList: PropTypes.func
}

export default Inverters
