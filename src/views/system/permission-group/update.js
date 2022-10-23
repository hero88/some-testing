import { ROUTER_URL, SET_FORM_DIRTY, SET_SELECTED_ROLE } from '@src/utility/constants'
import { object } from 'prop-types'
import React, { useState, useEffect, useContext } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import RoleGroupCUForm from './RoleGroupCUForm'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import { getRoleByRoleId, putRoleGroup } from './store/actions'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const UpdateRightsGroup = () => {
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch()
  const history = useHistory()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const location = useLocation()
  const {
    permissionGroup: { selectedRole }
  } = useSelector((state) => state)

  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  const { id } = useParams()
  useEffect(() => {
    return () => {
      dispatch({
        type: SET_SELECTED_ROLE,
        payload: {}
      })
    }
  }, [])
  useEffect(() => {
    dispatch(
      getRoleByRoleId({
        id,
        isSavedToState: true
      })
    )
  }, [id])

  const handleUpdateRightsGroup = (values) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      dispatch(
        putRoleGroup({
          payload: { ...values, id: selectedRole.id },
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(ROUTER_URL.SYSTEM_PERMISSION_GROUP)
          }
        })
      )
    }
  }
  const handleCancel = () => {
    history.push(`${ROUTER_URL.SYSTEM_PERMISSION_GROUP}`)
  }
  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.GROUP_MANAGER)

  return (
    <>
      <RoleGroupCUForm
        isReadOnly={isReadOnly}
        onSubmit={handleUpdateRightsGroup}
        onCancel={handleCancel}
        initValues={selectedRole}
        submitClassname={!checkUpdateAbility && 'd-none'}
      />
    </>
  )
}

UpdateRightsGroup.propTypes = {
  intl: object
}

export default injectIntl(UpdateRightsGroup)

export const Navbar = () => {
  const intl = useIntl()
  const {
    permissionGroup: { selectedRole }
  } = useSelector((state) => state)

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    {
      name: intl.formatMessage({ id: 'permission-group' }),
      link: ROUTER_URL.SYSTEM_PERMISSION_GROUP
    },
    { name: selectedRole?.name, link: '' }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
