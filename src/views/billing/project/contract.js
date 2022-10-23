import { Tab, Tabs } from '@mui/material'
import { bool, object, string } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import withReactContent from 'sweetalert2-react-content'
import PowerSelling from '../contract/PowerSelling/List'
import RoofRenting from '../contract/RoofRenting/List'
import { deleteContractById, getAllContractByProjectId } from '../contract/store/actions'
import SweetAlert from 'sweetalert2'
import classNames from 'classnames'
import '@src/@core/scss/billing-sweet-alert.scss'

const MySweetAlert = withReactContent(SweetAlert)

function ContractCOM({ intl, isReadOnly, projectId }) {
  const dispatch = useDispatch()
  const {
    projectContracts: { data },
    layout: { skin }
  } = useSelector((state) => state)
  const fetchAllContractByProjectId = () => {
    if (projectId) {
      dispatch(
        getAllContractByProjectId({
          id: projectId,
          isSavedToState: true
        })
      )
    }
  }
  useEffect(() => {
    fetchAllContractByProjectId()
  }, [projectId])

  const handleDeleteContract = (contractItem) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete operating customer title' }),
      text: intl.formatMessage({ id: 'Delete billing information message' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
      customClass: {
        popup: classNames({
          'sweet-alert-popup--dark': skin === 'dark',
          'sweet-popup': true
        }),
        header: 'sweet-title',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1',
        actions: 'sweet-actions',
        content: 'sweet-content'
      },
      buttonsStyling: false
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        dispatch(
          deleteContractById({
            id: contractItem.id,
            callback: fetchAllContractByProjectId,
            intl
          })
        )
      }
    })
  }

  const [activeTab, setActiveTab] = useState(1)

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue)
  }
  return (
    <>
      <Tabs
        value={activeTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChangeTab}
        classes={{
          root: 'mb-2 tabs-border-bottom'
        }}
      >
        <Tab
          classes={{ root: 'general-tab' }}
          label={intl.formatMessage({ id: 'Power Selling Agreement' })}
          value={1}
        />
        <Tab
          classes={{ root: 'general-tab' }}
          label={intl.formatMessage({ id: 'Contract of Roof Renting' })}
          value={2}
        />
      </Tabs>
      {activeTab === 1 && (
        <PowerSelling
          disabled={isReadOnly}
          data={(data || []).filter((item) => item.type === 'CUSTOMER')}
          onDelete={handleDeleteContract}
        />
      )}
      {activeTab === 2 && (
        <RoofRenting
          disabled={isReadOnly}
          data={(data || []).filter((item) => item.type === 'ROOF_VENDOR')}
          onDelete={handleDeleteContract}
        />
      )}
    </>
  )
}

ContractCOM.propTypes = {
  intl: object,
  isReadOnly: bool,
  projectId: string
}

export default injectIntl(ContractCOM)
