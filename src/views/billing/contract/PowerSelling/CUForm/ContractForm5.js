import { bool, object } from 'prop-types'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label, Row } from 'reactstrap'

const ContractForm5COM = ({ intl, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()

  return (
    <Row>
      <Col className="mb-2" xs={12} lg={4}>
        <Label className="general-label" for="typeOfClock">
          <FormattedMessage id="Revenue share coefficient" />
          <span className="text-danger">&nbsp;(*)</span>
        </Label>
        <Input
          id="revenueShareRatio"
          name="revenueShareRatio"
          autoComplete="on"
          innerRef={register()}
          invalid={!isReadOnly && !!errors.revenueShareRatio}
          valid={!isReadOnly && getValues('revenueShareRatio')?.trim() && !errors.revenueShareRatio}
          disabled={isReadOnly}
          placeholder={intl.formatMessage({ id: 'Enter rate' })}
        />
        {errors?.revenueShareRatio && (
          <FormFeedback className="d-block">{errors?.revenueShareRatio?.message}</FormFeedback>
        )}
      </Col>
    </Row>
  )
}

ContractForm5COM.propTypes = {
  intl: object,
  isReadOnly: bool
}

export const ContractForm5 = injectIntl(ContractForm5COM)
