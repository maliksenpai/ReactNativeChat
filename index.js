/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {firebase} from '@react-native-firebase/app';
import {applyMiddleware, createStore} from "redux";
import {MainReducer} from "./lib/redux/MainReducer";
import thunk from "redux-thunk";



if (!firebase.apps.length) {
   firebase.initializeApp({
      appId: '1:415902008091:web:ae8dae3bd9768d858949be',
      apiKey: 'AIzaSyBCXYOzXr1rkuJ0dwSymuxme1153yTa8u8',
      projectId: 'chatapp-c3f46',
      databaseURL: 'https://chatapp-c3f46-default-rtdb.europe-west1.firebasedatabase.app/',
      storageBucket: 'chatapp-c3f46.appspot.com',
      messagingSenderId: '415902008091',
   });
}

AppRegistry.registerComponent(appName, () => App)
