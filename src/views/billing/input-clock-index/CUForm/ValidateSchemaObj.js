import { REAL_NUMBER } from '@src/utility/constants'
import { FormattedMessage } from 'react-intl'
import * as yup from 'yup'

export default {
  projectId: yup
    .object()
    .nullable()
    .required(<FormattedMessage id="required-validate" />),
  customerId: yup
    .object()
    .nullable()
    .required(<FormattedMessage id="required-validate" />),
  contractId: yup
    .object()
    .nullable()
    .required(<FormattedMessage id="required-validate" />),
  cycleId: yup
    .object()
    .nullable()
    .required(<FormattedMessage id="required-validate" />),
  note: yup.string().max(250, <FormattedMessage id="max-validate" />)
}

export const Form2Schema = {
  lowStart: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    }),
  mediumStart: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    }),
  highStart: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    }),
  lowEnd: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    }),
  mediumEnd: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    }),
  highEnd: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    })
}
export const Form4Schema = {
  sellingExchangeRate: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    })
}
export const Form5Schema = {
  sellingRevenue: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    })
}
export const Form7Schema = {
  reactivePowerIndex: yup
    .string()
    .required(<FormattedMessage id="required-validate" />)
    .max(16, <FormattedMessage id="max-validate" />)
    .matches(REAL_NUMBER, {
      message: <FormattedMessage id="invalid-character-validate" />
    })
}
