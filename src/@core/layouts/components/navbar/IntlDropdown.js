// ** React Imports
import { useContext } from 'react'

// ** Third Party Components
import ReactCountryFlag from 'react-country-flag'
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

// ** Internationalization Context
import { IntlContext } from '@src/utility/context/Internationalization'
import { FormattedMessage } from 'react-intl'

const IntlDropdown = () => {
  // ** Context
  const intlContext = useContext(IntlContext)

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    intlContext.switchLanguage(lang)
  }

  return (
    <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link' onClick={e => e.preventDefault()}>
        <ReactCountryFlag
          className='country-flag flag-icon'
          countryCode={intlContext.locale === 'en' ? 'us' : intlContext.locale === 'vi' ? 'vn' : intlContext.locale}
          svg
        />
      </DropdownToggle>
      <DropdownMenu className='mt-0' right>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'en')}>
          <ReactCountryFlag className='small-flag' countryCode='us' svg/>
          <span className='ml-1'>
            <FormattedMessage id='English'/>
          </span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'vi')}>
          <ReactCountryFlag className='small-flag' countryCode='vn' svg/>
          <span className='ml-1'>
            <FormattedMessage id='Vietnamese'/>
          </span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
