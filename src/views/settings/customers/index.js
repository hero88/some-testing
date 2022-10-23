// ** React Imports
import React, { Fragment, useEffect, useState } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import CustomerTable from './CustomerTable'

// ** Customer detail Modal
import CustomerDetail from '@src/views/settings/customers/CustomerDetail'

import { useDispatch } from 'react-redux'
import { setSelectedCustomer } from '@src/views/settings/customers/store/actions'
import { getAllProjects } from '@src/views/settings/projects/store/actions'
import { getAllUsers } from '@src/views/settings/users/store/actions'
import { STATE as STATUS } from '@constants/common'

const Customers = () => {
  const dispatch = useDispatch()
  const [isShowCustomerDetail, setIsShowCustomerDetail] = useState(false),
    [isEditCustomer, setIsEditCustomer] = useState(false),
    [isViewCustomer, setIsViewCustomer] = useState(false)

  const addCustomer = () => {
    setIsEditCustomer(false)
    setIsViewCustomer(false)
    setIsShowCustomerDetail(true)
  }

  const editCustomer = (customer) => {
    dispatch(setSelectedCustomer(customer))
    setIsViewCustomer(false)
    setIsEditCustomer(true)
    setIsShowCustomerDetail(true)
  }

  const viewCustomer = (customer) => {
    dispatch(setSelectedCustomer(customer))
    setIsEditCustomer(false)
    setIsViewCustomer(true)
    setIsShowCustomerDetail(true)
  }

  useEffect(async () => {
    await Promise.all([
      dispatch(getAllUsers({
        fk: JSON.stringify(['customers', 'projects', 'group']),
        state: [STATUS.ACTIVE].toString(),
        rowsPerPage: -1
      })),
      dispatch(getAllProjects({
        fk: JSON.stringify(['customer', 'users']),
        state: [STATUS.ACTIVE].toString(),
        rowsPerPage: -1
      }))
    ])
  }, [])

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <CustomerTable
            addCustomer={addCustomer}
            editCustomer={editCustomer}
            viewCustomer={viewCustomer}
          />
        </Col>
      </Row>
      <CustomerDetail
        isShowCustomerDetail={isShowCustomerDetail}
        setIsShowCustomerDetail={setIsShowCustomerDetail}
        customerDetailTitle={isViewCustomer ? 'Customer' : isEditCustomer ? 'Edit customer' : 'Add new customer'}
        isEditCustomer={isEditCustomer}
        isViewCustomer={isViewCustomer}
      />
    </Fragment>
  )
}

export default Customers
