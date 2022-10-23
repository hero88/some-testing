// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import MeterTable from './MeterTable'

// ** Meter detail Modal
import MeterDetail from './MeterDetail'

const Meters = () => {
  const [meterDetailModal, setMeterDetailModal] = useState(false),
    [isEditMeter, setIsEditMeter] = useState(false),
    [currentMeter, setCurrentMeter] = useState(null)

  const addMeter = () => {
    setMeterDetailModal(true)
    setIsEditMeter(false)
  }

  const editMeter = (meter) => {
    setMeterDetailModal(true)
    setCurrentMeter(meter)
    setIsEditMeter(true)
  }

  return (
    <Fragment>
      <Row>
        <Col sm="12">
          <MeterTable
            addMeter={addMeter}
            editMeter={editMeter}
          />
        </Col>
      </Row>
      <MeterDetail
        meterDetailModal={meterDetailModal}
        setMeterDetailModal={setMeterDetailModal}
        meterDetailTitle={isEditMeter ? 'Edit meter' : 'Add new meter'}
        currentMeter={isEditMeter ? currentMeter : null}
        isEditMeter={isEditMeter}
      />
    </Fragment>
  )
}

export default Meters
