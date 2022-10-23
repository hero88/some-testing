import mock from '../mock'
import { paginateArray } from '../utils'
import {  API_GET_NEW_PROJECT } from '@src/utility/constants'


const project = [
  {
    id:1,
    code:'ĐV001',
    name: 'Dự án cảng Long An',
    customerCompany: 'Công ty TNHH AVB',
    manager : 'Trần Văn Việt Anh',
    email :'info_tendvi@gmail.com',
    address:`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."`,
    state: 'ACTIVE',
    operationDate:'26/06/2022',
    wattage:100
  },
  {
    id:2,
    code:'ĐV002',
    name: 'Dự án cảng Long An',
    customerCompany: 'Công ty TNHH AVB',
    manager : 'Trần Văn Việt Anh',
    email :'info_tendvi@gmail.com',
    address:`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."`,
    state: 'ACTIVE',
    operationDate:'26/06/2022',
    wattage:200
   }
]  

mock.onDelete(`${API_GET_NEW_PROJECT}/:id`).reply(config => {
  return [
    200,
    {
      data: config,
      success: true
    }
  ]
})

mock.onGet(API_GET_NEW_PROJECT).reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1 } = config
  /* eslint-enable */

  const queryLowered = q.toLowerCase()
  const filteredData = project.filter(
    item =>
      /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
      item.name.toLowerCase().includes(queryLowered) 
  )
  /* eslint-enable  */
  return [
    200,
    {
      data: project,
      paginCompany: paginateArray(filteredData, perPage, page),
      total: filteredData.length
    }
  ]
})
