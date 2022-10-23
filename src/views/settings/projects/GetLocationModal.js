import { Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import PropTypes from 'prop-types'
import React, { useCallback, useState, memo } from 'react'
import { FormattedMessage } from 'react-intl'
import { GoogleMap, InfoWindow, useJsApiLoader, Marker } from '@react-google-maps/api'
import { showToast } from '@utils'
import ReactDOM from 'react-dom'
import { MapPin } from 'react-feather'

const containerStyle = {
  width: 'auto',
  height: '420px',
  borderRadius: '5px'
}

const GetLocationModal = ({ isOpen, setIsOpen, projectLocation, setProjectLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    region: 'VN',
    language: 'vi'
  })

  const [map, setMap] = useState(null),
    [mapZoom, setMapZoom] = useState(12),
    [myLocation, setMyLocation] = useState(projectLocation),
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
            setMapZoom(15)
            setProjectLocation(pos)
          },
          () => {
            showToast('error', "Browser doesn't support Geolocation")
          }
        )
      } else {
        showToast('error', "Browser doesn't support Geolocation")
      }
    }

    const locationButton = document.createElement('div')

    ReactDOM.render(
      <ButtonGroup vertical>
        <Button.Ripple className="btn-icon" outline onClick={() => findMyLocation(onLoadMap)}>
          <MapPin size={20} className="p-0" />
        </Button.Ripple>
      </ButtonGroup>,
      locationButton
    )

    locationButton.classList.add('custom-map-control-button')
    onLoadMap.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton)

    setTimeout(() => {
      if (projectLocation) {
        onLoadMap.setCenter(projectLocation)
        onLoadMap.setZoom(15)
      } else {
        findMyLocation(onLoadMap)
      }
    }, 500)

    const bounds = new window.google.maps.LatLngBounds()
    onLoadMap.fitBounds(bounds)
    setMap(onLoadMap)
  }, [])

  const onUnmount = React.useCallback(() => {
    setMap(null)
  }, [])

  return (
    <Modal isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} className="modal-dialog-centered" backdrop="static">
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>
        <FormattedMessage id="Locate project coordinate" />
      </ModalHeader>
      <ModalBody>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={myLocation}
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
              id="myLocation"
              position={myLocation}
              draggable
              onMouseOver={() => {
                setShowProjectData('myLocation')
              }}
              onMouseOut={() => {
                setShowProjectData(null)
              }}
              onDragEnd={(e) => {
                setProjectLocation({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng()
                })
              }}
            >
              {showProjectData === 'myLocation' && (
                <InfoWindow onCloseClick={() => setShowProjectData(null)}>
                  <div>
                    <FormattedMessage id="Project location" />
                  </div>
                </InfoWindow>
              )}
            </Marker>
          </GoogleMap>
        ) : (
          <></>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            setIsOpen((current) => {
              return { ...current, isOpen: !isOpen }
            })
          }}
        >
          <FormattedMessage id="Accept" />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

GetLocationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  projectLocation: PropTypes.object,
  setProjectLocation: PropTypes.func
}

export default memo(GetLocationModal)
