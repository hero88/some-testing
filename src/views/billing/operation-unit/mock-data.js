import { GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'

export const mockData = {
  name: 'Công ty CP năng lượng Ánh Dương',
  code: 'C001',
  taxCode: '034749292',
  address:
    '134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 134 Điện Biên Phủ, Đakao, Q1 ',
  mobile: '028 238 4478',
  status: {
    value: OPERATION_UNIT_STATUS.ACTIVE,
    label: 'Hoạt động'
  }
}

export const operationUnitArray = [mockData, mockData, mockData].map((item, index) => ({ ...item, id: index + 1 }))
