import CustomGoogleMap from '@src/views/common/google-map'
import React, { useContext, useEffect, useState } from 'react'
import { editProject, getProjectById } from '@src/views/monitoring/projects/store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@hooks/useQuery'
import { Button, Col, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { PLACEHOLDER } from '@constants/common'
import { USER_ABILITY } from '@constants/user'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PropTypes from 'prop-types'
import { AbilityContext } from '@src/utility/context/Can'
import { MapPin } from 'react-feather'
import { showToast } from '@utils'
import { MARKER_TYPE } from '@constants/project'
import { COORDINATES_REGEX } from '@constants/regex'

const ProjectMap = ({ intl }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  const dispatch = useDispatch(),
    { customerProject: { selectedProject } } = useSelector(state => state),
    query = useQuery(),
    projectId = query.get('projectId')

  // States
  const [projectLocation, setProjectLocation] = useState(null),
    [electricityLocation, setElectricityLocation] = useState(null),
    [currentProject, setCurrentProject] = useState(selectedProject)

  const SignupSchema = yup.object().shape(
    {
      address: yup
        .string()
        .required(intl.formatMessage({ id: 'Address is required' }))
        .min(3, intl.formatMessage({ id: 'Address is invalid - min' }, { min: 3 }))
        .max(256, intl.formatMessage({ id: 'Address is invalid - max' }, { max: 256 })),
      coordinate: yup
        .string()
        .matches(COORDINATES_REGEX, intl.formatHTMLMessage({ id: 'Coordinates is invalid' })),
      eCoordinate: yup
        .string()
        .matches(COORDINATES_REGEX, intl.formatHTMLMessage({ id: 'Coordinates is invalid' }))
    }
  )

  const { register, errors, handleSubmit, reset, setValue, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const initForm = () => {
    if (selectedProject) {
      setCurrentProject(selectedProject)
    }

    if (selectedProject?.lat && selectedProject?.lng) {
      setProjectLocation({ lat: Number(selectedProject.lat), lng: Number(selectedProject.lng) })
    }

    if (selectedProject?.eLat && selectedProject?.eLng) {
      setElectricityLocation({ lat: Number(selectedProject.eLat), lng: Number(selectedProject.eLng) })
    }

    reset({
      ...selectedProject,
      address: selectedProject?.address ? selectedProject.address : '',
      coordinate:
        selectedProject?.lat && selectedProject.lng
          ? `${selectedProject?.lat}, ${selectedProject?.lng}`
          : projectLocation?.lat && projectLocation.lng
            ? `${projectLocation?.lat}, ${projectLocation?.lng}`
            : '',
      eCoordinate:
        selectedProject?.eLat && selectedProject.eLng
          ? `${selectedProject?.eLat}, ${selectedProject?.eLng}`
          :  electricityLocation?.lat && electricityLocation.lng
            ? `${electricityLocation?.lat}, ${electricityLocation?.lng}`
            : ''
    })
  }

  const onSubmit = async (data) => {
    const cleanData = { ...data }

    cleanData.id = projectId

    if (projectLocation) {
      cleanData.lat = projectLocation.lat
      cleanData.lng = projectLocation.lng
    }

    if (electricityLocation) {
      cleanData.eLat = electricityLocation.lat
      cleanData.eLng = electricityLocation.lng
    }

    delete cleanData.coordinate
    delete cleanData.eCoordinate

    await dispatch(
      editProject(
        {
          ...cleanData
        }
      )
    )
  }

  const addNewMarker = ({ type }) => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          switch (type) {
            case MARKER_TYPE.PROJECT: {
              setCurrentProject(currentState => (
                {
                  ...currentState,
                  lat: pos.lat,
                  lng: pos.lng
                }
              ))
              break
            }

            case MARKER_TYPE.ELECTRICITY: {
              setCurrentProject(currentState => (
                {
                  ...currentState,
                  eLat: pos.lat,
                  eLng: pos.lng
                }
              ))
              break
            }
          }

        },
        () => {
          showToast('error', 'Browser doesn\'t support Geolocation')
        }
      )
    } else {
      showToast('error', 'Browser doesn\'t support Geolocation')
    }
  }

  const updateMarkerCoordinate = (data) => {
    switch (data.markerType) {
      case MARKER_TYPE.PROJECT: {
        setCurrentProject(currentState => (
          {
            ...currentState,
            lat: data.lat,
            lng: data.lng
          }
        ))
        setProjectLocation({
          lat: data.lat,
          lng: data.lng
        })
        setValue('coordinate', `${data.lat}, ${data.lng}`)
        break
      }

      case MARKER_TYPE.ELECTRICITY: {
        setCurrentProject(currentState => (
          {
            ...currentState,
            eLat: data.lat,
            eLng: data.lng
          }
        ))
        setElectricityLocation({
          lat: data.lat,
          lng: data.lng
        })
        setValue('eCoordinate', `${data.lat}, ${data.lng}`)
        break
      }
    }
  }

  useEffect(() => {
    if (projectId) {
      dispatch(
        getProjectById({
          id: projectId,
          fk: JSON.stringify(['users', 'devices', 'contacts', 'customer'])
        })
      )
    }
  }, [projectId])

  useEffect(() => {
    if (selectedProject) {
      initForm()
    }
  }, [selectedProject])

  useEffect(() => {
    const tempCoordinate = watch('coordinate')

    if (tempCoordinate && !errors.coordinate) {
      const [tempLat, tempLng] = tempCoordinate.split(', ')

      setProjectLocation({ lat: tempLat, lng: tempLng })
      setCurrentProject(currentState => (
        {
          ...currentState,
          lat: tempLat,
          lng: tempLng
        }
      ))
    } else {
      setProjectLocation(null)
      setCurrentProject(currentState => (
        {
          ...currentState,
          lat: '',
          lng: ''
        }
      ))
    }
  }, [watch('coordinate')])

  useEffect(() => {
    const tempCoordinate = watch('eCoordinate')

    if (tempCoordinate && !errors.eCoordinate) {
      const [tempLat, tempLng] = tempCoordinate.split(', ')

      setElectricityLocation({ lat: tempLat, lng: tempLng })
      setCurrentProject(currentState => (
        {
          ...currentState,
          eLat: tempLat,
          eLng: tempLng
        }
      ))
    } else {
      setElectricityLocation(null)
      setCurrentProject(currentState => (
        {
          ...currentState,
          eLat: '',
          eLng: ''
        }
      ))
    }
  }, [watch('eCoordinate')])

  return (
    <>
      <CustomGoogleMap
        isDraggable={ability.can('manage', USER_ABILITY.MANAGE_PROJECT)}
        isShowElectricity
        projects={[currentProject]}
        updateMarkerCoordinate={updateMarkerCoordinate}
      />
      <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Row>
          {/*===================DIVIDER===================*/}
          <Col xl={12} className='mb-1'>
            <hr />
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='address'>
                <FormattedMessage id='Address' />
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Input
                id='address'
                name='address'
                innerRef={register({ required: true })}
                invalid={!!errors.address}
                placeholder={PLACEHOLDER.ADDRESS}
                readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {errors && errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='coordinate'>
                <FormattedMessage id='Coordinate' />
              </Label>
              <InputGroup>
                <Input
                  id='coordinate'
                  name='coordinate'
                  innerRef={register({ required: true })}
                  invalid={!!errors.coordinate}
                  placeholder={intl.formatMessage({ id: 'Coordinate' })}
                  readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                />
                <InputGroupAddon addonType='append'>
                  <Button.Ripple
                    className='btn-icon'
                    outline
                    onClick={() => {
                      addNewMarker({ type: MARKER_TYPE.PROJECT })
                    }}
                    disabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                  >
                    <MapPin size={16} />
                  </Button.Ripple>
                </InputGroupAddon>
                {errors && errors.coordinate && <FormFeedback>{errors.coordinate.message}</FormFeedback>}
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='eCoordinate'>
                <FormattedMessage id='Electricity coordinate' />
              </Label>
              <InputGroup>
                <Input
                  id='eCoordinate'
                  name='eCoordinate'
                  innerRef={register({ required: true })}
                  invalid={!!errors.eCoordinate}
                  placeholder={intl.formatMessage({ id: 'Coordinate' })}
                  readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                />
                <InputGroupAddon addonType='append'>
                  <Button.Ripple
                    className='btn-icon'
                    outline
                    onClick={() => {
                      addNewMarker({ type: MARKER_TYPE.ELECTRICITY })
                    }}
                    disabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                  >
                    <MapPin size={16} />
                  </Button.Ripple>
                </InputGroupAddon>
                {errors && errors.eCoordinate && <FormFeedback>{errors.eCoordinate.message}</FormFeedback>}
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
          <Row>
            <Col className='d-flex justify-content-end'>
              <Button className='mr-1' color='primary' type='submit'>
                <FormattedMessage id={'Update'} />
              </Button>
              <Button color='secondary' onClick={initForm}>
                <FormattedMessage id='Cancel' />
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </>
  )
}

ProjectMap.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(ProjectMap)
