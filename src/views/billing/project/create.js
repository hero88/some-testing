/* eslint-disable no-unused-vars */
import { ISO_DISPLAY_DATE_TIME_FORMAT, ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import moment from 'moment'
import { object } from 'prop-types'
import React from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ProjectCUForm from './ProjectCUForm'
import { postProject } from './store/actions'
import SweetAlert from 'sweetalert2'
import classNames from 'classnames'
import '@src/@core/scss/billing-sweet-alert.scss'
import withReactContent from 'sweetalert2-react-content'
import BreadCrumbs from '@src/views/common/breadcrumbs'

const MySweetAlert = withReactContent(SweetAlert)

const CreateProject = ({ intl }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    layout: { skin }
  } = useSelector((state) => state)

  const handleCancel = () => {
    history.push(ROUTER_URL.BILLING_PROJECT)
  }

  const handleCreateProject = (newProject) => {
    const params = {
      name: newProject.name,
      code: newProject.code,
      address: newProject.address,
      startDate: newProject.startDate ? moment(newProject.startDate).format(ISO_DISPLAY_DATE_TIME_FORMAT) : null,
      userIds: (newProject.accountantIds || []).map((item) => item.value),
      operationCompanyId: newProject.companyId?.value,
      capacity: Number(newProject.power) || null,
      state: 'ACTIVE'
    }

    dispatch(
      postProject({
        params,
        callback: (res) => {
          dispatch({
            type: SET_FORM_DIRTY,
            payload: false
          })
          history.push({
            pathname: `${ROUTER_URL.BILLING_PROJECT}/${res.id}`,
            state: { isFromCreateStep: true, allowUpdate: true }
          })
        }
      })
    )
  }
  return <ProjectCUForm onCancel={handleCancel} onSubmit={handleCreateProject} />
}

CreateProject.propTypes = {
  intl: object
}

export default injectIntl(CreateProject)

export const Navbar = () => {
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    { name: intl.formatMessage({ id: 'project management' }) },
    {
      name: intl.formatMessage({ id: 'project' }),
      link: ROUTER_URL.BILLING_PROJECT
    },
    { name: intl.formatMessage({ id: 'create-project' }) }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
