// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** Third Party Components
import Proptypes from 'prop-types'
import { Badge } from 'reactstrap'
import classnames from 'classnames'

import defaultAvatar from '@src/assets/images/avatars/avatar-blank.svg'

const Avatar = forwardRef((props, ref) => {
  Avatar.displayName = 'Avatar'
  // ** Props
  const {
    color,
    className,
    imgClassName,
    initials,
    size,
    badgeUp,
    content,
    icon,
    badgeColor,
    badgeText,
    img,
    imgHeight,
    imgWidth,
    status,
    tag: Tag,
    contentStyles,
    ...rest
  } = props

  const [avatar, setAvatar] = useState(defaultAvatar)
  // ** Function to extract initials from content
  const getInitials = str => {
    const results = []
    const wordArray = str.split(' ')
    wordArray.forEach(e => {
      results.push(e[0])
    })
    return results.join('')
  }

  useEffect(() => {
    if (img && img !== '') {
      setAvatar(img)
    }
  }, [img])

  return (
    <Tag
      className={classnames('avatar', {
        [className]: className,
        [`bg-${color}`]: color,
        [`avatar-${size}`]: size
      })}
      ref={ref}
      {...rest}
    >
      {img === false || img === undefined ? (
        <span
          className={classnames('avatar-content', {
            'position-relative': badgeUp
          })}
          style={contentStyles}
        >
          {initials ? getInitials(content) : content}

          {icon ? icon : null}
          {badgeUp ? (
            <Badge color={badgeColor ? badgeColor : 'primary'} className='badge-sm badge-up' pill>
              {badgeText ? badgeText : '0'}
            </Badge>
          ) : null}
        </span>
      ) : (
        <img
          className={classnames({
            [imgClassName]: imgClassName
          })}
          src={avatar}
          alt='avatarImg'
          height={imgHeight && !size ? imgHeight : 32}
          width={imgWidth && !size ? imgWidth : 32}
          onError={() => {
            setAvatar(defaultAvatar)
          }}
        />
      )}
      {status ? (
        <span
          className={classnames({
            [`avatar-status-${status}`]: status,
            [`avatar-status-${size}`]: size
          })}
        ></span>
      ) : null}
    </Tag>
  )
})

export default Avatar

// ** PropTypes
Avatar.propTypes = {
  imgClassName: Proptypes.string,
  className: Proptypes.string,
  src: Proptypes.string,
  tag: Proptypes.oneOfType([Proptypes.func, Proptypes.string]),
  badgeUp: Proptypes.bool,
  content: Proptypes.string,
  icon: Proptypes.node,
  contentStyles: Proptypes.object,
  badgeText: Proptypes.string,
  imgHeight: Proptypes.oneOfType([Proptypes.string, Proptypes.number]),
  imgWidth: Proptypes.oneOfType([Proptypes.string, Proptypes.number]),
  size: Proptypes.oneOfType([Proptypes.string, Proptypes.number]),
  status: Proptypes.oneOf(['online', 'offline', 'away', 'busy']),
  badgeColor: Proptypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'info',
    'warning',
    'dark',
    'light-primary',
    'light-secondary',
    'light-success',
    'light-danger',
    'light-info',
    'light-warning',
    'light-dark'
  ]),
  color: Proptypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'info',
    'warning',
    'dark',
    'light-primary',
    'light-secondary',
    'light-success',
    'light-danger',
    'light-info',
    'light-warning',
    'light-dark'
  ]),
  img: Proptypes.string,
  initials(props) {
    if (props['initials'] && props['content'] === undefined) {
      return new Error('content prop is required with initials prop.')
    }
    if (props['initials'] && typeof props['content'] !== 'string') {
      return new Error('content prop must be a string.')
    }
    if (typeof props['initials'] !== 'boolean' && props['initials'] !== undefined) {
      return new Error('initials must be a boolean!')
    }
  }
}

// ** Default Props
Avatar.defaultProps = {
  tag: 'div'
}
