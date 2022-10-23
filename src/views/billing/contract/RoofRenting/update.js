import '@src/@core/scss/billing-sweet-alert.scss'
import { ISO_STANDARD_FORMAT, ROUTER_URL, SET_FORM_DIRTY } from '@src/utility/constants'
import { VALUE_OF_ROOF_CONTRACT } from '@src/utility/constants/billing'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import { AbilityContext } from '@src/utility/context/Can'
import BreadCrumbs from '@src/views/common/breadcrumbs'
import moment from 'moment'
import { object } from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { getBillingProjectById } from '../../project/store/actions'
import { getContractById, putContractRoofVendor } from '../store/actions'
import RoofVendorContractCUForm from './RoofVendorContractCUForm'

const UpdateRoofVendorContract = ({ intl }) => {
  const ability = useContext(AbilityContext)
  const checkUpdateAbility = ability.can(USER_ACTION.EDIT, USER_FEATURE.PROJECT)

  const {
    projects: { selectedProject: selectedBillingProject }
  } = useSelector((state) => state)
  const location = useLocation()

  const dispatch = useDispatch()
  const history = useHistory()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const { id } = useParams()
  const [cleanData, setCleanData] = useState({})
  const { projectId } = useParams()
  useEffect(() => {
    dispatch(getContractById({ id }))
  }, [id])

  useEffect(() => {
    if (location.state?.allowUpdate) setIsReadOnly(false)
  }, [location.state?.allowUpdate])

  useEffect(() => {
    if (Number(projectId) !== Number(selectedBillingProject?.id)) {
      dispatch(
        getBillingProjectById({
          id: projectId,
          isSavedToState: true
        })
      )
    }
  }, [projectId])
  const { selectedContract } = useSelector((state) => state.projectContracts)
  useEffect(() => {
    setCleanData({
      contractCode: selectedContract.code,
      effectiveDate: moment(selectedContract.startDate).format(ISO_STANDARD_FORMAT),
      expirationDate: moment(selectedContract.endDate).format(ISO_STANDARD_FORMAT),
      roofId: selectedContract.roofVendorId,
      typeContract: VALUE_OF_ROOF_CONTRACT[selectedContract.details?.id] || 0,
      percentTurnover: selectedContract.details?.percent,
      confirmationReminder: selectedContract.alerts?.confirmAlert,
      announcementDate: selectedContract.alerts?.billingAlert,
      startDate: moment(selectedContract.details?.startDate).format(ISO_STANDARD_FORMAT),
      rentalAmount: selectedContract.details?.rentalAmount,
      id: selectedContract.id,
      files:selectedContract.files

    })
  }, [selectedContract])

  const handleCancel = () => {
    history.push(`${ROUTER_URL.BILLING_PROJECT}/${projectId}`)
  }
  const handleUpdateRoofVendorContract = (value) => {
    if (isReadOnly) {
      setIsReadOnly(false)
    } else {
      // eslint-disable-next-line no-unused-vars
      const { address, taxCode, contractCode, effectiveDate, expirationDate, contractType, ...newvalue } = value
      newvalue.id = Number(id)
      dispatch(
        putContractRoofVendor({
          newvalue,
          intl,
          callback: () => {
            dispatch({
              type: SET_FORM_DIRTY,
              payload: false
            })
            history.push(`${ROUTER_URL.BILLING_PROJECT}/${projectId}`)
          }
        })
      )
    }
  }
  return (
    <RoofVendorContractCUForm
      isReadOnly={isReadOnly}
      onCancel={handleCancel}
      onSubmit={handleUpdateRoofVendorContract}
      initValues={cleanData}
      submitClassname={!checkUpdateAbility && 'd-none'}

    />
  )
}
UpdateRoofVendorContract.propTypes = {
  intl: object
}

export default injectIntl(UpdateRoofVendorContract)

export const Navbar = () => {
  const {
    projects: { selectedProject: selectedBillingProject },
    projectContracts: { selectedContract: selectedContract }
  } = useSelector((state) => state)
  const intl = useIntl()

  const tempItems = [
    { name: intl.formatMessage({ id: 'billing' }), link: '' },
    { name: intl.formatMessage({ id: 'project management' }), link: '' },
    {
      name: intl.formatMessage({ id: 'project' }),
      link: ROUTER_URL.BILLING_PROJECT
    },
    {
      name: selectedBillingProject.name,
      link: `${ROUTER_URL.BILLING_PROJECT}/${selectedBillingProject?.id}`
    },
    {
      name: selectedContract?.code
    }
  ]
  return (
    <>
      <BreadCrumbs breadCrumbItems={tempItems} />
    </>
  )
}
