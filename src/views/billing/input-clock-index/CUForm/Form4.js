import { bool, object } from 'prop-types'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label } from 'reactstrap'

const Form4COM = ({ intl, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()

  return (
    <Col className="mb-2" md={4}>
      <Label className="general-label" for="sellingExchangeRate">
        <FormattedMessage id="Selling rate" />
        <span className="text-danger">&nbsp;(*)</span>
      </Label>
      <Input
        id="sellingExchangeRate"
        name="sellingExchangeRate"
        autoComplete="on"
        disabled={isReadOnly}
        innerRef={register()}
        invalid={!isReadOnly && !!errors.sellingExchangeRate}
        valid={!isReadOnly && getValues('sellingExchangeRate')?.trim() && !errors.sellingExchangeRate}
        placeholder={intl.formatMessage({ id: 'Enter exchange rate' })}
        defaultValue={0}
      />
      {errors?.sellingExchangeRate && <FormFeedback className="d-block">{errors?.sellingExchangeRate?.message}</FormFeedback>}
    </Col>
  )
}

Form4COM.propTypes = {
  intl: object,
  isReadOnly: bool
}

export const Form4 = injectIntl(Form4COM)
