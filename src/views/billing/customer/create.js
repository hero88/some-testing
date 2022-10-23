import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import { object } from 'prop-types'
import React from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CustomerCUForm from './CustomerCUForm'
import { postCustomer } from './store/actions'

import BreadCrumbs from '@src/views/common/breadcrumbs'

const CreateCustomerCOM = ({ intl }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const handleAddCustomer = (values) => {
    dispatch(
      postCustomer({
        params: { ...values, state: values.state?.value, type: values.type?.value },
        callback: () => {
          dispatch({
            type: SET_FORM_DIRTY,
            payload: false
          })
          history.push(ROUTER_URL.BILLING_CUSTOMER)
        },
        intl,
        skin
      })
    )
  }

  const handleCancel = () => {
    history.push(ROUTER_URL.BILLING_CUSTOMER)
  }
  return <CustomerCUForm onCancel={handleCancel} onSubmit={handleAddCustomer} />
}

CreateCustomerCOM.propTypes = {
  intl: object
}

export default injectIntl(CreateCustomerCOM)

export const Navbar = () => {
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'customers' }),
      link: ROUTER_URL.BILLING_CUSTOMER
    },
    {
      name: intl.formatMessage({ id: 'create-customer' }),
      link: ''
    }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
