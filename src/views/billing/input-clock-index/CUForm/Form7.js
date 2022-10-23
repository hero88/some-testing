import { bool, object } from 'prop-types'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label } from 'reactstrap'

const Form7COM = ({ intl, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()

  return (
    <Col className="mb-2" md={4}>
      <Label className="general-label" for="reactivePowerIndex">
        <FormattedMessage id="Reactive power index" />
        <span className="text-danger">&nbsp;(*)</span>
      </Label>
      <Input
        id="reactivePowerIndex"
        name="reactivePowerIndex"
        autoComplete="on"
        disabled={isReadOnly}
        innerRef={register()}
        invalid={!isReadOnly && !!errors.reactivePowerIndex}
        valid={!isReadOnly && getValues('reactivePowerIndex')?.trim() && !errors.reactivePowerIndex}
        placeholder={intl.formatMessage({ id: 'Enter fee' })}
      />
      {errors?.reactivePowerIndex && <FormFeedback className="d-block">{errors?.reactivePowerIndex?.message}</FormFeedback>}
    </Col>
  )
}

Form7COM.propTypes = {
  intl: object,
  isReadOnly: bool
}

export const Form7 = injectIntl(Form7COM)
