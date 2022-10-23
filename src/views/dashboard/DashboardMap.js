import CustomGoogleMap from '@src/views/common/google-map'
import { useEffect } from 'react'
import { getAllProjects } from '@src/views/monitoring/projects/store/actions'
import { STATE } from '@constants/common'
import { useDispatch, useSelector } from 'react-redux'

const DashboardMap = () => {
  const dispatch = useDispatch(),
    { customerProject: { allData: projects } } = useSelector(state => state)

  useEffect(() => {
    Promise.all([
      dispatch(
        getAllProjects({
          state: [STATE.ACTIVE].toString(),
          rowsPerPage: -1,
          fk: JSON.stringify(['devices'])
        })
      )
    ])
  }, [])

  return (
    <CustomGoogleMap projects={projects} />
  )
}

DashboardMap.propTypes = {}

export default DashboardMap
