//Initialize app
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, updateDoc, getDocs, onSnapshot } from 'firebase/firestore';

//Mathquill
import $ from "jquery";
import "mathquill/build/mathquill.css";

window.$ = $;
window.jQuery = $;

await import("mathquill/build/mathquill.js");

const MQ = window.MathQuill.getInterface(2);

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

//Get pidx
const name = sessionStorage.getItem("name");
let pidx = sessionStorage.getItem("pidx");

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

var latexInp;

async function runApp() {
    const room = await getRoom();
    const updates = onSnapshot(room, (r) => {
        //Set pidx
        pidx = r.data().players.indexOf(name);
        const roomData = r.data();

        if (r.data().status === 1) {
            //Start Game
            document.body.innerHTML = "<h1>Complicate:</h1>"
            const mathInput = document.createElement("span");
            mathInput.id = "math-input";
            mathInput.textContent = roomData.history[roomData.history.length - 1];

            document.body.appendChild(mathInput);

            mathInput.style.display = "none";

            latexInp = roomData.history[roomData.history.length - 1];
            const mathField = MQ.MathField(mathInput, {
                autoCommands: "pi tau sum int prod sqrt",
                restrictMismatchedBrackets: true,
                handlers: {
                    edit: (field) => {
                        latexInp = field.latex();
                        console.log(latexInp);
                    }
                }
            });

            requestAnimationFrame(() => {
                mathField.reflow();
            });

            //Submit
            if (r.data().turn == pidx) {
                console.log(latexInp);

                mathInput.style.display = "block";

                const submitBtn = document.createElement("button");

                submitBtn.textContent = "Submit Complication";
                submitBtn.id = "submit-btn";

                document.body.appendChild(submitBtn);

                submitBtn.addEventListener("click", async (e) => {
                    let turn = r.data().turn + 1;
                    turn %= r.data().players.length;

                    let history = r.data().history;
                    history.push(latexInp);

                    await updateDoc(room, {"turn": turn, "history": history});
                });
            } else {
                document.body.innerHTML = "<h1>Waiting For Turn</h1>";
            }
        }
    });
}

runApp();