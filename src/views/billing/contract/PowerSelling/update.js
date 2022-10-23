import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { getContractById, putCustomerContract } from '../store/actions'
import CUForm from './CUForm'
import { injectIntl, useIntl } from 'react-intl'
import { object } from 'prop-types'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

function PowerSellingCreateCOM({ intl }) {
  const location = useLocation()
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const dispatch = useDispatch()
  const { projectId, id } = useParams()
  const {
    projectContracts: { selectedContract }
  } = useSelector((state) => state)

  const [isReadOnly, setIsReadOnly] = useState(true)

  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  const handleCancel = () => {
    history.push(`${ROUTER_URL.BILLING_PROJECT}/${projectId}`)
  }

  useEffect(() => {
    dispatch(
      getContractById({
        id,
        isSavedToState: true
      })
    )
  }, [id])

  const handleSubmitCustomerContract = (payload) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      dispatch(
        putCustomerContract({
          payload: { ...payload, id: Number(id) },
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
  }
  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.PROJECT)

  return (
    <>
      {selectedContract?.id && (
        <CUForm
          isReadOnly={isReadOnly}
          onCancel={handleCancel}
          onSubmit={handleSubmitCustomerContract}
          initValues={selectedContract}
          submitText={intl.formatMessage({ id: isReadOnly ? 'Update' : 'Save' })}
          cancelText={intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
          submitClassname={!checkUpdateAbility && 'd-none'}
        />
      )}
    </>
  )
}

PowerSellingCreateCOM.propTypes = {
  intl: object
}

export default injectIntl(PowerSellingCreateCOM)

export const Navbar = () => {
  const {
    projects: { selectedProject: selectedBillingProject },
    projectContracts: { selectedContract: selectedContract }
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
    { name: selectedContract?.code }
  ]

  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
