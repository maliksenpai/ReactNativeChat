import {Button, Icon, Input, Text} from "react-native-elements";
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useValidatableForm} from "react-validatable-form";
import {ActivityIndicator, StyleSheet, Switch, View} from "react-native";
import {UserContext} from "../../App";
import {loginUser, registerUser} from "../firebase/firebaseAuth";

const rules = [
    {
        path: "email",
        ruleSet: [
            {rule: "required"},
            {rule: "email"},
        ],
        dependantPaths: ["comparisonValue"],
    },
    {
        path: "password",
        ruleSet: [
            {rule: "required"},
            {
                rule: "length",
                greaterThan: 8,
            },
        ],
        dependantPaths: ["comparisonValue"],
    },
]

export function LoginPage(props) {

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {user} = useContext(UserContext)
    const [register, setRegister] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const handleSubmit = () => {
        if(email.length > 8 && password.length > 8){
            setLoading(true)
            setError(null)
            if(register){
                registerUser({email: email, password:password})
                    .then(() => setLoading(false))
                    .catch(error => {
                        setError(error)
                        setLoading(false)
                    })
            }else{
                loginUser({email: email, password: password})
                    .then(() => setLoading(false))
                    .catch(error => {
                        setError(error)
                        setLoading(false)
                    })
            }
        }
    }

    useEffect(() => {
        if(user){
            props.navigation.replace("Main")
        }
    }, [user])

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    };

    return <View style={styles.page}>
        <View style={styles.login}>
            <Input
                placeholder={"Email"}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Input
                placeholder={"Password"}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon name={showPassword ? "visibility-off" : "visibility"}
                          onPress={handleShowPassword}/>
                }
            />
            <Button
                title={register ? "Register" : "Login"}
                buttonStyle={styles.loginButton}
                onPress={handleSubmit}
            />
            <View style={styles.switch}>
                <Text>
                    Register
                </Text>
                <Switch
                    value={register}
                    thumbColor={"purple"}
                    onValueChange={(value) => { setRegister(!register)}}
                />
            </View>
            <View>
                {
                    loading ? <ActivityIndicator /> : null
                }
            </View>
            <View>
                {
                    error ? <Text> {error.toString()} </Text> : null
                }
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    page: {
        height: "100%", display: "flex", justifyContent: "center", alignItems: "center"
    },
    login: {
        width: "60%"
    },
    loginButton: {
        backgroundColor: "purple"
    },
    switch: {
        display: "flex",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    }
})
