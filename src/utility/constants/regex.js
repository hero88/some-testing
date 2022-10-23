export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const VN_PHONE_REGEX = /^$|^[84|0][2|3|5|7|8|9][0-9]{4,9}$/
export const IMAGE_REGEX = /\.(jpeg|jpg|gif|png)$/
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/
export const ELECTRICITY_REGEX = /^P[\d|A-Z]{12}$/gm
export const PROJECT_CODE = /^[\d|A-Z]{4,256}$/gm
export const CUSTOMER_CODE = /^[\d|A-Z]{3,256}$/gm
export const NORMAL_CHARACTER = /[^a-zA-Z0-9]/g
export const NUMBER_REGEX = /^\d+$/g
export const COORDINATES_REGEX =
  /^$|^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/gm
export const REAL_NUMBER = /^(\d|,\d)*(\.\d+)?\d*$/g
