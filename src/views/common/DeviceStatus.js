import { useState } from 'react'
import { PopoverBody, PopoverHeader } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'

const DeviceStatus = ({ status }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className='mb-0'
      >
        {status.icon}
      </Typography>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none'
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <PopoverHeader>
          <FormattedMessage id={status.title} />
        </PopoverHeader>
        <PopoverBody>
          <FormattedMessage id={status.message} />
        </PopoverBody>
      </Popover>
    </>
  )
}

DeviceStatus.propTypes = {
  status: PropTypes.object.isRequired
}

export default DeviceStatus
