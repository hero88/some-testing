import React from 'react'
import PropTypes from 'prop-types'
import { default as ReactSelect } from 'react-select'

const CustomSelect = props => {
  if (props.allowSelectAll) {
    return (
      <ReactSelect
        {...props}
        options={(props.options?.length === 0 || props.options?.length === 1) ? props.options : [props.allOption, ...props.options]}
        onChange={(selected, event) => {
          if (selected !== null && selected.length > 0) {
            if (selected[selected.length - 1].value === props.allOption.value) {
              return props.onChange([props.allOption, ...props.options])
            }
            let result = []
            if (selected.length === props.options.length) {
              if (selected[0].value === props.allOption.value) {
                result = selected.filter(
                  option => option.value !== props.allOption.value
                )
              } else if (event.action === 'select-option') {
                if (props.options?.length === 1) {
                  result = selected
                } else {
                  result = [props.allOption, ...props.options]
                }
              }
              return props.onChange(result)
            }
          }

          return props.onChange(selected)
        }}
      />
    )
  }

  return <ReactSelect {...props} />
}

CustomSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })
}

CustomSelect.defaultProps = {
  allOption: {
    label: 'Select all',
    value: '*'
  }
}

export default CustomSelect