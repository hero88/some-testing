import { API_ADD_CLOCK, API_DELETE_CLOCK, API_UPDATE_CLOCK, ISO_DISPLAY_DATE_TIME_FORMAT } from '@src/utility/constants'
import axios from 'axios'
import moment from 'moment'

export const handleCRUDOfClocks = ({ clocks, contractId }) => {
  return clocks.map((clock) => {
    const { name, seri, type, manufacturer, inspectionDate, id } = clock
    if (clock.id < 0 && clock.isCreate)
      // eslint-disable-next-line nonblock-statement-body-position
      return axios.post(API_ADD_CLOCK, {
        name,
        seri,
        type,
        manufacturer,
        inspectionDate: inspectionDate ? moment.utc(inspectionDate).format(ISO_DISPLAY_DATE_TIME_FORMAT) : null,
        contractId
      })

    if (clock.isUpdate) {
      return axios.put(API_UPDATE_CLOCK, {
        name,
        seri,
        type,
        manufacturer,
        inspectionDate: inspectionDate ? moment.utc(inspectionDate).format(ISO_DISPLAY_DATE_TIME_FORMAT) : null,
        id,
        contractId
      })
    }
    if (clock.isDelete) return axios.delete(`${API_DELETE_CLOCK}/${clock.id}`)
  })
}
