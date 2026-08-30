//Initialize app
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, getDocs, onSnapshot } from 'firebase/firestore';

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

//Get room ID
const rID = sessionStorage.getItem("rID");

//Get HTML Elements
const gameCodeH1 = document.getElementById("game-code");
const playersView = document.getElementById("players");

//Set Game Code
gameCodeH1.textContent = rID;

//Get the room
async function getRoom() {
    const querySnapshot = await getDocs(rooms);
    var data;
    querySnapshot.forEach((d) => {
        if (d.data().rID == rID) {
            data = d;
            return d;
        }
    });

    return data.ref;
}

//The app
async function runApp() {
    const room = await getRoom();

    //Add Players
    const addPlayer = onSnapshot(room, (r) => {
        playersView.innerHTML = "";

        r.data().players.forEach((player) => {
            const htmlElement = document.createElement("p");
            htmlElement.className = "player";
            htmlElement.textContent = player;

            playersView.appendChild(htmlElement);
        });
    });
}

runApp();