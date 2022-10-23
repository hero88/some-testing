import { Card, Label } from 'reactstrap'
import { XOctagon } from 'react-feather'
import { FormattedMessage } from 'react-intl'

const CustomNoRecords = () => {
  return (
    <Card className='custom-no-record'>
      <Label className='font-large-2 text-justify'>
        <span className='text-danger mr-2'><XOctagon size={32}/></span>
        <FormattedMessage id='There are no records to display'/>
      </Label>
    </Card>
  )
}

export default CustomNoRecords
