import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import { object } from 'prop-types'
import React, { useState, useEffect, useContext } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import RoofUnit from './RoofUnitCUForm'
import { Tab, Tabs } from '@mui/material'
import ProjectTable from './ProjectTable'
import { useDispatch, useSelector } from 'react-redux'
import { getRoofVendorWithContactsById, putRoofVendors } from './store/actions/index'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import { AbilityContext } from '@src/utility/context/Can'

const UpdateRoofRentalUnit = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch()
  const history = useHistory()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const location = useLocation()
  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  const {
    layout: { skin },
    roofUnit: { selectedRoofVendor },
    billingContacts: { contacts }
  } = useSelector((state) => state)

  const [activeTab, setActiveTab] = useState(1)
  const { id } = useParams()
  useEffect(() => {
    dispatch(
      getRoofVendorWithContactsById({
        id,
        isSavedToState: true
      })
    )
  }, [id])

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleUpdateRentalUnit = (values) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      dispatch(
        putRoofVendors({
          params: { ...values, state: values.state?.value, type: values.type?.value, id },
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(ROUTER_URL.BILLING_ROOF_RENTAL_UNIT)
          },
          intl,
          skin
        })
      )
    }
  }
  const handleCancel = () => {
    history.push({
      pathname: `${ROUTER_URL.BILLING_ROOF_RENTAL_UNIT}`,
      state: {
        allowUpdate: true
      }
    })
  }

  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.RENTAL_COMPANY)

  return (
    <>
      {' '}
      <Tabs
        value={activeTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChangeTab}
        classes={{
          root: 'mb-2 tabs-border-bottom'
        }}
      >
        <Tab classes={{ root: 'general-tab' }} label={intl.formatMessage({ id: 'Roof Vendors info' })} value={1} />
        <Tab classes={{ root: 'general-tab' }} label={intl.formatMessage({ id: 'projects' })} value={2} />
      </Tabs>
      {activeTab === 1 && (
        <RoofUnit
          isReadOnly={isReadOnly}
          onSubmit={handleUpdateRentalUnit}
          onCancel={handleCancel}
          initValues={selectedRoofVendor}
          contacts={contacts}
          submitClassname={!checkUpdateAbility && 'd-none'}
          allowedEdit={checkUpdateAbility}
        />
      )}
      {activeTab === 2 && <ProjectTable />}
    </>
  )
}

UpdateRoofRentalUnit.propTypes = {
  intl: object
}

export default injectIntl(UpdateRoofRentalUnit)

export const Navbar = () => {
  const {
    roofUnit: { selectedRoofVendor }
  } = useSelector((state) => state)
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'roof-rental-unit' }),
      link: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT
    },
    { name: selectedRoofVendor?.name, link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
