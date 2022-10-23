import { Card } from 'reactstrap'

const SingleLinePage = () => {
  return (
    <Card>
      <img
        src={require('@src/assets/images/svg/single-line.svg').default}
        alt='Single line diagram'
      />
    </Card>
  )
}

SingleLinePage.propTypes = {}

export default SingleLinePage