//Initialize app
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';

//KaTeX rendering
import katex from "katex";
import "katex/dist/katex.min.css";

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
const startGame = document.getElementById("play");

//Formulas
const formulas = {
    "1": [
        "A=\\frac{1}{2}bh",
        "A=\\frac{h\\left(b_1+b_2\\right)}{2}",
        "A=\\pi r^2",
        "C=2\\pi r",
        "r=\\frac{d}{2}",
        "\\pi=\\frac{C}{d}",
        "a^2+b^2=c^2",
        "a+b>c",
        "R=\\mathrm{max}-\\mathrm{min}",
        "y=mx+b",
        "y-y_1=m\\left(x-x_1\\right)",
        "m=\\frac{y_2-y_1}{x_2-x_1}",
        "\\left(a+b\\right)\\left(c+d\\right)=ac+ad+bc+bd",
        "x^{-y}=\\frac{1}{x^y}",
        "F=ma",
        "KE=\\frac{1}{2}mv^2",
        "E=mc^2",
        "V=IR",
        "E=\\frac{hc}{\\lambda}"
    ]
};

//Set Game Code
gameCodeH1.textContent = rID;

//Get the room
async function getRoom() {
    const q = query(rooms, where("rID", "==", rID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        
        return firstDoc.data(); 
    }

    return null;
}

//The app
async function runApp() {
    //Get the query
    const q = query(rooms, where("rID", "==", rID));
    const querySnapshot = await getDocs(q);
    const reference = querySnapshot.docs[0].ref; //Get reference

    //Add Players
    const addPlayer = onSnapshot(reference, async (r) => {
        playersView.innerHTML = "";
        const room = await getRoom();

        if (room.status === 0) {
            r.data().players.forEach((player) => {
                const htmlElement = document.createElement("p");
                htmlElement.className = "player";
                htmlElement.textContent = player;

                playersView.appendChild(htmlElement);
            });
        } else {
            const formula = room.history[room.history.length - 1]
            playersView.innerHTML = `<h2>Latest Complication</h2><br><div id=\"complication\">\$\$${formula}\$\$</div>`;

            katex.render(formula, document.getElementById("complication"), {
                throwOnError: false
            });
        }
    });

    //Start game
    startGame.addEventListener("click", async (e) => {
        const room = await getRoom();

        try {
            if (room.players.length < 2) {
                alert("Not enough players! Need atleast 2 to play!");
                return;
            }

            //Select formula
            let formula = "";
            console.log(room.mode);
            if (room.mode == 0) {
                formula = formulas[room.tier][Math.floor(formulas[room.tier].length * Math.random())];
            }

            updateDoc(reference, {"status": 1, "history": [formula]});
        }

        catch (error) {
            alert(`An unexpected error occured. ${error.message}`);
        }
    });
}

runApp();