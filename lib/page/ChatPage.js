import {ScrollView, StyleSheet, View} from "react-native";
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Icon, Input, Text} from "react-native-elements";
import {chatReducer} from "../redux/chat/ChatReducer";
import {useDispatch, useSelector} from "react-redux";
import {UserContext} from "../../App";
import {sendMessage} from "../redux/chat/ChatActions";
import {useFirebaseListen} from "../hook/useFirebaseListen";

export function ChatPage(props) {

    const [text, setText] = useState("")
    const {user} = useContext(UserContext)
    const chatState = useSelector(state => state.chatReducer)
    const conversationState = useSelector(state => state.conversationReducer)
    const chatActions = chatReducer.actions
    const dispatch = useDispatch()
    const firebaseListener = useFirebaseListen()
    const messagesRef = useRef(null)

    const handleSentMessage = () => {
        if (text) {
            const message = {
                messageText: text,
                sender: user.email,
                status: 0,
                sendTime: new Date().getTime()
            }
            setText("")
            dispatch(sendMessage({
                chatId: chatState.chatId,
                message: message,
                receiver: chatState.person,
                conversation: chatState.conversation,
                user: user
            }))
        }
    }


    const time = ({timeStamp}) => {
        const date = new Date(timeStamp)
        const isSameDay = checkSameDay({date: date})
        if (isSameDay) {
            return `${date.getHours()}:${date.getMinutes()}`
        } else {
            return date.toLocaleDateString("tr-TR")
        }
    }

    const checkSameDay = ({date}) => {
        const currentDate = new Date()
        return date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getDate() === currentDate.getDate()
    }

    useEffect(() => {
        dispatch(chatActions.setConversation(
            conversationState.conversations.find(element => element.id === chatState.chatId)
        ))
        if (chatState.chatId) {
            firebaseListener({child: chatState.chatId})
        }
    }, [chatState.chatId])

    useEffect(() => {
        props.navigation.setOptions({title: props.route.params.title});
    }, [])


    return <View style={styles.background}>
        <View style={styles.messageList}>
            <ScrollView ref={messagesRef} onContentSizeChange={() => messagesRef.current.scrollToEnd({animated: false})}>
                {
                    chatState.messages.map(element => {
                        const ownMessage = element.sender === user.email;
                        return <View key={element.sendTime}
                                     style={[styles.messageArea, !ownMessage ? styles.oppositeMessageArea : styles.ownMessageArea]}>
                            <View style={[styles.messageBody, !ownMessage ? styles.oppositeMessageBody : styles.ownMessageBody]}>
                                <Text style={styles.messageTitle}>{element.sender}</Text>
                                <Text style={styles.messageText}>{element.messageText}</Text>
                                <View style={styles.messageBottom}>
                                    <Text style={{color: "white"}}>{time({timeStamp: element.sendTime})}</Text>
                                    {ownMessage ? element.status === 0 ? <Icon name={"access-time"} color={"white"}/> : element.status === 1 ? <Icon name={"done"} color={"white"}/> : <Icon name={"done-all"} color={"white"}/> : null}
                                </View>
                            </View>
                        </View>
                    })
                }
            </ScrollView>
        </View>
        <View style={styles.senderArea}>
            <Input containerStyle={styles.inputArea} value={text} onChangeText={(value) => setText(value) } onSubmitEditing={handleSentMessage} />
            <Icon containerStyle={styles.inputButton} name={"send"} color={"white"} onPress={handleSentMessage}/>
        </View>
    </View>
}

const styles = StyleSheet.create({
    background: {
        height: "100%",
        backgroundColor: "#ededed",
    },
    messageList: {
        height: "90%",
        backgroundColor: "#e0e0e0"
    },
    messageArea: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        padding: 2,
        alignItems: "center",
        margin: 0,
    },
    ownMessageArea: {
        justifyContent: "flex-end"
    },
    oppositeMessageArea: {
        justifyContent: "flex-start"
    },
    messageBody: {
        maxWidth: "50%",
        borderRadius: 4,
        marginVertical: 2,
        padding: 10,
    },
    messageText: {
        color: "white",
    },
    messageTitle: {
        color: "white",
        fontWeight: "bold"
    },
    oppositeMessageBody: {
        backgroundColor: "darkseagreen",
    },
    ownMessageBody: {
        backgroundColor: "mediumpurple",
    },
    messageBottom: {
        display: "flex",
        alignSelf: "flex-end",
        flexDirection: "row",
        justifyContent: "center",
    },
    senderArea:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    inputArea:{
        width: "90%"
    },
    inputButton: {
        backgroundColor: "purple",
        padding: 10,
        borderRadius: 100
    }
})


/*

 */
