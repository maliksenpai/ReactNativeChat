import {addUserDatabase} from "./contactFirebase";
import auth from '@react-native-firebase/auth';

export const loginUser = async ({email, password}) => {
    const response = await auth().signInWithEmailAndPassword(email, password)

    return response
}

export const registerUser = async ({email, password}) => {
    const response = await auth().createUserWithEmailAndPassword(email, password)
    const user = {
        email: email,
        id: response.user.uid,
    }
    addUserDatabase({user: user})
    return response
}

export const logoutUser = async () => {
    await auth().signOut();
}
