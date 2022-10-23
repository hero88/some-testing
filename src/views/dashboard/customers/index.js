// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Tables
import CustomerTable from './CustomerTable'

// ** Customer detail Modal
import CustomerDetail from '../../settings/customers/CustomerDetail'

import PropTypes from 'prop-types'

const Customers = ({ isShowAllProjects }) => {
  const [customerDetailModal, setCustomerDetailModal] = useState(false),
    [isEditCustomer, setIsEditCustomer] = useState(false),
    [currentCustomer, setCurrentCustomer] = useState(null)

  const addCustomer = () => {
    setCustomerDetailModal(true)
    setIsEditCustomer(false)
  }

  const editCustomer = (customer) => {
    setCustomerDetailModal(true)
    setCurrentCustomer(customer)
    setIsEditCustomer(true)
  }

  return (
    <Fragment>
      <Row>
        <Col sm="12">
          <CustomerTable
            addCustomer={addCustomer}
            editCustomer={editCustomer}
            isShowAllProjects={isShowAllProjects}
          />
        </Col>
      </Row>
      <CustomerDetail
        customerDetailModal={customerDetailModal}
        setCustomerDetailModal={setCustomerDetailModal}
        customerDetailTitle={isEditCustomer ? 'Edit customer' : 'Add new customer'}
        currentCustomer={isEditCustomer ? currentCustomer : null}
        isEditCustomer={isEditCustomer}
      />
    </Fragment>
  )
}

Customers.propTypes = {
  isShowAllProjects: PropTypes.bool
}

export default Customers
