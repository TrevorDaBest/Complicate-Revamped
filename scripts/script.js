//Initialize app
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.API_KEY,
    authDomain: "complicate-revamped.firebaseapp.com",
    projectId: "complicate-revamped",
    storageBucket: "complicate-revamped.firebasestorage.app",
    messagingSenderId: "1024146936709",
    appId: "1:1024146936709:web:90b4d5cadfaa9c3c5b2aec",
    measurementId: "G-G7H2DHNP48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Get rooms
const rooms = collection(db, "rooms");

//Get HTML Elements
const hostGame = document.getElementById("host");

//Create room
async function generateCode(querySnapshot) {
    while (true) {
        let code = Math.floor(Math.pow(10, 6) * Math.random()).toString().padStart(6, '0');

        const codeExists = querySnapshot.docs.some(d => d.data().rID === code);

        if (!codeExists) {
            return code;
        }
    }
}

hostGame.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        const querySnapshot = await getDocs(rooms);
        const roomID = await generateCode(querySnapshot);

        //New Room
        await addDoc(rooms, {
            rID: roomID, //rID
            status: 0, //0 = wait, 1 = play, 2 = game over
            mode: 0, //0 = complicate, 1 = uess the function
            tier: 1,
            turn: 0,
            players: [],
            history: [{"bot": "\\pi r^2"}]
        });

        window.location.href = "../html/hostscreen.html";
        sessionStorage.setItem("rID", roomID);
    } catch (error) {
        alert(`Error setting up room: ${error}`);
    }
});