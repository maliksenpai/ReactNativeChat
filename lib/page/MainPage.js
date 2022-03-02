import React, {createContext, useContext, useEffect, useState} from 'react';
import {Card, FAB, Icon, Input, Text} from "react-native-elements";
import {Pressable, ScrollView, View} from "react-native";
import {logoutUser} from "../firebase/firebaseAuth";
import {useDispatch, useSelector} from "react-redux";
import {UserContext} from "../../App";
import {useFirebaseConversation} from "../hook/useFirebaseConversation";
import {useFirebaseContact} from "../hook/useFirebaseContact";
import {getChat} from "../redux/chat/ChatActions";

export function MainPage(props) {

    const [filter, setFilter] = useState("")
    const conversations = useFirebaseConversation()
    const contacts = useFirebaseContact()
    const [init, setInit] = useState(false)
    const contactState = useSelector(state => state.contactReducer)
    const conversationState = useSelector(state => state.conversationReducer)
    const {user} = useContext(UserContext)
    const dispatch = useDispatch()

    const handleStartChat = (person) => {
        dispatch(getChat({userId: user.uid, person: {email: person.email, id: person.id}}))
        props.navigation.push("ChatPage", {title: person.email})
    }


    useEffect(() => {
        if(!init){
            conversations.listenFirebase()
            contacts.listenFirebase()
            setInit(true)
        }
    }, [])

    return <>
        <Input placeholder={"Search"} value={filter} onChangeText={(text) => setFilter(text)} leftIcon={<Icon name={"search"} />} />
        <ScrollView>
            {
                conversationState.conversations.filter(element => element.creator === user.email ? element.receiver.includes(filter) : element.creator.includes(filter)).map(element => {
                    return <Pressable key={element.id} onPress={() => handleStartChat({
                        email: element.creator === user.email ? element.receiver : element.creator,
                        id: element.creator === user.email ? element.receiverId : element.creatorId
                    })}>
                        <Card>
                            <Text>{element.creator === user.email ? element.receiver : element.creator}</Text>
                        </Card>
                    </Pressable>
                })
            }
        </ScrollView>
        <FAB
            placement={"right"}
            onPress={() => props.navigation.push("Contacts", {persons: contactState.persons})}
            icon={<Icon name={"search"} color={"white"} />}
            color={"purple"}
        />
    </>
}
