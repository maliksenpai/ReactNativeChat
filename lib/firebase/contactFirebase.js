import database from '@react-native-firebase/database';

/*export async function getInitialContactsData({email}) {
    const db = firestore().collection("users")
    const response = await db.where("email", "!=", email).get()
    return response.docs
}*/

export function addUserDatabase({user}) {
    database().ref().child("contact").push(user)
}
