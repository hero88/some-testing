// ** Third Party Components
import React, {} from "react"
import PropTypes from 'prop-types'
import customer from '@src/assets/images/singleline/customer.svg'

const Customer = ({textCustomer}) => {

  return (
    <div className='customerKH'>
      <img className='img-fluid zindex-1' src={customer} alt='Customer'/>
      <span className='title mb'>{textCustomer}</span>
    </div>
  )
}

Customer.propTypes = {
  textCustomer: PropTypes.any
}

export default Customer