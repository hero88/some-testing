// ** React Imports
import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

// ** Third party components
import PropTypes from 'prop-types'

// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'
import { injectIntl } from 'react-intl'
// import backArrow from '@src/assets/images/svg/headerbar/back-arrow.svg'
// import NavbarDashboard from '@layouts/components/navbar/NavbarDashboard'
import { ROUTER_URL } from '@constants/router'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { useSelector } from 'react-redux'

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility, intl } = props
  const history = useHistory()
  const breadCrumbItems = history.location.pathname.split('/')
  // Remove 1st empty item
  breadCrumbItems.shift()
  const {
    customerProject: { selectedProject },
    settings: { selectedSetting },
    projects: { selectedProject: selectedBillingProject },
    projectContracts: { selectedContract }
  } = useSelector((state) => state)
  const renderCustomNav = (pathname) => {
    switch (pathname) {
      case ROUTER_URL.PROJECT_OVERVIEW:
      case ROUTER_URL.PROJECT_SINGLE_LINE:
      case ROUTER_URL.PROJECT_INVERTER:
      case ROUTER_URL.PROJECT_INVERTER_DETAIL:
      case ROUTER_URL.PROJECT_METER:
      case ROUTER_URL.PROJECT_METER_DETAIL:
      case ROUTER_URL.PROJECT_PANEL:
      case ROUTER_URL.PROJECT_ALARM:
      case ROUTER_URL.PROJECT_CONTROL:
      case ROUTER_URL.PROJECT_INFO_GENERAL:
      case ROUTER_URL.PROJECT_INFO_COMMERCE:
      case ROUTER_URL.PROJECT_INFO_IMAGES:
      case ROUTER_URL.PROJECT_INFO_MAP:
      case ROUTER_URL.PROJECT_CHART:
      case ROUTER_URL.PROJECT_SETTING: {
        const tempItems = [
          { name: intl.formatMessage({ id: 'operation' }), link: '' },
          { name: intl.formatMessage({ id: 'monitoring' }), link: ROUTER_URL.PROJECTS },
          { name: selectedProject?.name, link: '' }
        ]

        return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      }

      case `${ROUTER_URL.BILLING_SETTING}/${selectedSetting?.id}`: {
        const tempItems = [
          { name: intl.formatMessage({ id: 'billing' }), link: '' },
          { name: intl.formatMessage({ id: 'settings' }), link: ROUTER_URL.BILLING_SETTING },
          { name: selectedSetting?.name, link: '' }
        ]
        return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      }
      case `${ROUTER_URL.BILLING_PROJECT}`: {
        const tempItems = [
          { name: intl.formatMessage({ id: 'billing' }), link: '' },
          { name: intl.formatMessage({ id: 'project management' }), link: '' },
          { name: intl.formatMessage({ id: 'project' }) }
        ]
        return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      }
      case `${ROUTER_URL.BILLING_PROJECT_CREATE}`: {
        const tempItems = [
          { name: intl.formatMessage({ id: 'billing' }), link: '' },
          { name: intl.formatMessage({ id: 'project management' }), link: '' },
          { name: intl.formatMessage({ id: 'create-project' }) }
        ]
        return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      }
      case `${ROUTER_URL.BILLING_PROJECT}/${selectedBillingProject?.id}`: {
        const tempItems = [
          { name: intl.formatMessage({ id: 'billing' }), link: '' },
          { name: intl.formatMessage({ id: 'project management' }), link: '' },
          { name: intl.formatMessage({ id: 'project' }), link: ROUTER_URL.BILLING_PROJECT },
          { name: selectedBillingProject?.name, link: '' }
        ]
        return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      }

      case ROUTER_URL.BILLING_PROJECT_UPDATE_CONTRACT_POWER_SELLING.replace(
        ':projectId',
        selectedBillingProject.id
      ).replace(':id', selectedContract?.id): {
        const tempItems = [
          { name: intl.formatMessage({ id: 'billing' }), link: '' },
          { name: intl.formatMessage({ id: 'project management' }), link: '' },
          { name: intl.formatMessage({ id: 'project' }), link: ROUTER_URL.BILLING_PROJECT },
          { name: selectedBillingProject.name, link: `${ROUTER_URL.BILLING_PROJECT}/${selectedBillingProject.id}` },
          { name: intl.formatMessage({ id: 'Update selling power contract' }), link: '' }
        ]
        return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      }
      // case ROUTER_URL.BILLING_PROJECT_CREATE_ROOF_VENDOR.replace(':projectId', selectedBillingProject.id): {
      //   const tempItems = [
      //     { name: intl.formatMessage({ id: 'billing' }), link: '' },
      //     { name: intl.formatMessage({ id: 'project management' }), link: '' },
      //     { name: intl.formatMessage({ id: 'project' }), link: ROUTER_URL.BILLING_PROJECT },
      //     {
      //       name: selectedBillingProject?.name,
      //       link: ROUTER_URL.BILLING_PROJECT_UPDATE.replace(':id', selectedBillingProject.id)
      //     },
      //     { name: intl.formatMessage({ id: 'Add roof renting contract' }), link: '' }
      //   ]
      //   return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      // }
      // case ROUTER_URL.BILLING_PROJECT_UPDATE_ROOF_VENDOR.replace(':projectId', selectedBillingProject.id).replace(
      //   ':id',
      //   selectedContract?.id
      // ): {
      //   const tempItems = [
      //     { name: intl.formatMessage({ id: 'billing' }), link: '' },
      //     { name: intl.formatMessage({ id: 'project management' }), link: '' },
      //     { name: intl.formatMessage({ id: 'project' }), link: ROUTER_URL.BILLING_PROJECT },
      //     {
      //       name: selectedBillingProject?.name,
      //       link: ROUTER_URL.BILLING_PROJECT_UPDATE.replace(':id', selectedBillingProject.id)
      //     },
      //     { name: selectedContract?.id, link: '' }
      //   ]
      //   return <BreadCrumbs breadCrumbTitle={breadCrumbItems[0]} breadCrumbItems={tempItems} />
      // }
      default:
        return (
          <BreadCrumbs
            breadCrumbTitle={breadCrumbItems[0]}
            breadCrumbItems={breadCrumbItems.map((item) => ({
              name: item ? intl.formatMessage({ id: item }) : '',
              link: item === 'projects' ? ROUTER_URL.SETTINGS_PROJECTS : ''
            }))}
          />
        )
    }
  }
  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center" id="navbarWrapper">
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
        {renderCustomNav(history.location.pathname)}
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

ThemeNavbar.propTypes = {
  intl: PropTypes.object,
  skin: PropTypes.string,
  setSkin: PropTypes.func,
  setMenuVisibility: PropTypes.func
}

export default injectIntl(ThemeNavbar)
