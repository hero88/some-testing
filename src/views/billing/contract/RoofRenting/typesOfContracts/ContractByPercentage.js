import { bool } from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label, Row } from 'reactstrap'

const ContractByPercentage = ({ isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()
  return (
    <>
      <Row className="justify-content-between">
        <Col className="mb-3 d-flex align-items-center" md={2}>
          <Label className="general-label">
            <FormattedMessage id="turnover-rate" />
            <span className="text-danger">&nbsp;(*)</span>

          </Label>
        </Col>
        <Col className="mb-3" md={2}>
          <Input
            disabled={isReadOnly}
            id="percentTurnover"
            name="percentTurnover"
            autoComplete="on"
            innerRef={register()}
            invalid={!!errors.percentTurnover}
            valid={getValues('percentTurnover')?.trim() && !errors.percentTurnover && !isReadOnly}
            defaultValue={0}
          />
          {errors?.percentTurnover && <FormFeedback>{errors?.percentTurnover?.message}</FormFeedback>}
        </Col>
        <Col xs={0} lg={1} className="divider-vertical" />
<Col className="mb-3 d-flex align-items-center" md={4}>
          <div>
            <Label className="general-label">
              <FormattedMessage id="confirmation-prompt" />
              <span className="text-danger">&nbsp;(*)</span>

            </Label>
            &nbsp; (
            <FormattedMessage id="Date" />
            ) (
            <FormattedMessage id="From-date-sending-notice" />)
          </div>
        </Col>
        <Col className="mb-3" md={2}>
          <Input
            disabled={isReadOnly}
            id="confirmationReminder"
            name="confirmationReminder"
            autoComplete="on"
            innerRef={register()}
            invalid={!!errors.confirmationReminder}
            valid={getValues('confirmationReminder')?.trim() && !errors.confirmationReminder && !isReadOnly}
            defaultValue={0}
          />
          {errors?.confirmationReminder && <FormFeedback>{errors?.confirmationReminder?.message}</FormFeedback>}
        </Col>
      </Row>
    </>
  )
}
ContractByPercentage.propTypes = {
  isReadOnly: bool
}

export default injectIntl(ContractByPercentage)
