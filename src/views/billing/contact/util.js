import { API_ADD_CONTACT, API_DELETE_CONTACT, API_UPDATE_CONTACT } from '@src/utility/constants'
import axios from 'axios'

export const handleCRUDOfContacts = ({ contacts, customerId, roofVendorId }) => {
  
  return contacts.map((contact) => {
    const { fullName, position, email, phone, note, id } = contact
   
    if (contact.id < 0 && contact.isCreate)
      // eslint-disable-next-line nonblock-statement-body-position
      return axios.post(API_ADD_CONTACT, {
        fullName,
        position,
        email,
        phone,
        note,
        customerId,
        roofVendorId,
        state: 'ACTIVE'
      })

    if (contact.isUpdate) {
      return axios.put(API_UPDATE_CONTACT, {
        fullName,
        position,
        email,
        phone,
        note,
        id,
        state: 'ACTIVE',
        customerId,
        roofVendorId
      })
    }
    if (contact.isDelete) return axios.delete(`${API_DELETE_CONTACT}/${contact.id}`)
  })
}
