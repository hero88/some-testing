// ** React Imports
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// ** Actions
import { setSelectedProject } from '@src/views/settings/projects/store/actions'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import ProjectTable from './ProjectTable'

// ** Project detail Modal
import ProjectDetail from './ProjectDetail'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import AutoCreateProject from '@src/views/settings/projects/auto-create-project'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { getAllCustomers } from '@src/views/settings/customers/store/actions'
import { getAllUsers } from '@src/views/settings/users/store/actions'
import { STATE as STATUS } from '@constants/common'
import { getIndustrialAreas, getInvestors } from '@src/views/monitoring/projects/store/actions'

const Projects = () => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch()
  const [isShowProjectDetail, setIsShowProjectDetail] = useState(false),
    [isEditProject, setIsEditProject] = useState(false),
    [isAutoCreateProject, setIsAutoCreateProject] = useState(false),
    [selectedProjectsSite, setSelectedProjectsSite] = useState([])

  const addProject = ({ isAuto = false }) => {
    setIsAutoCreateProject(isAuto)
    setIsShowProjectDetail(true)
    setIsEditProject(false)
  }

  const editProject = (project) => {
    setIsShowProjectDetail(true)
    dispatch(setSelectedProject(project))
    setIsEditProject(true)
  }

  useEffect(async () => {
    await Promise.all([
      dispatch(
        getAllCustomers({
          fk: JSON.stringify(['users', 'projects']),
          state: [STATUS.ACTIVE].toString(),
          rowsPerPage: -1
        })
      ),
      dispatch(
        getAllUsers({
          fk: JSON.stringify(['customers', 'projects']),
          state: [STATUS.ACTIVE].toString(),
          rowsPerPage: -1
        })
      ),
      dispatch(
        getIndustrialAreas({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      ),
      dispatch(
        getInvestors({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      )
    ])
  }, [])

  return (
    <Fragment>
      <Row>
        {ability.can('manage', USER_ABILITY.AUTO_CREATE_PROJECT) && (
          <Col sm="12">
            <AutoCreateProject
              addProject={addProject}
              selectedProjectsSite={selectedProjectsSite}
              setSelectedProjectsSite={setSelectedProjectsSite}
            />
          </Col>
        )}
        <Col sm="12">
          <ProjectTable addProject={addProject} editProject={editProject} />
        </Col>
      </Row>
      <ProjectDetail
        isShowProjectDetail={isShowProjectDetail}
        setIsShowProjectDetail={setIsShowProjectDetail}
        projectDetailTitle={isEditProject ? 'Edit project' : 'Add new project'}
        isEditProject={isEditProject}
        isAutoCreateProject={isAutoCreateProject}
        selectedProjectsSite={selectedProjectsSite}
        setSelectedProjectsSite={setSelectedProjectsSite}
      />
    </Fragment>
  )
}

Projects.propTypes = {}

export default Projects
