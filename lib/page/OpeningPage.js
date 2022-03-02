import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../App";
import {ActivityIndicator, View} from "react-native";
import { useFocusEffect } from '@react-navigation/core';

export function OpeningPage(props) {

    const user = useContext(UserContext)

    useFocusEffect(() => {
        if (user) {
            props.navigation.replace("Main")
        } else {
            props.navigation.replace("Login")
        }
    },)

    return <View style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%"}}>
        <ActivityIndicator color={"purple"} />
    </View>
}
