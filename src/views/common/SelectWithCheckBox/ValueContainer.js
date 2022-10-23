import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { components } from 'react-select'

const allOption = {
  label: 'Select all',
  value: '*'
}

const ValueContainer = ({ intl, children, ...props }) => {
  // eslint-disable-next-line react/prop-types
  const currentValues = props.getValue()
  let toBeRendered = children

  if (currentValues.some(val => val.value === allOption.value)) {
    toBeRendered = [`${intl.formatMessage({ id: 'All projects are selected' })}`, children[1]]
  } else if (children[0]?.length === undefined || children[0]?.length === null) {
    toBeRendered = [`${intl.formatMessage({ id: 'No projects are selected' })}`, children[1]]
  } else if (children[0].length === 1) {
    toBeRendered = [`${intl.formatMessage({ id: '1 project is selected' })}`, children[1]]
  } else {
    toBeRendered = [`${children[0].length} ${intl.formatMessage({ id: 'projects are selected' })}`, children[1]]
  }

  return (
    <components.ValueContainer {...props}>
      {toBeRendered}
    </components.ValueContainer>
  )
}

ValueContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  children: PropTypes.any
}

export default injectIntl(ValueContainer)
