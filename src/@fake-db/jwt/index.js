import mock from '../mock'
import jwt from 'jsonwebtoken'

const data = {
  users: [
    {
      id: 1,
      fullName: 'REE Admin',
      username: 'admin',
      password: '21232f297a57a5a743894a0e4a801fc3', // 'admin'
      avatar: require('@src/assets/images/portrait/small/avatar-s-11.jpg').default,
      email: 'admin@reedigital.vn',
      role: 3,
      ability: [
        {
          action: 'manage',
          subject: 'all'
        }
      ],
      extras: {
        eCommerceCartItemsCount: 5
      }
    },
    {
      id: 2,
      fullName: 'REE Client',
      username: 'client',
      password: '62608e08adc29a8d6dbc9754e659f125', // 'client'
      avatar: require('@src/assets/images/avatars/1-small.png').default,
      email: 'client@reedigital.vn',
      role: 'client',
      ability: [
        {
          action: 'manage',
          subject: 'dashboard'
        },
        {
          action: 'read',
          subject: 'ACL'
        },
        {
          action: 'read',
          subject: 'Auth'
        }
      ],
      extras: {
        eCommerceCartItemsCount: 5
      }
    },
    {
      id: 3,
      fullName: 'Doan Thanh Nhan',
      username: 'nhandt@nexlesoft.com',
      password: 'admin', // ''
      avatar: require('@src/assets/images/avatars/1-small.png').default,
      email: 'nhandt@nexlesoft.com',
      role: 4,
      extras: {
        eCommerceCartItemsCount: 5
      }
    },
    {
      id: 'USR_001',
      username: 'user001@reevn.com',
      password: 'Aa123456@',
      fullName: 'Nguyễn Văn Tèo',
      avatar: require('@src/assets/images/avatars/1.png').default,
      email: 'user001@gmail.com',
      phone: '0903111222',
      company: { value: 1, label: 'Google' },
      projects: [
        { value: 1, label: 'PRJ-001' },
        { value: 2, label: 'HCM-001' },
        { value: 3, label: 'BD-001' }
      ],
      role: { value: 1, label: 'Site portal - Admin' }
    },
    {
      id: 'USR_002',
      username: 'user002@reevn.com',
      password: 'Aa123456@',
      fullName: 'Lê Thị Nở',
      avatar: require('@src/assets/images/avatars/2.png').default,
      email: 'user002@gmail.com',
      phone: '0903444555',
      company: { value: 1, label: 'Google' },
      projects: [{ value: 2, label: 'HCM-001' }],
      role: { value: 1, label: 'Site portal - Admin' }
    },
    {
      id: 'USR_003',
      username: 'user003@reevn.com',
      password: 'Aa123456@',
      fullName: 'Nguyễn Văn Tèo',
      avatar: require('@src/assets/images/avatars/1.png').default,
      email: 'user003@gmail.com',
      phone: '0903111222',
      company: { value: 2, label: 'Facebook' },
      projects: [{ value: 1, label: 'PRJ-001' }],
      role: { value: 4, label: 'Admin portal - User' }
    },
    {
      id: 'USR_004',
      username: 'user004@reevn.com',
      password: 'Aa123456@',
      fullName: 'Phạm Băng Băng',
      avatar: require('@src/assets/images/avatars/1.png').default,
      email: 'pengpeng@baidou.com',
      phone: '0903999888',
      company: { value: 3, label: 'Microsoft' },
      projects: [
        { value: 1, label: 'PRJ-001' },
        { value: 3, label: 'BD-001' }
      ],
      role: { value: 1, label: 'Site portal - Admin' }
    },
    {
      id: 'USR_005',
      username: 'user005@reevn.com',
      password: 'Aa123456@',
      fullName: 'Hoàng Phi Hồng',
      avatar: require('@src/assets/images/avatars/1.png').default,
      email: 'phihong99@gmail.com',
      phone: '0903333666',
      company: { value: 1, label: 'Google' },
      projects: [
        { value: 1, label: 'PRJ-001' },
        { value: 2, label: 'HCM-001' },
        { value: 3, label: 'BD-001' }
      ],
      role: { value: 1, label: 'Site portal - Admin' }
    },
    {
      id: 'USR_999',
      username: 'admin@ree.vn',
      password: 'Aa123456@',
      fullName: 'Who am I ?',
      avatar: require('@src/assets/images/avatars/9.png').default,
      email: 'phihong99@gmail.com',
      phone: '0909999999',
      company: { value: 1, label: 'Google' },
      projects: [
        { value: 1, label: 'PRJ-001' },
        { value: 2, label: 'HCM-001' },
        { value: 3, label: 'BD-001' }
      ],
      role: { value: 99, label: 'Super admin' }
    }
  ]
}

// ! These two secrets shall be in .env file and not in any other file
const jwtConfig = {
  secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
  refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
  expireTime: '10m',
  refreshTokenExpireTime: '10m'
}

mock.onPost('/jwt/login').reply(request => {
  const { username, password } = JSON.parse(request.data)

  let error = {
    username: ['Something went wrong']
  }

  const user = data.users.find(u => u.username === username && u.password === password)

  if (user) {
    try {
      const accessToken = jwt.sign({ userId: user.id, role: user.role.value }, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })
      const refreshToken = jwt.sign({ userId: user.id }, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshTokenExpireTime
      })

      const userData = { ...user }

      delete userData.password

      const response = {
        data: {
          userData,
          accessToken,
          refreshToken
        }
      }

      return [200, response]
    } catch (e) {
      error = e
    }
  } else {
    error = {
      email: ['Email or Password is Invalid']
    }
  }

  return [400, { error }]
})

mock.onPost('/jwt/register').reply(request => {
  if (request.data.length > 0) {
    const { email, password, username } = JSON.parse(request.data)
    const isEmailAlreadyInUse = data.users.find(user => user.email === email)
    const isUsernameAlreadyInUse = data.users.find(user => user.username === username)
    const error = {
      email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
      username: isUsernameAlreadyInUse ? 'This username is already in use.' : null
    }

    if (!error.username && !error.email) {
      const userData = {
        email,
        password,
        username,
        fullName: '',
        avatar: null,
        role: 'admin',
        ability: [
          {
            action: 'manage',
            subject: 'all'
          }
        ]
      }

      // Add user id
      const length = data.users.length
      let lastIndex = 0
      if (length) {
        lastIndex = data.users[length - 1].id
      }
      userData.id = lastIndex + 1

      data.users.push(userData)

      const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })

      const user = Object.assign({}, userData)
      delete user['password']
      const response = { user, accessToken }

      return [200, response]
    } else {
      return [200, { error }]
    }
  }
})

mock.onPost('/jwt/refresh-token').reply(request => {
  const { refreshToken } = JSON.parse(request.data)

  try {
    const { id } = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret)

    const userData = { ...data.users.find(user => user.id === id) }

    const newAccessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })
    const newRefreshToken = jwt.sign({ id: userData.id }, jwtConfig.refreshTokenSecret, {
      expiresIn: jwtConfig.refreshTokenExpireTime
    })

    delete userData.password
    const response = {
      userData,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }

    return [200, response]
  } catch (e) {
    const error = 'Invalid refresh token'
    return [401, { error }]
  }
})
