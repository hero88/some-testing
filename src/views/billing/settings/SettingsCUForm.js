import { yupResolver } from '@hookform/resolvers/yup'
import { GENERAL_STATUS, GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import { AbilityContext } from '@src/utility/context/Can'
import { selectThemeColors } from '@src/utility/Utils'
import { bool, func, object, string } from 'prop-types'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import * as yup from 'yup'

const SettingsCUForm = ({
  isViewed,
  intl,
  onSubmit = () => {},
  initValues,
  disabled,
  selectedSetting,
  handldeSetCurrentValue = () => {},
  handleSetIsReadOnly = () => {}
}) => {
  const ability = useContext(AbilityContext)
  const SETTING_STATUS_OPTS = [
    { value: OPERATION_UNIT_STATUS.ACTIVE, label: intl.formatMessage({ id: 'Active' }) },
    { value: OPERATION_UNIT_STATUS.INACTIVE, label: intl.formatMessage({ id: 'Inactive' }) }
  ]
  const initState = {
    state: SETTING_STATUS_OPTS[0]
  }

  const ValidateSchema = yup.object().shape(
    {
      name: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' })),

      code: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(15, intl.formatMessage({ id: 'max-validate' })),

      description: yup
        .string()
        .required(intl.formatMessage({ id: 'required-validate' }))
        .max(255, intl.formatMessage({ id: 'max-validate' }))
    },
    ['name', 'code', 'description']
  )

  const { handleSubmit, getValues, errors, control, register, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(isViewed ? yup.object().shape({}) : ValidateSchema),
    defaultValues: initValues || initState
  })
  useEffect(() => {
    reset({
      ...initValues,
      state: SETTING_STATUS_OPTS.find((item) => item.value === initValues?.state)
    })
  }, [initValues])

  const handleAddValue = () => {
    handleSetIsReadOnly(false)
    handldeSetCurrentValue({
      id: '-1',
      name: selectedSetting?.name,
      state: GENERAL_STATUS.ACTIVE
    })
  }
  return (
    <>
      <Form className="billing-form" key="customer-form" onSubmit={handleSubmit(onSubmit)}>
        {ability.can(USER_ACTION.EDIT, USER_FEATURE.CONFIG) && (
          <Row className="mb-2">
            <Col className=" d-flex justify-content-between align-items-center">
              <h4 className="typo-section"></h4>

              <Button.Ripple
                disabled={disabled}
                color="primary"
                className="add-project add-Value-button"
                onClick={handleAddValue}
              >
                <FormattedMessage id="Add new" />
              </Button.Ripple>
            </Col>
          </Row>
        )}
        <Row>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="code">
              <FormattedMessage id="Config Code" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              disabled={isViewed}
              id="code"
              name="code"
              autoComplete="on"
              innerRef={register()}
              invalid={!isViewed && !!errors.code}
              valid={!isViewed && getValues('code')?.trim() && !errors.code}
              placeholder={intl.formatMessage({ id: 'Enter Config Code' })}
            />
            {errors?.code && <FormFeedback>{errors?.code?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="name">
              <FormattedMessage id="Config Name" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              disabled={isViewed}
              id="name"
              name="name"
              autoComplete="on"
              invalid={!isViewed && !!errors.name}
              valid={!isViewed && getValues('name')?.trim() && !errors.name}
              innerRef={register()}
              placeholder={intl.formatMessage({ id: 'Enter Config Name' })}
            />
            {errors?.name && <FormFeedback>{errors?.name?.message}</FormFeedback>}
          </Col>
          <Col className="mb-2" md={4}>
            <Label className="general-label" for="state">
              <FormattedMessage id="Status" />
            </Label>
            <Controller
              as={Select}
              control={control}
              theme={selectThemeColors}
              name="state"
              id="state"
              isDisabled={isViewed}
              innerRef={register()}
              options={SETTING_STATUS_OPTS}
              className="react-select"
              classNamePrefix="select"
              placeholder={intl.formatMessage({ id: 'Select a status' })}
              formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
            />
          </Col>
        </Row>
        <Row>
          <Col className="mb-2" md={8}>
            <Label className="general-label" for="description">
              <FormattedMessage id="explain" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            <Input
              disabled={isViewed}
              id="description"
              name="description"
              autoComplete="on"
              innerRef={register()}
              invalid={!isViewed && !!errors.description}
              valid={!isViewed && getValues('description')?.trim() && !errors.description}
              placeholder={intl.formatMessage({ id: 'Enter Config Explain' })}
            />
            {errors?.description && <FormFeedback>{errors?.description?.message}</FormFeedback>}
          </Col>
        </Row>
        <Row></Row>
      </Form>
    </>
  )
}

SettingsCUForm.propTypes = {
  intl: object.isRequired,
  onSubmit: func,
  initValues: object,
  isViewed: bool,
  submitText: string,
  disabled: bool,
  selectedSetting: object,
  currValue: object,
  handldeSetCurrentValue: func,
  handleSetIsReadOnly: func
}

export default injectIntl(SettingsCUForm)
