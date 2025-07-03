import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDTHVRVDxrzm1o9OQkA88dL-4dmR83dtEs",
    authDomain: "drive-clone-58b71.firebaseapp.com",
    projectId: "drive-clone-58b71",
    storageBucket: "drive-clone-58b71.appspot.com",
    messagingSenderId: "873204980658",
    appId: "1:873204980658:web:cc43126dcc270f3b22e2ab"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, auth, provider }