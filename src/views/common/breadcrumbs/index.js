// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import Proptypes from 'prop-types'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import classnames from 'classnames'
import { ReactComponent as HomeIcon } from '@src/assets/images/svg/headerbar/icon-home.svg'
import { ROUTER_URL } from '@constants/router'

const BreadCrumbs = ({ breadCrumbItems }) => {
  const renderItems = (items) => {
    return items.map((item, index) => {
      return item ? (
        <BreadcrumbItem
          key={index}
          tag="li"
          className={classnames({
            ['text-primary font-weight-bolder']: index === items.length - 1, 'custom-breadcrumb' : item.link === ""
          })}
          active={index === items.length - 1}
          {...item.innerProps}
        >
          {item.link ? <Link to={item.link}>{item.name}</Link> : item.name}
        </BreadcrumbItem>
      ) : null
    })
  }

  return (
    <div className="custom-breadcrumb d-flex">
      <Link to={ROUTER_URL.HOME}>
        <HomeIcon />
      </Link>
      <Breadcrumb>{renderItems(breadCrumbItems)}</Breadcrumb>
    </div>
  )
}
export default BreadCrumbs

// ** PropTypes
BreadCrumbs.propTypes = {
  breadCrumbItems: Proptypes.array.isRequired
}
