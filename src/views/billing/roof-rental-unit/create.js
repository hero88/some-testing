import '@src/@core/scss/billing-sweet-alert.scss'
import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { object } from 'prop-types'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import RoofUnit from './RoofUnitCUForm'
import { postRoofVendors } from './store/actions'

const CreateRoofRentalUnit = ({ intl }) => {
  const history = useHistory()
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const handleAddRoofVendors = (values) => {
    dispatch(
      postRoofVendors({
        params: { ...values, state: values?.state?.value, type: values.type?.value },
        callback: () => {
          dispatch({
            type: SET_FORM_DIRTY,
            payload: false
          })
            history.push(ROUTER_URL.BILLING_ROOF_RENTAL_UNIT)
        },
        skin,
        intl
      })
    )
  }

  const handleCancel = () => {
    history.push({
      pathname: `${ROUTER_URL.BILLING_ROOF_RENTAL_UNIT}`,
      state: {
        allowUpdate: true
      }
    })
  }
  return (
    <>
      <RoofUnit onCancel={handleCancel} onSubmit={handleAddRoofVendors} />
    </>
  )
}

CreateRoofRentalUnit.propTypes = {
  intl: object
}

export default injectIntl(CreateRoofRentalUnit)


export const Navbar = () => {
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    { name: intl.formatMessage({ id: 'roof-rental-unit' }), 
    link :ROUTER_URL.BILLING_ROOF_RENTAL_UNIT },
    { name: intl.formatMessage({ id: 'create-rental-unit' }), link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
