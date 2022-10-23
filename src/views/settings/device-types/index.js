import React, { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Card } from 'reactstrap'

import InverterDetail from '@src/views/settings/device-types/inverter/InverterDetail'
import PanelDetail from '@src/views/settings/device-types/panel/PanelDetail'

import InverterDevice from './inverter'
import PannelDevice from './panel'
import Search from './Search'
import { FormattedMessage } from 'react-intl'

const DeviceTypes = () => {
  const [activeTab, setActiveTab] = useState('1')

  const [isShowInverterDetail, setIsShowInverterDetail] = useState(false),
    [isEditInverter, setIsEditInverter] = useState(false),
    [isShowPanelDetail, setIsShowPanelDetail] = useState(false),
    [isEditPanel, setIsEditPanel] = useState(false)

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const addInverter = () => {
    setIsShowInverterDetail(true)
    setIsEditInverter(false)
  }
  const addPanel = () => {
    setIsShowPanelDetail(true)
    setIsEditPanel(false)
  }

  return (
    <Card className='p-2 mb-0'>
      <Row>
        <Col lg={6} md={5}>
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === '1'}
                onClick={() => {
                  toggle('1')
                }}
              >
                <FormattedMessage id='Inverter'/>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === '2'}
                onClick={() => {
                  toggle('2')
                }}
              >
                <FormattedMessage id='Panel'/>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col lg={6} md={7}>
          <Search
            addInverter={addInverter}
            addPanel={addPanel}
            deviceType={activeTab === '1' ? 'Device types add new inverter' : 'Device types add new panel'}
          />
          {activeTab === '1' ?
            <InverterDetail
              isShowInverterDetail={isShowInverterDetail}
              setIsShowInverterDetail={setIsShowInverterDetail}
              inverterDetailTitle={isEditInverter ? (activeTab === '1' ? 'Device types edit inverter' : 'Device types edit panel') : (activeTab === '1' ? 'Device types add new inverter' : 'Device types add new panel')}
              isEditInverter={isEditInverter}
            /> :
            <PanelDetail
              isShowPanelDetail={isShowPanelDetail}
              setIsShowPanelDetail={setIsShowPanelDetail}
              panelDetailTitle={isEditPanel ? (activeTab === '1' ? 'Device types edit inverter' : 'Device types edit panel') : (activeTab === '1' ? 'Device types add new inverter' : 'Device types add new panel')}
              isEditPanel={isEditPanel}
            />
          }
        </Col>
      </Row>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <InverterDevice/>
        </TabPane>
        <TabPane tabId="2">
          <PannelDevice/>
        </TabPane>
      </TabContent>
    </Card>
  )
}

export default DeviceTypes
