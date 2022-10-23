import { useEffect, useState } from 'react'
import { Collapse, CustomInput } from 'reactstrap'
import { ChevronDown, ChevronUp } from 'react-feather'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CheckboxTree = ({ checkboxData, checkedObj, setCheckedObj, optionObj, setOptionObj }) => {
  const [open, setOpen] = useState({})

  const toggle = ({ name }) => {
    setOpen(currentState => (
      {
        ...currentState,
        [name]: !currentState[name]
      }
    ))
  }

  const checkAllChildren = ({ currentState, children, checked, name }) => {
    let tempChecked = { ...currentState }

    if (children?.length > 0) {
      children.forEach(item => {
        tempChecked = {
          ...tempChecked,
          ...checkAllChildren({
              currentState: tempChecked,
              children: item.children,
              checked,
              name: item.key ? item.key : item.value
            }
          )
        }
      })
    } else {
      tempChecked[name] = checked
    }

    return tempChecked
  }

  const handleChangeCheckbox = ({ event, children, isRadio }) => {
    const { name, checked, value } = event.target

    if (isRadio && setOptionObj) {
      setOptionObj(currentState => (
        {
          ...currentState,
          [name]: value
        }
      ))
    } else if (setCheckedObj) {
      setCheckedObj((currentState) => {
        const tempChecked = checkAllChildren({ currentState, children, checked, name })

        return {
          ...tempChecked,
          [name]: checked
        }
      })
    }
  }

  const checkingAllChildrenChecked = ({ name, children }) => {
    if (children?.length > 0) {
      return children.every(item => {
        return checkingAllChildrenChecked({ name: item.key ? item.key : item.value, children: item.children })
      })
    }

    return !!checkedObj[name]
  }

  const checkingIsCheckedByKey = ({ name, children }) => {
    return checkingAllChildrenChecked({ name, children })
  }

  const openAllCollapse = ({ currentState, data }) => {
    let tempOpen = { ...currentState }

    data.forEach(item => {
      if (item?.children?.length > 0) {
        tempOpen[item.key ? item.key : item.value] = true
        tempOpen = {
          ...tempOpen,
          ...openAllCollapse({ currentState: tempOpen, data: item.children })
        }
      }
    })

    return tempOpen
  }

  // Component did mount
  useEffect(() => {
    setOpen((currentState) => (
      {
        ...currentState,
        ...openAllCollapse({ currentState, data: checkboxData })
      }
    ))
  }, [])

  const renderCheckboxes = (checkboxes) => {
    return checkboxes.map((ckb, index) => {
      return (
        <div key={index} className={classnames('checkbox-tree-container', ckb.containerClass)}>
          <div
            className='header'
            onClick={() => toggle({ name: ckb.value })}
          >
            {
              ckb.isTextOnly
                ? <div className='custom-control-Primary'>
                  {ckb.label}
                </div>
                : <CustomInput
                  type={ckb.isRadio ? 'radio' : 'checkbox'}
                  className='custom-control-Primary'
                  checked={
                    ckb.isRadio
                      ? optionObj[ckb.radioName] === ckb.value
                      : checkingIsCheckedByKey({
                        children: ckb.children,
                        name: ckb.key ? ckb.key : ckb.value
                      })
                  }
                  onChange={(event) => handleChangeCheckbox({
                    event,
                    children: ckb.children,
                    isRadio: ckb.isRadio
                  })}
                  value={ckb.key ? ckb.key : ckb.value}
                  id={ckb.value}
                  name={ckb.isRadio ? ckb.radioName : ckb.key ? ckb.key : ckb.value}
                  label={ckb.label}
                  disabled={
                    optionObj && ckb.disabledKey && ckb.disabledValue && optionObj[ckb.disabledKey] !== ckb.disabledValue
                  }
                />
            }
            {
              ckb?.children?.length > 0
                ? <div>
                  {
                    open[ckb.key ? ckb.key : ckb.value]
                      ? <ChevronUp size={18} />
                      : <ChevronDown size={18} />
                  }
                </div>
                : null
            }
          </div>

          {
            ckb?.children?.length > 0
              ? <Collapse
                isOpen={open[ckb.value]}
              >
                {renderCheckboxes(ckb.children)}
              </Collapse>
              : null
          }

        </div>
      )
    })
  }

  return (
    renderCheckboxes(checkboxData)
  )
}

CheckboxTree.propTypes = {
  checkboxData: PropTypes.array.isRequired,
  checkedObj: PropTypes.object,
  setCheckedObj: PropTypes.func,
  optionObj: PropTypes.object,
  setOptionObj: PropTypes.func
}

export default CheckboxTree
