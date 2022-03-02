import database from '@react-native-firebase/database';
import {useDispatch} from "react-redux";
import {useFirebaseListen} from "../hook/useFirebaseListen";

export const GetMessagesData = async ({chatId}) => {
    const db = database().ref().child("messages")
    const listenMessages = useFirebaseListen({firebase: db, child: chatId})
}

export const sendMessageData = async ({chatId, message, receiver, conversation, user}) => {
    const copyMessage = {...message}
    copyMessage.status = 1
    const db = database().ref().child("messages").child(chatId)
    const response = await db.push(copyMessage)
    if(!conversation){
        const newConversation = {
            id: chatId,
            creator: message.sender,
            creatorId: user.uid,
            receiver: receiver.email,
            receiverId: receiver.id,
            sortTime: message.sendTime
        }
        database().ref().child("conversation").child(chatId).set(newConversation)
    }else{
        updateConversation({conversation: conversation, message: copyMessage})
    }
    const finalMessage = {...copyMessage, id: response.key}
    return finalMessage
}

export const setDeliveredMessageData = async ({chatId, message}) => {
    const copyMessage = {...message}
    copyMessage.status = 2
    const db = database().ref().child("messages").child(chatId)
    const response = await db.child(message.id).set(copyMessage)
}

const updateConversation = async ({chatId, message, conversation}) => {
    const copyConversation = {...conversation}
    copyConversation.sortTime = message.sendTime
    await database().ref().child("conversation").child(conversation.id).set(copyConversation)
}
