import { ROUTER_URL } from '@src/utility/constants'
import { object } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import SettingsCUForm from './SettingsCUForm'
import ValueTable from './configValue/index'
import { useDispatch, useSelector } from 'react-redux'
import { getBillingSettingById } from './store/actions'

const UpdateConfig = () => {
  const history = useHistory()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const [currValue, setCurrentValue] = useState(null)
  const {
    settings: { selectedSetting }
  } = useSelector((state) => state)

  const dispatch = useDispatch()
  const { id } = useParams()
  useEffect(() => {
    dispatch(
      getBillingSettingById({
        id,
        isSavedToState: true
      })
    )
  }, [id])
  const handleCancel = () => {
    history.push(ROUTER_URL.BILLING_SETTING)
  }
  const handleSetIsReadOnly = (value) => {
    setIsReadOnly(value)
  }
  const handldeSetCurrentValue = (value) => {
    setCurrentValue(value)
  }
  return (
    <>
      <SettingsCUForm
        isViewed
        initValues={selectedSetting}
        handleSetIsReadOnly={handleSetIsReadOnly}
        selectedSetting={selectedSetting}
        handldeSetCurrentValue={handldeSetCurrentValue}
      />
      <ValueTable
        currValue={currValue}
        configId={id}
        onCancel={handleCancel}
        isReadOnly={isReadOnly}
        handleSetIsReadOnly={handleSetIsReadOnly}
        handldeSetCurrentValue={handldeSetCurrentValue}
      />
    </>
  )
}

UpdateConfig.propTypes = {
  intl: object
}

export default injectIntl(UpdateConfig)
