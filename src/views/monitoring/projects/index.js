// ** Third party components
import { Col, Row } from 'reactstrap'

// ** Custom components
import ProjectTable from './ProjectTable'
import { useEffect } from 'react'
import { getAllCustomers } from '@src/views/settings/customers/store/actions'
import { STATE as STATUS } from '@constants/common'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'

const Projects = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    Promise.all([
      dispatch(
        getAllCustomers({
          fk: JSON.stringify(['users', 'projects']),
          state: [STATUS.ACTIVE].toString(),
          rowsPerPage: -1
        })
      )
    ])
  }, [])

  return (
    <>
      <Row className='customer__projects'>
        <Col>
          <ProjectTable
            isInformation={history.location.pathname === ROUTER_URL.INFORMATION}
          />
        </Col>
      </Row>
    </>
  )
}

Projects.propTypes = {}

export default Projects
