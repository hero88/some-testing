// ** React Imports
import React, { useState } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'

// ** Tables
import PanelTable from './PanelTable'

// ** Panel detail Modal
import PanelDetail from './PanelDetail'

const Panels = () => {
  const [panelDetailModal, setPanelDetailModal] = useState(false),
    [isEditPanel, setIsEditPanel] = useState(false),
    [currentPanel, setCurrentPanel] = useState(null)

  const addPanel = () => {
    setPanelDetailModal(true)
    setIsEditPanel(false)
  }

  const editPanel = (panel) => {
    setPanelDetailModal(true)
    setCurrentPanel(panel)
    setIsEditPanel(true)
  }

  return (
    <>
      <Row>
        <Col sm='12'>
          <PanelTable
            addPanel={addPanel}
            editPanel={editPanel}
          />
        </Col>
      </Row>
      <PanelDetail
        panelDetailModal={panelDetailModal}
        setPanelDetailModal={setPanelDetailModal}
        panelDetailTitle={isEditPanel ? 'Edit solar panel' : 'Add new solar panel'}
        currentPanel={isEditPanel ? currentPanel : null}
        isEditPanel={isEditPanel}
      />
    </>
  )
}

Panels.propTypes = {
  isShowSolarPanelList: PropTypes.bool,
  setIsShowSolarPanelList: PropTypes.func
}

export default Panels
