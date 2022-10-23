/* eslint-disable no-unused-vars */
// ** Router Import
import Router from './router/Router'
import { hot } from 'react-hot-loader/root'

const App = () => {
  return <Router />
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App
