import ButtonPagination from '@src/views/common/buttons/ButtonPagination'
import { useQuery } from '@hooks/useQuery'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { ROUTER_URL } from '@constants/router'
import { useHistory } from 'react-router-dom'
import ProjectGeneral from '@src/views/monitoring/project/information/ProjectGeneral'
import ProjectMap from '@src/views/monitoring/project/information/ProjectMap'
import ProjectImages from '@src/views/monitoring/project/information/ProjectImages'
import ProjectCommerce from '@src/views/monitoring/project/information/ProjectCommerce'

const ProjectInformation = ({ intl }) => {
  const history = useHistory()
  const query = useQuery(),
    projectId = query.get('projectId')

  const buttons = [
    {
      id: 'informationBtn',
      name: intl.formatMessage({ id: 'General information' }),
      pathname: ROUTER_URL.PROJECT_INFO_GENERAL
    },
    {
      id: 'commerceBtn',
      name: intl.formatMessage({ id: 'Commerce' }),
      pathname: ROUTER_URL.PROJECT_INFO_COMMERCE
    },
    {
      id: 'imagesBtn',
      name: intl.formatMessage({ id: 'Images' }),
      pathname: ROUTER_URL.PROJECT_INFO_IMAGES
    },
    {
      id: 'mapBtn',
      name: intl.formatMessage({ id: 'Map' }),
      pathname: ROUTER_URL.PROJECT_INFO_MAP
    }
  ]
  const activeButton = buttons.find(button => button.pathname === history.location.pathname)

  const renderPage = (pathname) => {
    switch (pathname) {
      case ROUTER_URL.PROJECT_INFO_COMMERCE:
        return <ProjectCommerce />

      case ROUTER_URL.PROJECT_INFO_IMAGES:
        return <ProjectImages />

      case ROUTER_URL.PROJECT_INFO_MAP:
        return <ProjectMap />

      case ROUTER_URL.PROJECT_INFO_GENERAL:
        return <ProjectGeneral />
    }
  }

  return (
    <>
      <div className='group d-flex justify-content-end mb-1'>
        <ButtonPagination
          devices={buttons}
          projectId={projectId}
          deviceId={activeButton?.id}
          perPage={4}
        />
      </div>
      {renderPage(history.location.pathname)}
    </>
  )
}

ProjectInformation.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(ProjectInformation)
