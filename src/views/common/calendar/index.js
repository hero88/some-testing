import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button, ButtonGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Popover,
  PopoverBody,
  Row
} from 'reactstrap'
import {
  DISPLAY_DATE_FORMAT_CALENDAR,
  DISPLAY_DATE_TIME_FORMAT,
  INTERVAL_BUTTON,
  INTERVAL_YIELD
} from '@constants/common'
import { FormattedMessage, injectIntl } from 'react-intl'
import { DatePicker, DateRangePicker } from 'element-react/next'
import { renderFormatDatePicker, renderSelectionMode, selectUnitOfTime } from '@utils'
import { ReactComponent as CalendarIcon } from '@src/assets/images/svg/table/ic-calendar.svg'
import moment from 'moment'

export const CustomCalendar = ({
  intl,
  onChangeIntervalButton,
  picker,
  onChangePicker,
  rangePicker,
  onChangeRangePicker,
  disabled
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [pickerState, setPickerState] = useState(picker)
  const [rangePickerState, setRangePickerState] = useState(rangePicker)
  const [selectedButton, setSelectedButton] = useState({
    id: INTERVAL_BUTTON.DAY,
    label: 'Day',
    interval: INTERVAL_YIELD.DAILY,
    chartType: 'line',
    unitOfTime: 'd',
    timeStep: 5 * 60
  })

  const handleConfirm = () => {
    if (onChangePicker) {
      onChangePicker(pickerState)
    }

    if (onChangeRangePicker) {
      onChangeRangePicker(rangePickerState)
    }

    if (!disabled && onChangeIntervalButton) {
      const fromDate = selectedButton.id === INTERVAL_BUTTON.DAY
        ? rangePickerState?.[0]
        : pickerState
      const toDate = selectedButton.id === INTERVAL_BUTTON.DAY
        ? rangePickerState?.[1]
        : pickerState

      if (fromDate && toDate) {
        onChangeIntervalButton({ selectedButton, fromDate, toDate })
      }
    }

    setPopoverOpen(!popoverOpen)
  }

  const renderSelectIntervalButtons = () => {
    const buttons = [
      {
        id: INTERVAL_BUTTON.DAY,
        label: 'Day',
        interval: INTERVAL_YIELD.DAILY,
        chartType: 'line',
        unitOfTime: 'd',
        timeStep: 5 * 60
      },
      {
        id: INTERVAL_BUTTON.WEEK,
        label: 'Week',
        interval: INTERVAL_YIELD.DAILY,
        chartType: 'bar',
        unitOfTime: 'isoWeek',
        timeStep: 24 * 60 * 60
      },
      {
        id: INTERVAL_BUTTON.MONTH,
        label: 'Month',
        interval: INTERVAL_YIELD.DAILY,
        chartType: 'bar',
        unitOfTime: 'month',
        timeStep: 1
      },
      {
        id: INTERVAL_BUTTON.YEAR,
        label: 'Year',
        interval: INTERVAL_YIELD.MONTHLY,
        chartType: 'bar',
        unitOfTime: 'year',
        timeStep: 1
      }
    ]

    return buttons.map((button, index) => {
      return (
        <Button
          key={index}
          color='primary'
          outline
          onClick={() => {
            setSelectedButton(button)
            if (button.id === INTERVAL_BUTTON.DAY) {
              setRangePickerState([new Date(), new Date()])
            } else {
              setPickerState(new Date())
            }
          }}
          active={selectedButton.id === button.id}
        >
          <FormattedMessage id={button.label}/>
        </Button>
      )
    })
  }

  const renderDatePicker = ({ type, currentRangePicker, currentPicker }) => {
    switch (type) {
      case INTERVAL_BUTTON.DAY: {
        return <DateRangePicker
          value={currentRangePicker}
          placeholder={intl.formatMessage({ id: `Pick day` })}
          onChange={(date) => setRangePickerState(date || [new Date(), new Date()])}
          disabledDate={time => time.getTime() > Date.now()}
          firstDayOfWeek={1}
          format={DISPLAY_DATE_FORMAT_CALENDAR}
        />
      }

      default: {
        return <DatePicker
          value={pickerState}
          placeholder={intl.formatMessage({ id: `Pick a ${renderSelectionMode(type)}` })}
          onChange={(date) => {
            setPickerState(date || new Date())
          }}
          disabledDate={time => time.getTime() > Date.now()}
          format={renderFormatDatePicker({ key: type, picker: currentPicker })}
          selectionMode={renderSelectionMode(type)}
          firstDayOfWeek={1}
        />
      }
    }
  }

  const renderInputValue = (date) => {
    if (date && Array.isArray(date)) {
      const fromDate = moment(date[0]).startOf(selectUnitOfTime(selectedButton.id)).format(DISPLAY_DATE_TIME_FORMAT),
        toDate = moment(date[1]).endOf(selectUnitOfTime(selectedButton.id)).format(DISPLAY_DATE_TIME_FORMAT)

      return `${fromDate} - ${toDate}`
    }

    return ''
  }

  return (
    <>
      <InputGroup
        className='input-group-merge'
        id='customCalendar'
        onClick={() => setPopoverOpen(!popoverOpen)}
      >
        <Input
          readOnly
          value={
            selectedButton.id === INTERVAL_BUTTON.DAY
              ? renderInputValue(rangePickerState)
              : renderInputValue(pickerState ? [pickerState, pickerState] : null)
          }
          placeholder={intl.formatMessage({ id: 'Pick day' })}
        />
        <InputGroupAddon addonType='append'>
          <InputGroupText>
            <CalendarIcon/>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <Popover
        className='calendar-popover'
        placement='bottom'
        target='customCalendar'
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(!popoverOpen)}
      >
        <PopoverBody>
          <Row className='mt-1'>
            <ButtonGroup className='borderline-group'>
              {renderSelectIntervalButtons()}
            </ButtonGroup>
          </Row>
          <Row className='mt-1'>
            {renderDatePicker({
              type: selectedButton.id,
              currentPicker: pickerState,
              currentRangePicker: rangePickerState
            })}
          </Row>
          <Row className='mt-1 d-flex justify-content-end'>
            <Button
              color='primary'
              onClick={handleConfirm}
            >
              <FormattedMessage id='Confirm'/>
            </Button>
          </Row>
        </PopoverBody>
      </Popover>
    </>
  )
}

CustomCalendar.propTypes = {
  intl: PropTypes.object,
  onChangeIntervalButton: PropTypes.func.isRequired,
  picker: PropTypes.any,
  onChangePicker: PropTypes.func.isRequired,
  rangePicker: PropTypes.any,
  onChangeRangePicker: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default injectIntl(CustomCalendar)
