import PropTypes from 'prop-types'

const HeaderName = ({ name, unit }) => {
  return <div>
    {name}
    {
      unit &&
      <>
        <br />
        <span className='font-small-1'>{unit}</span>
      </>
    }
  </div>
}

HeaderName.propTypes = {
  name: PropTypes.string,
  unit: PropTypes.string
}

export default HeaderName
