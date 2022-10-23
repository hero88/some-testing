import { ROUTER_URL, SET_FORM_DIRTY, SET_SELECTED_INPUT_CLOCK_INDEX } from '@src/utility/constants'
import { object } from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
// import { getOperationUnitById, putOperationUnit } from './store/actions'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import CUForm from './CUForm'
import { getManualInputIndexById, updateManualInputIndex } from './store/actions'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const UpdateInputClockIndex = () => {
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const dispatch = useDispatch()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const {
    billingInputClockIndex: { selectedInputClockIndex }
  } = useSelector((state) => state)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  useEffect(() => {
    return () => {
      dispatch({
        type: SET_SELECTED_INPUT_CLOCK_INDEX,
        payload: {}
      })
    }
  }, [])

  const { id } = useParams()
  useEffect(() => {
    dispatch(
      getManualInputIndexById({
        id,
        isSavedToState: true,
        callback: () => {}
      })
    )
  }, [id])

  const handleCancel = () => {
    history.push(ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK)
  }

  const handleUpdateOperationUnit = (values) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      console.log('values', values, selectedInputClockIndex)
      dispatch(
        updateManualInputIndex({
          payload: values,
          oldPayload: selectedInputClockIndex,
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(`${ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK}`)
          }
        })
      )
    }
  }
  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.BILL_PARAMS)

  return (
    <>
      {selectedInputClockIndex?.id && (
        <CUForm
          onSubmit={handleUpdateOperationUnit}
          onCancel={handleCancel}
          initValues={selectedInputClockIndex}
          isReadOnly={isReadOnly}
          submitClassname={!checkUpdateAbility && 'd-none'}
        />
      )}
    </>
  )
}

UpdateInputClockIndex.propTypes = {
  intl: object
}

export default injectIntl(UpdateInputClockIndex)

export const Navbar = () => {
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'electricity-index' }),
      link: ''
    },
    {
      name: intl.formatMessage({ id: 'manual-input-index' }),
      link: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK
    },
    {
      name: intl.formatMessage({ id: 'Detail of billing data' }),
      link: ''
    }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
