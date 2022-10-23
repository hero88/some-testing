// ** Third party components
import {
  Button,
  Col,
  FormText,
  Row
} from 'reactstrap'
import { AlertTriangle } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Uppy from '@uppy/core'
import { DragDrop } from '@uppy/react'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'
import Carousel, { Modal, ModalGateway } from 'react-images'
import _isEmpty from 'lodash/isEmpty'
import { ReactComponent as CloseIcon } from '@src/assets/images/svg/modal/ic-close.svg'

// ** Custom components
import { LIMITED_SIZE } from '@constants/common'
import { numberWithCommas, showToast } from '@utils'
import {
  editProject
} from '@src/views/monitoring/projects/store/actions'
import { API_POST_MEDIA } from '@constants/api'
import Avatar from '@components/avatar'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'

const ProjectImages = ({ intl }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      customerProject: { selectedProject }
    } = useSelector((state) => state),
    [previewArr, setPreviewArr] = useState({
      panelUppy: [],
      panelRoofUppy: [],
      electricityRoomUppy: [],
      transformerUppy: []
    }),
    [isOpenImgViewer, setIsOpenImgViewer] = useState(false),
    [currentImgSet, setCurrentImgSet] = useState([])

  useEffect(() => {
    if (!_isEmpty(selectedProject.images)) {
      setPreviewArr(selectedProject.images)
    }
  }, [selectedProject])

  const onSubmit = async (data) => {
    await dispatch(
      editProject(
        {
          id: selectedProject.id,
          images: data
        }
      )
    )
  }

  const loaders = [
    {
      id: 'panelUppy',
      title: 'Panel uppy'
    },
    {
      id: 'panelRoofUppy',
      title: 'Panel roof'
    },
    {
      id: 'electricityRoomUppy',
      title: 'Electricity room'
    },
    {
      id: 'transformerUppy',
      title: 'Transformer'
    }
  ]

  const renderPreview = ({ images, item }) => {
    if (typeof images === 'object' && images.length) {
      return images.map((image, index) => (
        <div key={index} className='upload-container__preview'>
          {
            ability.can('manage', USER_ABILITY.MANAGE_PROJECT) &&
            <Button
              color='flat'
              onClick={() => setPreviewArr((currentState) => {
                const tempState = {
                  ...currentState,
                  [item.id]: []
                }

                onSubmit(tempState)
                return tempState
              })}
            >
              <span><CloseIcon/></span>
            </Button>
          }

          <img
            key={index}
            src={image.source}
            alt='avatar'
            onClick={() => {
              setIsOpenImgViewer(true)
              setCurrentImgSet(images)
            }}
          />
        </div>
      ))
    } else {
      return null
    }
  }

  const renderUppyItem = (item) => {
    // Upload multi pictures
    const panelUppy = new Uppy({
      id: item.id,
      meta: { type: 'avatar' },
      autoProceed: true,
      restrictions: {
        maxFileSize: LIMITED_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      }
    })

    panelUppy.on('restriction-failed', (file) => {
      toast.error(
        <FormText>
          <Avatar className='mr-1' color='light-danger' icon={<AlertTriangle size={14}/>}/>
          <FormattedMessage
            id='Image size is too large'
            values={{
              imageName: file.name,
              imageSize: numberWithCommas(file.size / (
                1024 * 1024
              )),
              limit: numberWithCommas(LIMITED_SIZE / (
                1024 * 1024
              ))
            }}
          />
        </FormText>,
        { transition: Slide, autoClose: 5000 }
      )
    })

    panelUppy.on('complete', async (event) => {
      const formData = new FormData()

      event.successful.forEach((item) => {
        formData.append('file', item.data)
      })

      await axios
        .post(API_POST_MEDIA, formData, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        .then((response) => {
          if (response.data && response.data.status && response.data.data && response.data.data[0]) {
            setPreviewArr((currentState) => {
              const tempState = {
                ...currentState,
                [item.id]: response.data.data.map((image) => (
                  {
                    source: image.url
                  }
                ))
              }

              onSubmit(tempState)
              return tempState
            })
          } else {
            throw new Error(response.data.message)
          }
        })
        .catch((err) => {
          showToast('error', `${err.response ? err.response.data.message : err.message}`)
        })
    })

    return <Col key={item.id} md={6}>
      <div className='upload-container'>
        <label className='upload-container__label'>
          <FormattedMessage id={item.title}/>
        </label>

        {
          previewArr[item.id]?.length === 0 &&
          ability.can('manage', USER_ABILITY.MANAGE_PROJECT) &&
          <DragDrop
            uppy={panelUppy}
            locale={{
              strings: {
                // Text to show on the droppable area.
                // `%{browse}` is replaced with a link that opens the system file selection dialog.
                dropHereOr: intl.formatMessage({ id: 'Click to upload image' }, { browse: '%{browse}' }),
                // Used as the label for the link that opens the system file selection dialog.
                browse: intl.formatMessage({ id: 'upload' })
              }
            }}
          />
        }

        {renderPreview({ images: previewArr[item.id], item })}
      </div>
    </Col>
  }

  const renderUploaders = (items) => {
    return items.map((item, index) => {
      return renderUppyItem(item, index)
    })
  }

  return (
    <>
      <Row>
        {renderUploaders(loaders)}
      </Row>
      <ModalGateway>
        {isOpenImgViewer ? (
          <Modal onClose={() => setIsOpenImgViewer(!isOpenImgViewer)}>
            <Carousel views={currentImgSet}/>
          </Modal>
        ) : null}
      </ModalGateway>
    </>
  )
}

ProjectImages.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(ProjectImages)
