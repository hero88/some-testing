import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap'
import arrowDownGreen from '@src/assets/images/svg/arrow-down-green.svg'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _groupBy from 'lodash/groupBy'
import _isEmpty from 'lodash/isEmpty'
import { FormattedMessage } from 'react-intl'

const DropdownArrow = ({
  name,
  panels
}) => {
  // ** State
  const [dropdownOpen, setDropdownOpen] = useState(false),
    [panelsByManufacturer, setPanelsByManufacturer] = useState(null)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const groupPanels = (items) => {
    const temp = _groupBy(items, (item) => item?.panelType?.panelModel)
    setPanelsByManufacturer(temp)
  }

  const sumNominalPV = (items) => {
    return items?.[0]?.panelType?.ppv
  }

  useEffect(() => {
    groupPanels(panels)
  }, [panels])

  return (
    <aside className='d-flex align-items-center'>
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle color='flat-success' className='p-0' style={{ borderRadius: 2 }}>
          <img
            name={name}
            className={classnames('img-fluid', {
              up: dropdownOpen
            })}
            src={arrowDownGreen}
            alt='arrowDownGreen'
          />
        </DropdownToggle>
        <DropdownMenu className='panels-dropdown-menu'>
          {!_isEmpty(panelsByManufacturer)
            ? Object.keys(panelsByManufacturer).map((manufacturer, index) => {
              return (
                <div key={index} className='text-info'>
                  <span
                    style={{ minWidth: '20px', display: 'inline-block', color: '#6BC953', textAlign: 'right' }}
                  >{panelsByManufacturer[manufacturer].length}</span>
                  &nbsp;PV&nbsp;
                  {sumNominalPV(panelsByManufacturer[manufacturer])}W&nbsp;
                  {manufacturer}
                </div>
              )
            })
            : <div className='text-danger'><FormattedMessage id='There are no records to display'/></div>
          }
        </DropdownMenu>
      </Dropdown>
      <div className='ml-25'>
        <span className='text-success'>{panels.length || 0}</span>
        &nbsp;PV
      </div>
    </aside>
  )
}

DropdownArrow.propTypes = {
  name: PropTypes.string,
  panels: PropTypes.array
}

export default DropdownArrow
