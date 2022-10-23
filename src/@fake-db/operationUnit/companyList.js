import mock from '../mock'

import { API_DELETE_OPERATING_COMPANY } from '@src/utility/constants'

mock.onDelete(`${API_DELETE_OPERATING_COMPANY}/:id`).reply((config) => {
  return [
    200,
    {
      data: config,
      success: true
    }
  ]
})
