import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { postCustomerContract } from '../store/actions'
import CUForm from './CUForm'

import { injectIntl, useIntl } from 'react-intl'
import { object } from 'prop-types'
import BreadCrumbs from '@src/views/common/breadcrumbs'

function PowerSellingUpdateCOM() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { projectId } = useParams()

  const handleCancel = () => {
    history.push(`${ROUTER_URL.BILLING_PROJECT}/${projectId}`)
  }

  const handleSubmitCustomerContract = (payload) => {
    dispatch(
      postCustomerContract({
        payload,
        callback: () => {
          dispatch({
            type: SET_FORM_DIRTY,
            payload: false
          })
          history.push(`${ROUTER_URL.BILLING_PROJECT}/${projectId}`)
        }
      })
    )
  }
  return (
    <>
      <CUForm onCancel={handleCancel} onSubmit={handleSubmitCustomerContract} initValues={{ id: -1 }} />
    </>
  )
}

PowerSellingUpdateCOM.propTypes = {
  intl: object
}

export default injectIntl(PowerSellingUpdateCOM)

export const Navbar = () => {
  const {
    projects: { selectedProject: selectedBillingProject }
  } = useSelector((state) => state)
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    { name: intl.formatMessage({ id: 'project management' }), link: '' },
    {
      name: intl.formatMessage({ id: 'project' }),
      link: ROUTER_URL.BILLING_PROJECT
    },
    {
      name: selectedBillingProject?.name,
      link: `${ROUTER_URL.BILLING_PROJECT}/${selectedBillingProject?.id}`
    },
    { name: intl.formatMessage({ id: 'power-selling-contract' }), link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
