import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import { object } from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import CustomerCUForm from './CustomerCUForm'
import { getCustomerWithContactsById, putCustomer } from './store/actions'
import { Tab, Tabs } from '@mui/material'
import ProjectTable from './ProjectTable'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

import BreadCrumbs from '@src/views/common/breadcrumbs'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const UpdateOperationUnit = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()

  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(1)
  const { id } = useParams()
  const location = useLocation()

  const [isReadOnly, setIsReadOnly] = useState(true)

  const handleCancel = () => {
    history.push(ROUTER_URL.BILLING_CUSTOMER)
  }
  const {
    layout: { skin },
    billingCustomer: { selectedCustomer },
    billingContacts: { contacts }
  } = useSelector((state) => state)

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue)
  }
  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])
  useEffect(() => {
    dispatch(
      getCustomerWithContactsById({
        id,
        isSavedToState: true
      })
    )
  }, [id])

  const handleUpdateCustomer = (values) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      dispatch(
        putCustomer({
          params: { ...values, state: values.state?.value, type: values.type?.value, id },
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(ROUTER_URL.BILLING_CUSTOMER)
          },
          skin,
          intl
        })
      )
    }
  }

  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.CUSTOMER)

  return (
    <>
      {' '}
      <Tabs
        value={activeTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChangeTab}
        classes={{
          root: 'mb-2 tabs-border-bottom'
        }}
      >
        <Tab classes={{ root: 'general-tab' }} label={intl.formatMessage({ id: 'Customer info' })} value={1} />
        <Tab classes={{ root: 'general-tab' }} label={intl.formatMessage({ id: 'projects' })} value={2} />
      </Tabs>
      {activeTab === 1 && (
        <CustomerCUForm
          isViewed={isReadOnly}
          onSubmit={handleUpdateCustomer}
          onCancel={handleCancel}
          initValues={selectedCustomer}
          contacts={contacts}
          submitText={intl.formatMessage({ id: isReadOnly ? 'Update' : 'Save' })}
          cancelText={intl.formatMessage({ id: isReadOnly ? 'Back' : 'Cancel' })}
          submitClassname={!checkUpdateAbility && 'd-none'}
          allowedEdit={checkUpdateAbility}
        />
      )}
      {activeTab === 2 && <ProjectTable />}
    </>
  )
}

UpdateOperationUnit.propTypes = {
  intl: object
}

export default injectIntl(UpdateOperationUnit)

export const Navbar = () => {
  const intl = useIntl()

  const {
    billingCustomer: { selectedCustomer }
  } = useSelector((state) => state)

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'customers' }),
      link: ROUTER_URL.BILLING_CUSTOMER
    },
    { name: selectedCustomer?.fullName, link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
