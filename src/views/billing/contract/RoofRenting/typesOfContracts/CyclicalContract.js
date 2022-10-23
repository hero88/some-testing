import { ISO_STANDARD_FORMAT } from '@src/utility/constants'
import moment from 'moment'
import { bool, object } from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label, Row } from 'reactstrap'

const MonthlyRents = ({ typeContract, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()
  return (
    <>
      <Row className="justify-content-between">
        <Col className="mb-3 justify-content-start d-flex align-items-center" md={3}>
          <div>
            <Label className="general-label">
              <FormattedMessage id="roof-rental-period" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            &nbsp; (
            <FormattedMessage id="start-date" />)
          </div>
        </Col>
        <Col className="mb-3" md={2}>
          <Input
            id="startDate"
            name="startDate"
            disabled={isReadOnly}
            autoComplete="on"
            innerRef={register()}
            invalid={!!errors.startDate}
            valid={getValues('startDate')?.trim() && !errors.startDate && !isReadOnly}
            type="date"
            defaultValue={moment().format(ISO_STANDARD_FORMAT)}
            className="custom-icon-input-date"
          />
          {errors?.startDate && <FormFeedback>{errors?.startDate?.message}</FormFeedback>}
        </Col>
        <Col xs={0} lg={1} className="divider-vertical" />

        <Col className="mb-3 justify-content-start d-flex align-items-center" md={3}>
          <div>
            <Label className="general-label">
              <FormattedMessage id="Notice-of-roof-rent" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            &nbsp; (
            <FormattedMessage id="Date" />
            ) (
            <FormattedMessage id="from-the-last-day" />)
          </div>
        </Col>
        <Col className="mb-3" md={2}>
          <Input
            disabled={isReadOnly}
            id="announcementDate"
            name="announcementDate"
            autoComplete="on"
            innerRef={register()}
            invalid={!!errors.announcementDate}
            valid={getValues('announcementDate')?.trim() && !errors.announcementDate && !isReadOnly}
            defaultValue={0}
          />
          {errors?.announcementDate && <FormFeedback>{errors?.announcementDate?.message}</FormFeedback>}
        </Col>
      </Row>
      <Row className="justify-content-between">
        <Col className="mb-3 justify-content-start d-flex align-items-center" md={3}>
          <div>
            <Label className="general-label">
              <FormattedMessage id="rental-amount" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            &nbsp; (
            <FormattedMessage id={typeContract.value === 2 ? 'vnd-month' : 'vnd-quarter'} />)
          </div>
        </Col>
        <Col className="mb-3" md={2}>
          <Input
            disabled={isReadOnly}
            id="rentalAmount"
            name="rentalAmount"
            autoComplete="on"
            innerRef={register()}
            invalid={!!errors.rentalAmount}
            valid={getValues('rentalAmount')?.trim() && !errors.rentalAmount && !isReadOnly}
            defaultValue={0}
          />
          {errors?.rentalAmount && <FormFeedback>{errors?.rentalAmount?.message}</FormFeedback>}
        </Col>
        <Col xs={0} lg={1} className="divider-vertical" />

        <Col className="mb-3 justify-content-start d-flex align-items-center" md={3}>
          <div>
            <Label className="general-label">
              <FormattedMessage id="confirmation-prompt" />
              <span className="text-danger">&nbsp;(*)</span>
            </Label>
            &nbsp; (
            <FormattedMessage id="Date" />
            ) (
            <FormattedMessage id="from-the-last-day" />)
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
MonthlyRents.propTypes = {
  typeContract: object.isRequired,
  isReadOnly: bool
}

export default injectIntl(MonthlyRents)
