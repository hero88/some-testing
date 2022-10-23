// ** React Imports
import { Fragment, useState } from 'react'
import { useQueryState } from '@src/utility/hooks/useQueryState'
import { useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import { Button, Col, Row } from 'reactstrap'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

// ** Tables
import InverterTable2 from './InverterTable2'

import ModalForCommonValue from './ModalForCommonValue'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

//Styles
import './styles.scss'

const Inverters2 = () => {
  const [userChoice, setUserChoice] = useQueryState('projectId')

  // const [values, setValues] = useState()
  const [modalForCommonValue, setModalForCommonValue] = useState(false)
  const [selectedInverters, setSelecterInverters] = useState([])
  // state of the Toggle Button
  const [state, setState] = useState({ status: false })
  const listOfProjects = useSelector((state) => state?.auth?.userData?.user?.projects)
  const options = []

  for (let i = 0; i < listOfProjects?.length; i++) {
    const value = `${listOfProjects[i].id}`
    const label = `${listOfProjects[i].name}`
    const option = { value, label }
    options.push(option)
  }

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.checked })
    console.log(userChoice)
  }

  const openForValueModal = () => {
    setModalForCommonValue(true)
    setSelecterInverters(selectedInverters)
  }

  //Handle control power of whole site
  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   const body = {
  //     control_type: 'power_control',
  //     site: userChoice,
  //     control_values: {
  //       absolute_output_power: null,
  //       percentage_output_power: values
  //     }
  //   }
  //   console.log(body)
  //   console.log(userChoice)
  //   // axios
  //   //   .post('http://localhost:5001/api/remote/send_command_to_inverter', body)
  //   //   .then((response) => console.log(response))
  //   //   .catch((error) => console.log(error))
  // }

  return (
    <Fragment>
      <Row className="mb-1">
        <Col lg="2">
          <div
            style={{
              margin: 'auto',
              display: 'inline-block',
              width: 'max-content'
            }}
          >
            <FormControlLabel
              label="Giới hạn công suất"
              control={
                <Switch size="large" checked={state.status} onChange={handleChange} color="primary" name="status" />
              }
            />
          </div>
        </Col>
        <Col lg="6"></Col>
        <Col md="3">
          <Select
            style={{ background: 'transparent' }}
            options={options}
            onChange={(choice) => setUserChoice(choice.value)}
            defaultValue={options[7]}
          />
        </Col>
        <Col lg="1">
          <Button>
            <FilterAltIcon fontSize="large" />
          </Button>
        </Col>
      </Row>

      <InverterTable2
        state={state.status}
        openForValueModal={openForValueModal}
        selectedInverters={selectedInverters}
      />
      <ModalForCommonValue
        modalForCommonValue={modalForCommonValue}
        setModalForCommonValue={setModalForCommonValue}
        selectedInverters={selectedInverters}
      />
    </Fragment>
  )
}

export default Inverters2
