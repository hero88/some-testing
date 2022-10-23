import { any } from 'prop-types'
import React, { useMemo } from 'react'
import { components } from 'react-select'
import './style.scss'

export default function ValueContOfMultipleSelect({ children, ...props }) {
  const [values, input] = children
  const MultiValuesComponent = useMemo(() => {
    if (Array.isArray(values)) {
      return values.reduce((valueSentence, currentValue, currentIndex) => {
        const val = currentValue.props?.data?.label
        if (currentIndex === 0) return val
        return `${valueSentence}, ${val}`
      }, '')
    }
    return values
  }, [values])

  return (
    <components.ValueContainer {...props}>
      <div className="multiple-value-container">{MultiValuesComponent}</div>
      {input}
    </components.ValueContainer>
  )
}

ValueContOfMultipleSelect.propTypes = {
  children: any
}
