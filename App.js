import React, {createContext, useEffect, useState} from 'react';
import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import {LoginPage} from "./lib/page/LoginPage";
import {MainPage} from "./lib/page/MainPage";
import auth from '@react-native-firebase/auth';
import {Text} from "react-native-elements";
import {ReactValidatableFormProvider} from "react-validatable-form";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {applyMiddleware, createStore} from "redux";
import {MainReducer} from "./lib/redux/MainReducer";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {ContactsPage} from "./lib/page/ContactsPage";
import {ChatPage} from "./lib/page/ChatPage";
import {OpeningPage} from "./lib/page/OpeningPage";
import {Notifications} from "react-native-notifications";

export const UserContext = createContext(null)
const store = createStore(MainReducer, applyMiddleware(thunk))

const App: () => Node = () => {

    const Stack = createNativeStackNavigator();
    const [user, setUser] = useState(null)
    const [init, setInit] = useState(false)

    useEffect(() => {
        setInit(false)
        auth().onAuthStateChanged((user) => {
            setUser(user)
            setInit(true)
        })
        let localNotification = Notifications.postLocalNotification({
            body: "Local notification!",
            title: "Local Notification Title",
            sound: "chime.aiff",
            silent: false,
            category: "SOME_CATEGORY",
            userInfo: { },
            fireDate: new Date(),
            extra: "data"
        });
    }, [])

    return (
        <Provider store={store}><UserContext.Provider value={{user, setUser}}>
            <NavigationContainer>
                {
                    !init ? <View/> :
                        <Stack.Navigator initialRouteName={"Opening"}>
                            <Stack.Screen name={"Opening"} component={OpeningPage} options={{
                                headerShown: false
                            }}/>
                            <Stack.Screen name={"Main"} component={MainPage} options={{
                                title: "Main Screen",
                                headerStyle: {backgroundColor: "purple"},
                                headerTintColor: '#fff'
                            }}/>
                            <Stack.Screen name={"Login"} component={LoginPage} options={{
                                title: "Login Page",
                                headerStyle: {backgroundColor: "purple"},
                                headerTintColor: '#fff'
                            }}/>
                            <Stack.Screen name={"Contacts"} component={ContactsPage} options={{
                                title: "Contacts",
                                headerStyle: {backgroundColor: "purple"},
                                headerTintColor: '#fff'
                            }}/>
                            <Stack.Screen name={"ChatPage"} component={ChatPage} options={{
                                title: "Chat Page",
                                headerStyle: {backgroundColor: "purple"},
                                headerTintColor: '#fff'
                            }}/>
                        </Stack.Navigator>
                }
            </NavigationContainer>
        </UserContext.Provider></Provider>
    );
};

const styles = StyleSheet.create({})

export default App;
