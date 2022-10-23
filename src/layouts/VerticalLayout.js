// ** Import react
import { useContext, useEffect, useState } from 'react'

// ** Third party components
import PropTypes from 'prop-types'
import { useIdleTimer } from 'react-idle-timer'

// ** Store & actions
import { useDispatch, useSelector } from 'react-redux'

// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import SessionTimeout from '@src/views/pages/misc/SessionTimeout'
import Spinner from '@components/spinner/Loading-spinner'
import { getGroup } from '@store/actions/auth'
import { getToken } from '@src/firebase'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { getTotalProjectRequests } from '@src/views/settings/projects/store/actions'
import { CO2_REDUCTION_RATE, SESSION_TIMEOUT, STANDARD_COAL_RATE, TREES_SAVED_RATE } from '@constants/common'
import axios from 'axios'
import { API_GET_GENERAL_SETTING, API_POST_GENERAL_SETTING } from '@constants/api'
import { UPDATE_GENERAL_SETTING } from '@constants/actions'
import { showToast } from '@utils'
import { useRouteMatch } from 'react-router-dom'
import { Routes } from '@src/router/routes'

const VerticalLayout = (props) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  const routerObject = Routes.find((route) => useRouteMatch(route.path)?.isExact)

  const dispatch = useDispatch()

  // ** Session timeout
  const [isTimeout, setIsTimeout] = useState(false)

  // ** Layout store
  const {
    layout: layoutStore,
    auth: { generalSetting, isTokenTimeOut }
  } = useSelector((state) => state)
  const sessionTimeout = generalSetting?.sessionTimeout > 0 ? generalSetting.sessionTimeout : SESSION_TIMEOUT

  // ** Setting idle timer
  const handleOnIdle = () => {
    setIsTimeout(true)
  }

  // eslint-disable-next-line no-unused-vars
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: sessionTimeout * 60 * 1000,
    onIdle: handleOnIdle,
    debounce: 500
  })

  // Get userDate from local storage
  const userData = JSON.parse(localStorage.getItem('userData'))

  // Component did mount
  useEffect(async () => {
    await Promise.all([
      getToken(),
      dispatch(getGroup({ order: 'name asc' })),
      ability.can('manage', USER_ABILITY.NO_NEED_CONFIRM) && dispatch(getTotalProjectRequests({ rowsPerPage: 1 })),
      axios
        .get(API_GET_GENERAL_SETTING, { params: { userId: userData?.id } })
        .then(async (response) => {
          if (response?.data?.data) {
            const { defaultLanguage, theme, treesSavedRate, co2ReductionRate, standardCoalRate, sessionTimeout } =
              response.data.data

            dispatch({
              type: UPDATE_GENERAL_SETTING,
              data: {
                language: defaultLanguage?.toLowerCase(),
                theme: theme?.toLowerCase(),
                treesSavedRate: Number(treesSavedRate),
                co2ReductionRate: Number(co2ReductionRate),
                standardCoalRate: Number(standardCoalRate),
                sessionTimeout: Number(sessionTimeout)
              }
            })
          }
        })
        .catch(async () => {
          await axios
            .post(API_POST_GENERAL_SETTING, {
              defaultLanguage: 'VI',
              theme: 'DARK',
              treesSavedRate: TREES_SAVED_RATE,
              co2ReductionRate: CO2_REDUCTION_RATE,
              standardCoalRate: STANDARD_COAL_RATE,
              sessionTimeout: SESSION_TIMEOUT
            })
            .catch((err) => {
              showToast('error', `${err.response ? err.response.data.message : err.message}`)
            })
        })
    ])
  }, [])

  return (
    <>
      <Layout {...props} navbar={routerObject?.navbar ? <routerObject.navbar /> : null}>
        {props.children}
      </Layout>
      {(isTimeout || isTokenTimeOut) && (
        <SessionTimeout isOpen={isTimeout || isTokenTimeOut} toggle={() => setIsTimeout(false)} />
      )}
      {layoutStore.requestCount > 0 && <Spinner />}
    </>
  )
}

VerticalLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default VerticalLayout
