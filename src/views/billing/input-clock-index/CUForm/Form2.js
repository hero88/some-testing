import { bool, object } from 'prop-types'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormFeedback, Input, Label, Row } from 'reactstrap'

const Form2COM = ({ intl, isReadOnly }) => {
  const { register, errors, getValues } = useFormContext()

  return (
    <>
      <Row>
        <Col className="mb-2" md={5}>
          <Row>
            <Col>
              <h4 className="typo-section mb-2">
                <FormattedMessage id="EVN start index" />
              </h4>
            </Col>
          </Row>
          <Row>
            <Col className="mb-2" md={4}>
              <Row>
                <Col md="auto" className="d-flex align-items-center">
                  {' '}
                  <Label className="general-label mb-0" for="mediumStart">
                    <FormattedMessage id="M" />
                    <span className="text-danger">&nbsp;(*)</span>
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="mediumStart"
                    name="mediumStart"
                    autoComplete="on"
                    disabled={isReadOnly}
                    innerRef={register()}
                    invalid={!isReadOnly && !!errors.mediumStart}
                    valid={!isReadOnly && getValues('mediumStart')?.trim() && !errors.mediumStart}
                    placeholder={intl.formatMessage({ id: 'Enter index' })}
                    defaultValue={0}
                  />
                </Col>
              </Row>

              {errors?.mediumStart && (
                <FormFeedback className="d-block text-right">{errors?.mediumStart?.message}</FormFeedback>
              )}
            </Col>
            <Col className="mb-2" md={4}>
              <Row>
                <Col md="auto" className="d-flex align-items-center">
                  {' '}
                  <Label className="general-label mb-0" for="highStart">
                    <FormattedMessage id="H" />
                    <span className="text-danger">&nbsp;(*)</span>
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="highStart"
                    name="highStart"
                    autoComplete="on"
                    disabled={isReadOnly}
                    innerRef={register()}
                    invalid={!isReadOnly && !!errors.highStart}
                    valid={!isReadOnly && getValues('highStart')?.trim() && !errors.highStart}
                    placeholder={intl.formatMessage({ id: 'Enter index' })}
                    defaultValue={0}
                  />
                </Col>
              </Row>

              {errors?.highStart && (
                <FormFeedback className="d-block text-right">{errors?.highStart?.message}</FormFeedback>
              )}
            </Col>
            <Col className="mb-2" md={4}>
              <Row>
                <Col md="auto" className="d-flex align-items-center">
                  <Label className="general-label mb-0" for="lowStart">
                    <FormattedMessage id="L" />
                    <span className="text-danger">&nbsp;(*)</span>
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="lowStart"
                    name="lowStart"
                    autoComplete="on"
                    disabled={isReadOnly}
                    innerRef={register()}
                    invalid={!isReadOnly && !!errors.lowStart}
                    valid={!isReadOnly && getValues('lowStart')?.trim() && !errors.lowStart}
                    placeholder={intl.formatMessage({ id: 'Enter index' })}
                    defaultValue={0}
                  />
                </Col>
              </Row>

              {errors?.lowStart && (
                <FormFeedback className="d-block text-right">{errors?.lowStart?.message}</FormFeedback>
              )}
            </Col>
          </Row>
        </Col>
        <Col md={1} className="divider-vertical"></Col>

        <Col className="mb-2" md={{ size: 5, offset: 1 }}>
          <Row>
            <Col>
              <h4 className="typo-section mb-2">
                <FormattedMessage id="EVN end index" />
              </h4>
            </Col>
          </Row>
          <Row>
            <Col className="mb-2" md={4}>
              <Row>
                <Col md="auto" className="d-flex align-items-center">
                  <Label className="general-label mb-0" for="mediumEnd">
                    <FormattedMessage id="M" />
                    <span className="text-danger">&nbsp;(*)</span>
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="mediumEnd"
                    name="mediumEnd"
                    autoComplete="on"
                    disabled={isReadOnly}
                    innerRef={register()}
                    invalid={!isReadOnly && !!errors.mediumEnd}
                    valid={!isReadOnly && getValues('mediumEnd')?.trim() && !errors.mediumEnd}
                    placeholder={intl.formatMessage({ id: 'Enter index' })}
                    defaultValue={0}
                  />
                </Col>
              </Row>

              {errors?.mediumEnd && (
                <FormFeedback className="d-block text-right">{errors?.mediumEnd?.message}</FormFeedback>
              )}
            </Col>
            <Col className="mb-2" md={4}>
              <Row>
                <Col md="auto" className="d-flex align-items-center">
                  <Label className="general-label mb-0" for="highEnd">
                    <FormattedMessage id="H" />
                    <span className="text-danger">&nbsp;(*)</span>
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="highEnd"
                    name="highEnd"
                    autoComplete="on"
                    disabled={isReadOnly}
                    innerRef={register()}
                    invalid={!isReadOnly && !!errors.highEnd}
                    valid={!isReadOnly && getValues('highEnd')?.trim() && !errors.highEnd}
                    placeholder={intl.formatMessage({ id: 'Enter index' })}
                    defaultValue={0}
                  />
                </Col>
              </Row>

              {errors?.highEnd && (
                <FormFeedback className="d-block text-right">{errors?.highEnd?.message}</FormFeedback>
              )}
            </Col>
            <Col className="mb-2" md={4}>
              <Row>
                <Col md="auto" className="d-flex align-items-center">
                  <Label className="general-label mb-0" for="lowEnd">
                    <FormattedMessage id="L" />
                    <span className="text-danger">&nbsp;(*)</span>
                  </Label>
                </Col>
                <Col>
                  <Input
                    id="lowEnd"
                    name="lowEnd"
                    autoComplete="on"
                    disabled={isReadOnly}
                    innerRef={register()}
                    invalid={!isReadOnly && !!errors.lowEnd}
                    valid={!isReadOnly && getValues('lowEnd')?.trim() && !errors.lowEnd}
                    placeholder={intl.formatMessage({ id: 'Enter index' })}
                    defaultValue={0}
                  />
                </Col>
              </Row>

              {errors?.lowEnd && <FormFeedback className="d-block text-right">{errors?.lowEnd?.message}</FormFeedback>}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

Form2COM.propTypes = {
  intl: object,
  isReadOnly: bool
}

export const Form2 = injectIntl(Form2COM)
