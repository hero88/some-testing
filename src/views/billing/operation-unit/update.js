import { ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import { object } from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import OperationCUForm from './OperationUnitCUForm'
import { getOperationUnitById, putOperationUnit } from './store/actions'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import ProjectTable from './ProjectTable'
import { Tab, Tabs } from '@mui/material'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const UpdateOperationUnit = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const [activeTab, setActiveTab] = useState(1)
  const history = useHistory()
  const dispatch = useDispatch()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const {
    layout: { skin },

    company: { selectedCompany }
  } = useSelector((state) => state)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  const { id } = useParams()
  useEffect(() => {
    dispatch(
      getOperationUnitById({
        id,
        isSavedToState: true
      })
    )
  }, [id])

  const handleCancel = () => {
    history.push({
      pathname: `${ROUTER_URL.BILLING_OPERATION_UNIT}`,
      state: {
        allowUpdate: true
      }
    })
  }
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue)
  }
  const handleUpdateOperationUnit = (values) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      dispatch(
        putOperationUnit({
          params: { ...values, state: values.state?.value, id },
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(ROUTER_URL.BILLING_OPERATION_UNIT)
          },
          intl,
          skin
        })
      )
    }
  }
  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.OPE_CO)
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
        <Tab classes={{ root: 'general-tab' }} label={intl.formatMessage({ id: 'Operation unit info' })} value={1} />
        <Tab classes={{ root: 'general-tab' }} label={intl.formatMessage({ id: 'projects' })} value={2} />
      </Tabs>
      {activeTab === 1 && (
        <OperationCUForm
          onSubmit={handleUpdateOperationUnit}
          onCancel={handleCancel}
          initValues={selectedCompany}
          isReadOnly={isReadOnly}
          submitClassname={!checkUpdateAbility && 'd-none'}
        />
      )}
      {activeTab === 2 && <ProjectTable />}
    </>
  )
}

UpdateOperationUnit.propTypes = {
  intl: object
}

export default injectIntl(UpdateOperationUnit)

export const Navbar = () => {
  const intl = useIntl()
  const {
    company: { selectedCompany }
  } = useSelector((state) => state)

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'operation-units' }),
      link: ROUTER_URL.BILLING_OPERATION_UNIT
    },
    { name: selectedCompany?.name, link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
