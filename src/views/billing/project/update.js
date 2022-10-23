import { ISO_DISPLAY_DATE_TIME_FORMAT, ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import moment from 'moment'
import { object } from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import ProjectCUForm from './ProjectCUForm'
import { getBillingProjectById, putProject } from './store/actions'
import '@src/@core/scss/billing-sweet-alert.scss'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const UpdateOperationUnit = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const dispatch = useDispatch()
  const [isReadOnly, setIsReadOnly] = useState(true)

  const location = useLocation()

  const {
    projects: { selectedProject: selectedBillingProject }
  } = useSelector((state) => state)

  const { id } = useParams()

  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  useEffect(() => {
    dispatch(
      getBillingProjectById({
        id,
        isSavedToState: true
      })
    )
  }, [id])

  const handleCancel = () => {
    history.push(ROUTER_URL.BILLING_PROJECT)
  }

  const handleUpdateOperationUnit = (values) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      const params = {
        name: values.name,
        code: values.code,
        address: values.address,
        startDate: values.startDate ? moment(values.startDate).format(ISO_DISPLAY_DATE_TIME_FORMAT) : null,
        userIds: (values.accountantIds || []).map((item) => item.value),
        operationCompanyId: values.companyId?.value,
        capacity: values.power || null,
        state: values.state?.value,
        id
      }
      dispatch(
        putProject({
          params,
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(ROUTER_URL.BILLING_PROJECT)
          }
        })
      )
    }
  }

  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.PROJECT)

  return (
    <>
      <ProjectCUForm
        onSubmit={handleUpdateOperationUnit}
        onCancel={handleCancel}
        initValues={selectedBillingProject}
        isReadOnly={isReadOnly}
        submitText={intl.formatMessage({
          id: location.state?.isFromCreateStep ? 'Finish' : isReadOnly ? 'Update' : 'Save'
        })}
        cancelText={intl.formatMessage({
          id: isReadOnly ? 'Back' : 'Cancel'
        })}
        cancelButton={location.state?.isFromCreateStep && null}
        submitClassname={!checkUpdateAbility && 'd-none'}
      />
    </>
  )
}

UpdateOperationUnit.propTypes = {
  intl: object
}

export default injectIntl(UpdateOperationUnit)

export const Navbar = () => {
  const {
    projects: { selectedProject: selectedBillingProject }
  } = useSelector((state) => state)
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    { name: intl.formatMessage({ id: 'project management' }), link: '' },
    {
      name: intl.formatMessage({ id: 'project' }),
      link: ROUTER_URL.BILLING_PROJECT
    },
    { name: selectedBillingProject?.name, link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
