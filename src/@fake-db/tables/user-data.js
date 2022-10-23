import mock from '../mock'
import { paginateArray } from '../utils'
import jwt from 'jsonwebtoken'

const users = [
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
    username: 'admin@reevn.com',
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

mock.onGet('/api/v1/company').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = users.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.id.toLowerCase().includes(queryLowered) ||
      item.username.toLowerCase().includes(queryLowered) ||
      item.email.toLowerCase().includes(queryLowered) ||
      item.company.toLowerCase().includes(queryLowered) ||
      item.phone.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */

  return [
    200,
    {
      allData: users,
      invoices: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})

mock.onGet('/api/v1/glf_user').reply(config => {
  const { userId } = config.params ? config.params : jwt.decode(config.headers['ree_token'])
  const filteredData = users.filter(item => item.id === userId)

  return [
    200,
    {
      data: { ...filteredData[0] }
    }
  ]
})
