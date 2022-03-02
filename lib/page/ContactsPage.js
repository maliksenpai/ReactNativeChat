import {useFirebaseConversation} from "../hook/useFirebaseConversation";
import {useFirebaseContact} from "../hook/useFirebaseContact";
import {useDispatch, useSelector} from "react-redux";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../App";
import {Card, FAB, Icon, Input, Text} from "react-native-elements";
import {Pressable, ScrollView} from "react-native";
import {getChat} from "../redux/chat/ChatActions";

export function ContactsPage(props) {

    const [filter, setFilter] = useState("")
    const {user} = useContext(UserContext)
    const dispatch = useDispatch()

    const handleStartChat = (person) => {
        dispatch(getChat({userId: user.uid, person: {email: person.email, id: person.id}}))
        props.navigation.push("ChatPage", {title: person.email})
    }

    return <>
        <Input placeholder={"Search"} value={filter} onChangeText={(text) => setFilter(text)} leftIcon={<Icon name={"search"} />} />
        <ScrollView>
            {
                props.route.params.persons.filter(element => element.email.includes(filter)).map(element => {
                    return <Pressable key={element.id} onPress={() => handleStartChat({
                        email: element.email,
                        id: element.id
                    })}>
                        <Card>
                            <Text>{element.email}</Text>
                        </Card>
                    </Pressable>
                })
            }
        </ScrollView>
        <FAB
            placement={"right"}
            icon={<Icon name={"search"} color={"white"} />}
            color={"purple"}
        />
    </>
}

