//Initialize app
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';

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

//Get HTML Elements
const codeInp = document.getElementById("code");
const joinBtn = document.getElementById("join");
const name = document.getElementById("name");

//Get Rooms
const rooms = collection(db, "rooms");

//Join Game
joinBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const rID = codeInp.value;
    const selfName = name.value;

    //Remember room ID
    sessionStorage.setItem("rID", rID);

    if (rID == "") {
        alert("Code Required!");
        return;
    }

    if (selfName == "") {
        alert("Name Required!");
        return;
    }

    //Get Room ID
    var id;

    try {
        const querySnapshot = await getDocs(rooms);
        querySnapshot.forEach((d) => {
            if (d.data().rID == rID) {
                id = d.id;
            }
        });

        if(!id) {
            alert("Invalid Code!");
            return;
        }

        //Add Player
        const players = (await getDoc(doc(db, "rooms", id))).data().players;

        //Check is player exists
        if (players.indexOf(name.value) === -1) {
            players.push(name.value);

            const roomsDoc = doc(db, "rooms", id);
            await updateDoc(roomsDoc, {"players": players});

            sessionStorage.setItem("pidx", players.length - 1);
            sessionStorage.setItem("name", name.value);
        } else {
            alert("Name already exists! Choose a different name!");
        }

    } catch (error) {
        alert(`Failure to join room. Error: ${error}`);
        return;
    }

    sessionStorage.setItem("id", id);

    window.location.href = "../html/playscreen.html";
});