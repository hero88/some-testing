import { bool, object } from 'prop-types'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label } from 'reactstrap'

const Form5COM = ({ intl, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()

  return (
    <Col className="mb-2" md={4}>
      <Label className="general-label" for="sellingRevenue">
        <FormattedMessage id="EVN selling revenue" />
        <span className="text-danger">&nbsp;(*)</span>
      </Label>
      <Input
        id="sellingRevenue"
        name="sellingRevenue"
        autoComplete="on"
        disabled={isReadOnly}
        innerRef={register()}
        invalid={!isReadOnly && !!errors.sellingRevenue}
        valid={!isReadOnly && getValues('sellingRevenue')?.trim() && !errors.sellingRevenue}
        placeholder={intl.formatMessage({ id: 'Enter revenue' })}
        defaultValue={0}
      />
      {errors?.sellingRevenue && <FormFeedback className="d-block">{errors?.sellingRevenue?.message}</FormFeedback>}
    </Col>
  )
}

Form5COM.propTypes = {
  intl: object,
  isReadOnly: bool
}

export const Form5 = injectIntl(Form5COM)
