import React from 'react'
import { ReactComponent as NoDataIcon } from '@src/assets/images/svg/no-data.svg'
import './styles.scss'
import { FormattedMessage } from 'react-intl'
import { element } from 'prop-types'

const NoDataCOM = ({ title }) => {
  return (
    <>
      <div className="customer-contact-no-data">
        <NoDataIcon key="acb" />
        <div className="no-data-title mt-2 font-weight-bolder">
          {' '}
          <FormattedMessage id="No data" />
        </div>
        <div className="no-data-title mt-2">{title} </div>
      </div>
    </>
  )
}

NoDataCOM.propTypes = {
  title: element
}

export default NoDataCOM
