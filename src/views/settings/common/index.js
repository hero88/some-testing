import React, { Fragment } from 'react'
import {
  Col,
  Card,
  CustomInput,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Label from 'reactstrap/es/Label'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// import classnames from 'classnames'

const SwitchIcon = () => (
  <>
    <span className='switch-icon-left'>
      {/*<Check size={14} />*/}
    </span>
    <span className='switch-icon-right'>
      {/*<X size={14} />*/}
    </span>
  </>
)

export const renderItems = ({
  items,
  intl,
  control,
  errors,
  register,
  watch
  // mdNumber = 6
  // isWrap
}) => {
  return items.map((item, index) => (
    <Col
      key={index}
      lg={6} md={12} xs={12}
      // md={mdNumber}
      // className={classnames({
      //   ['mr-1']: index % 2 === 0 && !isWrap,
      //   ['ml-1']: index % 2 !== 0 && !isWrap
      // })}
    >
      <Card>
        {
          item.isShow &&
          <>
            <Col md={8} xs={12} className='d-flex align-items-center'>
              <aside className='mr-1'>
                {item.icon ? (
                  <span>{item.icon}</span>
                ) : item.switch ? (
                  <FormGroup>
                    <CustomInput
                      id={item.swId}
                      name={item.swName}
                      innerRef={register()}
                      type='switch'
                      label={<SwitchIcon />}
                      className='custom-control-primary'
                      inline
                      // defaultValue={item.swDefaultValue}
                      defaultChecked={item.swDefaultValue}
                      disabled={item.isDisableSwitch}
                    />
                  </FormGroup>
                ) : (
                  ''
                )}
              </aside>
              <aside>
                <h5>
                  <FormattedMessage id={item.title} />
                </h5>
                <Label>
                  <FormattedHTMLMessage id={item.label} values={{ value: watch(item.name) || 0, unit: item.unit }} />
                </Label>
              </aside>
            </Col>

            {
              item.inputType &&
              <Col md={4} xs={12}>
                <FormGroup>
                  <InputGroup>
                    {
                      item.inputType === 'select'
                        ? (
                          <Controller
                            id={item.id}
                            name={item.name}
                            as={Select}
                            control={control}
                            isClearable={item.multiSelect}
                            isMulti={item.multiSelect}
                            theme={selectThemeColors}
                            defaultValue={item.defaultValue}
                            options={item.options}
                            className='react-select'
                            classNamePrefix='select'
                            formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                          />
                        )
                        : item.inputType === 'number'
                          ? (
                            <>
                              <Input
                                type='number'
                                min={item.minValue || 0}
                                step={item.step || 0.01}
                                id={item.id}
                                name={item.name}
                                autoComplete='on'
                                defaultValue={item.defaultValue}
                                innerRef={register()}
                                invalid={!!errors[item.name]}
                                placeholder={item.placeholder}
                                readOnly={item.isReadOnly}
                              />
                              {errors && errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
                            </>
                          )
                          : (
                            <>
                              <Input
                                type='text'
                                id={item.id}
                                name={item.name}
                                autoComplete='on'
                                defaultValue={item.defaultValue}
                                innerRef={register()}
                                invalid={!!errors[item.name]}
                                placeholder={item.placeholder}
                                readOnly={item.isReadOnly}
                              />
                              {errors && errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
                            </>
                          )
                    }
                    {item.unit && item.inputType !== '' && (
                      <InputGroupAddon addonType='append'>
                        <InputGroupText>{item.unit}</InputGroupText>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </FormGroup>
              </Col>
            }
          </>
        }
      </Card>
    </Col>
  ))
}
