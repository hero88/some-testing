import mock from '../mock'
import { paginateArray } from '../utils'
import {  API_ROOF_RETAL_UNIT, API_CONTACT_ROOF_RETAL_UNIT } from '@src/utility/constants'

const positionMockData = [
    {
      value: 1,
      label: 'Kế toán trưởng'
    }
  ]
const roofUnit = [
  {
    id:1,
    code:'ĐV001',
    name: 'CÔNG TY CP NĂNG LƯỢNG ÁNH DƯƠNG',
    taxCode: '03135407448',
    mobile : '028238245',
    email :'info_tendvi@gmail.com',
    address:`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."`,
    state: 'ACTIVE'
  },
  {
    id:2,
    code:'ĐV001',
    name: 'CÔNG TY CP NĂNG LƯỢNG ÁNH DƯƠNG',
    taxCode: '03135407448',
    mobile : '028238245',
    email :'info_tendvi@gmail.com',
    state: 'ACTIVE',
    address:`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."`
  }
]  

const roofUnitContact = [
  {
    id:1,
    name: 'Nguyen quang huy',
    position: positionMockData[0],
    mobile: '0917 478 994',
    email: 'vuong.ntm@gmail.com',
    note: 'Aliquam erat volutpat'
  },
  {
    id:2,
    name: 'Nguyen quang huy',
    position: positionMockData[0],
    mobile: '0917 478 994',
    email: 'vuong.ntm@gmail.com',
    note: 'Aliquam erat volutpat'
  },
  {
    id:3,
    name: 'Nguyen quang huy',
    position: positionMockData[0],
    mobile: '0917 478 994',
    email: 'vuong.ntm@gmail.com',
    note: 'Aliquam erat volutpat'
  },
  {
    id:4,
    name: 'Nguyen quang huy',
      position: positionMockData[0],
      mobile: '0917 478 994',
      email: 'vuong.ntm@gmail.com',
      note: 'Aliquam erat volutpat'
  },
  {
    id:5,
    name: 'Nguyen quang huy',
    position: positionMockData[0],
    mobile: '0917 478 994',
    email: 'vuong.ntm@gmail.com',
    note: 'Aliquam erat volutpat'
  },
  {
    id:6,
    name: 'Nguyen quang huy',
    position: positionMockData[0],
    mobile: '0917 478 994',
    email: 'vuong.ntm@gmail.com',
    note: 'Aliquam erat volutpat'
  }
]

mock.onDelete(`${API_ROOF_RETAL_UNIT}/:id`).reply(config => {
  return [
    200,
    {
      data: config,
      success: true
    }
  ]
})

mock.onGet(API_ROOF_RETAL_UNIT).reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = roofUnitContact.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.name.toLowerCase().includes(queryLowered) ||
      item.mobile.toLowerCase().includes(queryLowered) ||
      item.email.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */
  return [
    200,
    {
      data: roofUnit,
      paginCompany: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})

mock.onGet(API_CONTACT_ROOF_RETAL_UNIT).reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = roofUnitContact.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.name.toLowerCase().includes(queryLowered) ||
      item.mobile.toLowerCase().includes(queryLowered) ||
      item.email.toLowerCase().includes(queryLowered)
  )
  /* eslint-enable  */
  return [
    200,
    {
      data: roofUnit,
      paginCompany: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})

