// ** Third Party Components
import PropTypes from 'prop-types'

const Repeater = (props) => {
  // ** Props
  // eslint-disable-next-line no-unused-vars
  const { count, tag, component, children, ...rest } = props

  // ** Custom Tag
  const Tag = tag

  // ** Default Items
  const items = []

  // ** Loop passed count times and push it in items Array
  for (let i = 0; i < count; i++) {
    items.push(children(i))
  }

  return <Tag {...rest}>{items}</Tag>
}

// ** PropTypes
Repeater.propTypes = {
  count: PropTypes.number.isRequired,
  tag: PropTypes.string.isRequired,
  component: PropTypes.any,
  children: PropTypes.any
}

// ** Default Props
Repeater.defaultProps = {
  tag: 'div'
}

export default Repeater
