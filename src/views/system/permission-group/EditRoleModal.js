import React, { useState, cloneElement, useEffect } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Label, Input } from 'reactstrap'
import { convertPermissionCodeToLabel, selectThemeColors, showToast } from '@src/utility/Utils'
import { object, func, array } from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPermission, getAllUserAction, getAllUserFeature } from './store/actions'
import { isEqual } from 'lodash'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import classNames from 'classnames'

const MySweetAlert = withReactContent(SweetAlert)

const EditRoleModal = ({ intl, children, onSubmit = () => {}, permissions }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const [featureValue, setFeatureValue] = useState(null)
  const [searchValue, setSearchValue] = useState(null)
  const [values, setValues] = useState([])
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const { allPermission, allUserFeature } = useSelector((state) => state.permissionGroup)

  const toggle = () => {
    if (isOpen && !isEqual(values, permissions)) {
      return MySweetAlert.fire({
        title: intl.formatMessage({ id: 'Cancel confirmation' }),
        text: intl.formatMessage({ id: 'Are you sure to cancel?' }),
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
          cancelButton: 'btn btn-secondary ml-1',
          actions: 'sweet-actions',
          content: 'sweet-content'
        },
        buttonsStyling: false
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          setIsOpen((preState) => !preState)
        }
      })
    }

    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen) {
      setValues(permissions)
    } else {
      setValues([])
    }
  }, [isOpen])

  useEffect(() => {
    Promise.all([dispatch(getAllUserFeature()), dispatch(getAllPermission()), dispatch(getAllUserAction())])
  }, [])

  useEffect(() => {
    if (!featureValue?.value) {
      setSearchValue(null)
    }
  }, [featureValue?.value])

  const handleSubmitFilterForm = () => {
    if (!values?.length > 0) {
      showToast('error', <FormattedMessage id="Need at least 1 feature" />)
      return
    }
    onSubmit?.(values)
    setIsOpen(false)
  }

  const renderListFeature = searchValue?.value
    ? (allUserFeature || []).filter((item) => item.code === searchValue.value)
    : allUserFeature

  const handleChangeFeatureValue = (value) => {
    setFeatureValue(value)
  }
  const handleFilterFeature = () => {
    setSearchValue(featureValue)
  }

  const handleChangeFeatureGroup = (featureCode) => (event) => {
    let newValues = []
    if (event.target.checked) {
      const changePerItem = allPermission.filter((item) => item.feature === featureCode)
      newValues = changePerItem.reduce((array, value) => {
        if (array.find((item) => item.id === value.id)) return array
        return [...array, value]
      }, values)
    } else {
      newValues = values.filter((item) => item.feature !== featureCode)
    }

    setValues(newValues)
  }

  const handleChangeFeaturePermission = (_per) => (event) => {
    let newValues = values
    if (event.target.checked) {
      newValues = [...newValues, _per]
    } else {
      newValues = newValues.filter((item) => item.id !== _per.id)
    }

    setValues(newValues)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        zIndex={500}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <ModalHeader>{intl.formatMessage({ id: 'Choose Role' })}</ModalHeader>
        <ModalBody>
          <Row className="mb-2">
            <Col md={10} className="mt-1">
              <Select
                theme={selectThemeColors}
                options={(allUserFeature || []).map((item) => ({
                  label: item.name,
                  value: item.code
                }))}
                value={featureValue}
                onChange={handleChangeFeatureValue}
                isClearable
                className="react-select"
                classNamePrefix="select"
                placeholder={intl.formatMessage({ id: 'Choose Feature' })}
                formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                noOptionsMessage={() => <FormattedMessage id="There are no records to display" />} blurInputOnSelect
              />
            </Col>
            <Col md={2} className="mt-1">
              <Button.Ripple color="primary" className="add-project" onClick={handleFilterFeature}>
                <FormattedMessage id="Find" />
              </Button.Ripple>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {(renderListFeature || []).map((feature, fIndex) => {
                const checkAll = allPermission
                  .filter((per) => per.feature === feature.code)
                  .find((item) => !values.find((crtPer) => crtPer.id === item.id))
                return (
                  <>
                    <div key={feature.id}>
                      <Input
                        type="checkbox"
                        className="custom-checked-input"
                        checked={Boolean(!checkAll)}
                        onChange={handleChangeFeatureGroup(feature.code)}
                      />
                      <Label className="general-label feature-label" for="name">
                        {feature.name}
                      </Label>
                    </div>
                    <Row>
                      {(allPermission || [])
                        .filter((item) => item.feature === feature.code)
                        .map((per) => {
                          return (
                            <Col md={2} key={per.id}>
                              <Input
                                type="checkbox"
                                className="custom-checked-input"
                                checked={Boolean(values.find((item) => item.id === per.id))}
                                onChange={handleChangeFeaturePermission(per)}
                              />
                              <Label className="general-label font-weight-normal" for="name">
                                {convertPermissionCodeToLabel(per.action)}
                              </Label>
                            </Col>
                          )
                        })}
                    </Row>
                    {fIndex !== renderListFeature?.length - 1 && <div className="divider-dashed mt-2 mb-2" />}
                  </>
                )
              })}
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={handleSubmitFilterForm}>
            {intl.formatMessage({ id: 'Finish' })}
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            {intl.formatMessage({ id: 'Cancel' })}
          </Button>
        </ModalFooter>
      </Modal>
      {cloneElement(children, { onClick: toggle })}
    </>
  )
}
EditRoleModal.propTypes = {
  children: object,
  onSubmit: func,
  intl: object.isRequired,
  permissions: array
}

export default injectIntl(EditRoleModal)
