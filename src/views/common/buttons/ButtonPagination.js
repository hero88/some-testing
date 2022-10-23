import { useEffect, useState } from 'react'
import { Nav, NavItem } from 'reactstrap'
import { ReactComponent as PrevIcon } from '@src/assets/images/svg/pagination/prev-single-arrow.svg'
import { ReactComponent as NextIcon } from '@src/assets/images/svg/pagination/next-single-arrow.svg'
import classnames from 'classnames'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ROUTER_URL } from '@constants/router'

const ButtonPagination = ({ devices, projectId, deviceId, pathName, perPage = 3 }) => {
  const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(devices?.length / perPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const renderSearch = (item) => {
    switch (pathName) {
      case ROUTER_URL.ALERT:
        return `alertType=${item.id}`

      case ROUTER_URL.PROJECT_ALARM:
        return `projectId=${projectId}&alertType=${item.id}`

      case ROUTER_URL.PROJECT_INVERTER:
      case ROUTER_URL.PROJECT_INVERTER_DETAIL:
      case ROUTER_URL.PROJECT_METER:
      case ROUTER_URL.PROJECT_METER_DETAIL:
        return `?projectId=${projectId}&deviceId=${item.id}&typeModel=${item.typeModel}`

      default:
        return `projectId=${projectId}`
    }
  }

  const renderButtons = (items) => {
    return (
      items?.length
        ? items.map((item, index) => {
          return (
            <NavItem
              key={index}
              className={classnames('ml-1 cursor-pointer', { ['active']: item.id === deviceId })}
              onClick={() => {
                history.push({
                  pathname: item.pathname ? item.pathname : pathName,
                  search: renderSearch(item)
                })
              }}
            >
              <Link
                to={{
                  pathname: item.pathname ? item.pathname : pathName,
                  search: renderSearch(item)
                }}
              >
                {
                  history.location.pathname === ROUTER_URL.PROJECT_INVERTER_DETAIL
                    ? item.name?.slice(0, 6)
                    : item.name
                }
              </Link>
            </NavItem>
          )
        })
        : null
    )
  }

  useEffect(() => {
    if (deviceId && devices?.length) {
      const activeIndex = devices.findIndex(device => device.id === deviceId)
      setCurrentPage(Math.ceil((
        activeIndex + 1
      ) / perPage))
    }
  }, [deviceId, perPage])

  return (
    <Nav pills>
      {
        currentPage > 1 &&
        <NavItem
          className={classnames(
            'prev-btn',
            {
              ['disabled']: currentPage <= 1
            }
          )}
          onClick={handlePrevPage}
        >
          <PrevIcon />
        </NavItem>
      }

      {
        renderButtons(
          devices?.slice((
            currentPage - 1
          ) * perPage, currentPage * perPage)
        )
      }
      {
        currentPage < totalPages &&
        <NavItem
          className={classnames(
            'ml-1 next-btn',
            {
              ['disabled']: currentPage >= totalPages
            }
          )}
          onClick={handleNextPage}
        >
          <NextIcon />
        </NavItem>
      }
    </Nav>
  )
}

ButtonPagination.propTypes = {
  devices: PropTypes.array.isRequired,
  projectId: PropTypes.any,
  deviceId: PropTypes.string,
  pathName: PropTypes.string,
  perPage: PropTypes.number
}

export default ButtonPagination
