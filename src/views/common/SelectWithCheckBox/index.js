import React from 'react'
import makeAnimated from 'react-select/animated'
import CustomSelect from './CustomSelect'
import ValueContainer from './ValueContainer'
import { components } from 'react-select'
import PropTypes from 'prop-types'
import { CustomInput, InputGroup } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

/* eslint-disable-next-line react/prop-types */
const Option = ({ children, ...props}) => {
  const onClickMultiOption = (e) => {
    /* eslint-disable-next-line react/prop-types */
    props.selectOption({...props.data})
    e.stopPropagation()
    e.preventDefault()
  }
  return (
    <div>
      <components.Option {...props}>
      { 
      /* eslint-disable-next-line react/prop-types */
      props.isMulti
        ? (<div onClick={onClickMultiOption}>
            <InputGroup>
              <CustomInput
                type='checkbox'
                className='custom-control-Primary mr-1'
                /* eslint-disable-next-line react/prop-types */
                checked={props.isSelected}
                onChange={() => null}
                /* eslint-disable-next-line react/prop-types */
                id={`ckbSelect_${props.value}`}
              />
              {/* eslint-disable-next-line react/prop-types */}
              <label>{props.label === 'Select all' ? <FormattedMessage id='Select all'/> : props.label}</label>
            </InputGroup>
          </div>
          ) : 
          /* eslint-disable-next-line react/prop-types */
          children
      }
      </components.Option>
    </div>
  )
}

const animatedComponents = makeAnimated()

const SelectWithCheckbox = ({
  options,
  value,
  setSelectedProjects
}) => {
  const handleChange = selected => {
    setSelectedProjects(selected)
  }

  return (
    <CustomSelect
      className='react-select custom-selected-item-menu'
      classNamePrefix='select'
      components={{
        Option,
        ValueContainer,
        animatedComponents
      }}
      options={options}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      onChange={handleChange}
      allowSelectAll={true}
      value={value}
    />
  )
}

SelectWithCheckbox.propTypes = {
  intl: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  setSelectedProjects: PropTypes.func.isRequired
}

export default injectIntl(SelectWithCheckbox)
