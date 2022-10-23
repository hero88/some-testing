import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { object } from 'prop-types'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import OperationCUForm from './OperationUnitCUForm'
import { postOperationUnit } from './store/actions'

const CreateOperationUnit = ({ intl }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const handleAddOperationUnit = (values) => {
    dispatch(
      postOperationUnit({
        params: { ...values, state: values.state?.value },
        callback: () => {
          dispatch({
            type: SET_FORM_DIRTY,
            payload: false
          })
          history.push(ROUTER_URL.BILLING_OPERATION_UNIT)
        },
        skin,
        intl
      })
    )
  }

  const handleCancel = () => {
    history.push({
      pathname: `${ROUTER_URL.BILLING_OPERATION_UNIT}`,
      state: {
        allowUpdate: true
      }
    })
  }

  return <OperationCUForm onSubmit={handleAddOperationUnit} onCancel={handleCancel} />
}

CreateOperationUnit.propTypes = {
  intl: object
}

export default injectIntl(CreateOperationUnit)

export const Navbar = () => {
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'operation-units' }),
      link: ROUTER_URL.BILLING_OPERATION_UNIT
    },
    {
      name: intl.formatMessage({ id: 'create-operation-unit' }),
      link: ''
    }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
