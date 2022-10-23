import firebase from 'firebase/app'
import 'firebase/messaging'
import axios from 'axios'
import { API_POST_FIREBASE } from '@constants/api'
import { parseFirebaseMessage } from '@utils'
import { store } from '@src/redux/storeConfig/store'
import { updateFirebaseMessages } from '@src/views/alert/store/action'

const firebaseConfig = {
  apiKey: 'AIzaSyBFa5F-a0oh2-w6D2zUlRmd2Q_RuNR-viY',
  authDomain: 'project-se01.firebaseapp.com',
  projectId: 'project-se01',
  storageBucket: 'project-se01.appspot.com',
  messagingSenderId: '1025989450540',
  appId: '1:1025989450540:web:c2b9fe387eeed353116a89',
  measurementId: 'G-DX0HNFDYPJ'
}

try {
  if (firebase.messaging.isSupported()) {
    if (!firebase?.apps?.length) {
      firebase.initializeApp(firebaseConfig)
    } else {
      firebase.app()
    }

    const messaging = firebase.messaging()

    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.onBackgroundMessage` handler.
    messaging.onMessage((payload) => {
      console.debug('Origin Message received: ', payload)
      const parsedData = payload?.data?.message ? null : parseFirebaseMessage(payload.data)
      console.debug('Message received: ', parsedData)
      const values = parsedData ? Object.values(parsedData) : []

      if (parsedData) {
        store.dispatch(updateFirebaseMessages({ data: values[0] }))
      }
    })
  }
} catch (e) {
  console.error('[firebase.js] - onMessage error: ', e.message)
}

const getMessageToken = (message) => {
  message
    .getToken({ vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
    .then(async (currentToken) => {
      if (currentToken) {
        await axios
          .post(API_POST_FIREBASE, { token: currentToken }, { isNotCount: true })
          .catch((err) => {
            // showToast('error', `${err.response ? err.response.data.message : err.message}`)
            console.error(
              '[firebase.js][getToken] - post API Error: ',
              `${err.response ? err.response.data.message : err.message}`
            )
            // message.deleteToken()
          })
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log('[firebase.js] - No registration token available. Request permission to generate one.')
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log('[firebase.js] - An error occurred while retrieving token. ', err)
      // catch error while creating client token
    })
}

export const getToken = () => {
  try {
    if (firebase.messaging.isSupported()) {
      const message = firebase.messaging()

      // Let's check if the browser supports notifications
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
      } else if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        getMessageToken(message)
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            getMessageToken(message)
          }
        })
      }
    }
  } catch (e) {
    console.error('[firebase.js][getToken] - error: ', e.message)
  }

  return null
}

export const deleteToken = () => {
  try {
    if (firebase.messaging.isSupported() && firebase.messaging().vapidKey) {
      firebase.messaging().deleteToken()
    }
  } catch (e) {
    console.error('[firebase.js][deleteToken] - error: ', e.message)
  }
}

export default firebase
