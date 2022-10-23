import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { object } from 'prop-types'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import CUForm from './CUForm'
import { addManualInputIndex } from './store/actions'

const CreateInputClockIndex = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmitManualInputIndex = (payload) => {
    dispatch(
      addManualInputIndex({
        payload,
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

  const handleCancel = () => {
    history.push(`${ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK}`)
  }

  return <CUForm onSubmit={handleSubmitManualInputIndex} onCancel={handleCancel} />
}

CreateInputClockIndex.propTypes = {
  intl: object
}

export default injectIntl(CreateInputClockIndex)

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
      name: intl.formatMessage({ id: 'Add manual input index' }),
      link: ''
    }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
