import React, { Fragment, memo, useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { MapPin } from 'react-feather'
import { Button, ButtonGroup } from 'reactstrap'
import { numberWithCommas, showToast } from '@utils'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { MARKER_TYPE, PROJECT_STATUS } from '@constants/project'
import { ROUTER_URL } from '@constants/router'
import { STATE } from '@constants/common'

const center = {
  lat: 16.49619571119219,
  lng: 107.54797328125
}

const CustomGoogleMap = ({ projects, isDraggable, updateMarkerCoordinate, isShowElectricity }) => {
  const history = useHistory()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    region: 'VN',
    language: 'vi'
  })

  const [map, setMap] = useState(null),
    [mapZoom, setMapZoom] = useState(10),
    [myLocation, setMyLocation] = useState(null),
    [showProjectData, setShowProjectData] = useState(null)

  const onLoad = useCallback((onLoadMap) => {
    const findMyLocation = (locationMap) => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }

            setMyLocation(pos)
            locationMap?.setCenter(pos)
            setMapZoom(18)
          },
          () => {
            showToast('error', 'Browser doesn\'t support Geolocation')
          }
        )
      } else {
        showToast('error', 'Browser doesn\'t support Geolocation')
      }
    }

    const locationButton = document.createElement('div')

    ReactDOM.render(
      <ButtonGroup vertical>
        <Button.Ripple className='btn-icon' outline onClick={() => findMyLocation(onLoadMap)}>
          <MapPin size={20} className='p-0' />
        </Button.Ripple>
      </ButtonGroup>,
      locationButton
    )

    locationButton.classList.add('custom-map-control-button')
    onLoadMap.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton)

    // Delay to set center and zoom
    setTimeout(() => {
      if (projects.length === 1 && projects[0].lat && projects[0].lng) {
        onLoadMap.setCenter({
          lat: Number(projects[0].lat),
          lng: Number(projects[0].lng)
        })
        onLoadMap.setZoom(18)
      } else {
        onLoadMap.setCenter(center)
        onLoadMap.setZoom(6)
      }
    }, 1000)

    const bounds = new window.google.maps.LatLngBounds()
    onLoadMap.fitBounds(bounds)
    setMap(onLoadMap)
  }, [projects])

  const onUnmount = React.useCallback(() => {
    setMap(null)
  }, [])

  const renderData = (project) => {
    const requiredKeys = [
      { label: 'Project name', value: 'name', unit: '' },
      { label: 'DC power', value: 'wattageDC', unit: 'KWp' },
      { label: 'AC power', value: 'wattageAC', unit: 'KW' },
      { label: 'Active power', value: 'todayActivePower', unit: 'KW' },
      { label: 'Today yield', value: 'todayYield', unit: 'MWh' },
      { label: 'Monthly yield', value: 'monthlyYield', unit: 'MWh' }
    ]

    const tempProject = {
      ...project,
      wattageDC: numberWithCommas(project?.wattageDC / 1000),
      wattageAC: numberWithCommas(project?.wattageAC / 1000),
      todayActivePower: numberWithCommas(project?.todayActivePower / 1000),
      todayYield: numberWithCommas(project?.todayYield / 1000000),
      monthlyYield: numberWithCommas(project?.monthlyYield / 1000000)
    }

    return requiredKeys.map((key) => (
      <div key={key.value}>
        <FormattedMessage id={key.label} />: <strong>{tempProject[key.value] || 0}</strong>&nbsp;{key.unit}
        <br />
      </div>
    ))
  }

  const checkIconStatus = (status) => {
    switch (status) {
      case PROJECT_STATUS.ACTIVE:
        return require('@src/assets/images/svg/ic-marker-active.svg').default
      case PROJECT_STATUS.WARNING:
        return require('@src/assets/images/svg/ic-marker-yellow.svg').default
      case PROJECT_STATUS.DANGER:
        return require('@src/assets/images/svg/ic-marker-red.svg').default
      case PROJECT_STATUS.INACTIVE:
      default:
        return require('@src/assets/images/svg/ic-marker-inactive.svg').default
    }
  }

  const renderProjectMarkers = (data) => {
    const tempProjects =
      data.length > 0
        ? data.filter((project) => project?.state === STATE.ACTIVE && project?.id)
        : []

    return tempProjects.map((project) => (
      <Fragment key={project.id}>
        {/*PROJECT MARKER*/}
        {
          project?.lat && project?.lng &&
          <Marker
            draggable={isDraggable}
            position={{ lat: Number(project.lat), lng: Number(project.lng) }}
            icon={checkIconStatus(project?.status)}
            onMouseOver={() => {
              setShowProjectData(project.id)
            }}
            onMouseOut={() => {
              setShowProjectData(null)
            }}
            onClick={() => {
              history.push({
                pathname: ROUTER_URL.PROJECT_OVERVIEW,
                search: `?projectId=${project.id}`
              })
            }}
            onDragEnd={(e) => {
              if (updateMarkerCoordinate) {
                updateMarkerCoordinate({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                  projectId: project.id,
                  markerType: MARKER_TYPE.PROJECT
                })
              }
            }}
          >
            {showProjectData === project?.id && (
              <InfoWindow
                onCloseClick={() => {
                  setShowProjectData(null)
                  return false
                }}
                options={{ shouldFocus: false }}
              >
                <div className='text-primary'>{renderData(project)}</div>
              </InfoWindow>
            )}
          </Marker>
        }
        {/*ELECTRICITY MARKER*/}
        {
          isShowElectricity && project.eLat && project.eLng &&
          <Marker
            draggable={isDraggable}
            position={{ lat: Number(project.eLat), lng: Number(project.eLng) }}
            icon={checkIconStatus(project?.status)}
            onMouseOver={() => {
              setShowProjectData(`electricity_${project.id}`)
            }}
            onMouseOut={() => {
              setShowProjectData(null)
            }}
            onDragEnd={(e) => {
              if (updateMarkerCoordinate) {
                updateMarkerCoordinate({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                  projectId: project.id,
                  markerType: MARKER_TYPE.ELECTRICITY
                })
              }
            }}
          >
            {showProjectData === `electricity_${project.id}` && (
              <InfoWindow
                onCloseClick={() => {
                  setShowProjectData(null)
                  return false
                }}
                options={{ shouldFocus: false }}
              >
                <div className='text-primary'>
                  {`${project?.name} - `}
                  <FormattedMessage id='Electricity coordinate' />
                </div>
              </InfoWindow>
            )}
          </Marker>
        }
      </Fragment>
    ))
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerClassName='custom-google-map'
      center={center}
      zoom={mapZoom}
      onZoomChanged={() => {
        if (map) {
          setMapZoom(map.getZoom())
        }
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: 'greedy'
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <Marker
        id='myLocation'
        position={myLocation}
        onMouseOver={() => {
          setShowProjectData('myLocation')
        }}
        onMouseOut={() => {
          setShowProjectData(null)
        }}
      >
        {showProjectData === 'myLocation' && (
          <InfoWindow onCloseClick={() => setShowProjectData(null)}>
            <div>
              <FormattedMessage id='My location' />
            </div>
          </InfoWindow>
        )}
      </Marker>
      {renderProjectMarkers(projects)}
    </GoogleMap>
  ) : (
    <></>
  )
}

CustomGoogleMap.propTypes = {
  projects: PropTypes.array.isRequired,
  isDraggable: PropTypes.bool,
  isShowElectricity: PropTypes.bool,
  updateMarkerCoordinate: PropTypes.func
}

export default memo(CustomGoogleMap)
