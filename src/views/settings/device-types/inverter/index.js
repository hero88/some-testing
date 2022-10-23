// ** React Imports
import React, { useState } from 'react'

// ** Third Party Components
import {} from 'reactstrap'

// ** Tables
import InverterTable from './InverterTable'

// ** Inverter detail Modal
import InverterDetail from '@src/views/settings/device-types/inverter/InverterDetail'

import { useDispatch } from 'react-redux'
import {
  setSelectedInverter
} from '@src/views/settings/device-types/inverter/store/actions'

const Inverters = () => {
  const dispatch = useDispatch()
  const [isShowInverterDetail, setIsShowInverterDetail] = useState(false),
    [isEditInverter, setIsEditInverter] = useState(false),
    [isViewInverter, setIsViewInverter] = useState(false)

  const editInverter = (inverter) => {
    dispatch(setSelectedInverter(inverter))
    setIsViewInverter(false)
    setIsEditInverter(true)
    setIsShowInverterDetail(true)
  }

  const viewInverter = (inverter) => {
    dispatch(setSelectedInverter(inverter))
    setIsEditInverter(false)
    setIsViewInverter(true)
    setIsShowInverterDetail(true)
  }

  return (
    <>
      <InverterTable
        editInverter={editInverter}
        viewInverter={viewInverter}
      />
      <InverterDetail
        isShowInverterDetail={isShowInverterDetail}
        setIsShowInverterDetail={setIsShowInverterDetail}
        inverterDetailTitle={isViewInverter ? 'Inverter type' : isEditInverter ? 'Device types edit inverter' : 'Device types add new inverter'}
        isEditInverter={isEditInverter}
        isViewInverter={isViewInverter}
      />
    </>
  )
}

export default Inverters
