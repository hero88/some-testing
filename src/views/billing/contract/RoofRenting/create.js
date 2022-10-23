import { object } from 'prop-types'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { postContractRoofVendor } from '../store/actions'
import RoofVendorContractCUForm from './RoofVendorContractCUForm'
import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import '@src/@core/scss/billing-sweet-alert.scss'
import { getBillingProjectById } from '../../project/store/actions'
import React, { useEffect } from 'react'
import BreadCrumbs from '@src/views/common/breadcrumbs'

const CreateRoofVendorContract = ({ intl }) => {
  const {
    projects: { selectedProject: selectedBillingProject }
  } = useSelector((state) => state)
  const history = useHistory()
  const { projectId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    if (Number(projectId) !== Number(selectedBillingProject?.id)) {
      dispatch(
        getBillingProjectById({
          id: projectId,
          isSavedToState: true
        })
      )
    }
  }, [projectId])

  const handleAddRoofVendorContract = (values) => {
    // eslint-disable-next-line no-unused-vars
    const { address, taxCode, contractCode, effectiveDate, expirationDate, contractType, ...newvalue } = values
    dispatch(
      postContractRoofVendor({
        newvalue,
        intl,
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
  const handleCancel = () => {
    history.push(`${ROUTER_URL.BILLING_PROJECT}/${projectId}`)
  }
  return (
    <>
      <RoofVendorContractCUForm onCancel={handleCancel} onSubmit={handleAddRoofVendorContract} />
    </>
  )
}
CreateRoofVendorContract.propTypes = {
  intl: object
}
export default injectIntl(CreateRoofVendorContract)

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
    { name: intl.formatMessage({ id: 'Add roof renting contract' }), link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
