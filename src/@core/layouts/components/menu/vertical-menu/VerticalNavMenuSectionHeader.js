/* eslint no-unused-vars: 0 */  // --> OFF
// ** Third Party Components
import { FormattedMessage } from 'react-intl'
import { MoreHorizontal } from 'react-feather'
import PropTypes from 'prop-types'

const VerticalNavMenuSectionHeader = ({ item, index }) => {
  return (
    <li className='navigation-header'>
      <span>
        <FormattedMessage id={item.header} />
      </span>
      <MoreHorizontal className='feather-more-horizontal' />
    </li>
  )
}

VerticalNavMenuSectionHeader.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number
}

export default VerticalNavMenuSectionHeader
