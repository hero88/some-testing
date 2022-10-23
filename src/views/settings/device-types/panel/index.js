// ** React Imports
import React, { useState } from 'react'

// ** Third Party Components
import {} from 'reactstrap'

// ** Tables
import PanelTable from './PanelTable'

// ** Panel detail Modal
import PanelDetail from '@src/views/settings/device-types/panel/PanelDetail'

import { useDispatch } from 'react-redux'
import {
  setSelectedPanel
} from '@src/views/settings/device-types/panel/store/actions'

const Panels = () => {
  const dispatch = useDispatch()
  const [isShowPanelDetail, setIsShowPanelDetail] = useState(false),
    [isEditPanel, setIsEditPanel] = useState(false),
    [isViewPanel, setIsViewPanel] = useState(false)

  const editPanel = (panel) => {
    dispatch(setSelectedPanel(panel))
    setIsViewPanel(false)
    setIsEditPanel(true)
    setIsShowPanelDetail(true)
  }

  const viewPanel = (inverter) => {
    dispatch(setSelectedPanel(inverter))
    setIsEditPanel(false)
    setIsViewPanel(true)
    setIsShowPanelDetail(true)
  }

  return (
    <>
      <PanelTable
        editPanel={editPanel}
        viewPanel={viewPanel}
      />
      <PanelDetail
        isShowPanelDetail={isShowPanelDetail}
        setIsShowPanelDetail={setIsShowPanelDetail}
        panelDetailTitle={isViewPanel ? 'Panel type' : isEditPanel ? 'Device types edit panel' : 'Device types add new panel'}
        isEditPanel={isEditPanel}
        isViewPanel={isViewPanel}
      />
    </>
  )
}

export default Panels
