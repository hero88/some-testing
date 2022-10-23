import { bool, object } from 'prop-types'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label } from 'reactstrap'

const ContractForm1COM = ({ intl, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()

  return (
    <Col className="mb-2" xs={6} lg={8}>
      <Label className="general-label" for="payoutRatio">
        <FormattedMessage id="Payout coefficient" />
        <span className="text-danger">&nbsp;(*)</span>
      </Label>
      <Input
        id="payoutRatio"
        name="payoutRatio"
        autoComplete="on"
        disabled={isReadOnly}
        innerRef={register()}
        invalid={!isReadOnly && !!errors.payoutRatio}
        valid={!isReadOnly && getValues('payoutRatio')?.trim() && !errors.payoutRatio}
        placeholder={intl.formatMessage({ id: 'Enter coefficient' })}
        
      />
      {errors?.payoutRatio && <FormFeedback>{errors?.payoutRatio?.message}</FormFeedback>}
    </Col>
  )
}

ContractForm1COM.propTypes = {
  intl: object,
  isReadOnly: bool
}

export const ContractForm1 = injectIntl(ContractForm1COM)
