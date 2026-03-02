import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLrqycmvHSQUIhuN01McHnX6t3lMJZOH0",
  authDomain: "new-trail-8181a.firebaseapp.com",
  databaseURL: "https://new-trail-8181a-default-rtdb.firebaseio.com",
  projectId: "new-trail-8181a",
  storageBucket: "new-trail-8181a.firebasestorage.app",
  messagingSenderId: "12030906721",
  appId: "1:12030906721:web:7dbb9acb801b68277a7520",
  measurementId: "G-64NECCS4K4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const messagesRef = ref(db, "messages");

const loginScreen = document.getElementById("loginScreen");
const chatApp = document.getElementById("chatApp");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

let currentUser = null;

// Google Login
document.getElementById("googleLogin").onclick = () => {
  signInWithPopup(auth, provider);
};

// Logout
document.getElementById("logoutBtn").onclick = () => {
  signOut(auth);
};

// Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;

    loginScreen.style.display = "none";
    chatApp.style.display = "flex";

    document.getElementById("userName").innerText = user.displayName;
    document.getElementById("userPhoto").src = user.photoURL;
  } else {
    loginScreen.style.display = "flex";
    chatApp.style.display = "none";
  }
});

// Send message
window.sendMessage = function() {
  const message = messageInput.value.trim();
  if (!message) return;

  push(messagesRef, {
    uid: currentUser.uid,
    name: currentUser.displayName,
    photo: currentUser.photoURL,
    text: message,
    timestamp: Date.now()
  });

  messageInput.value = "";
};

// Receive messages
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (data.uid === currentUser?.uid) {
    messageDiv.classList.add("self");
  } else {
    messageDiv.classList.add("other");
  }

  const time = new Date(data.timestamp).toLocaleTimeString();

  messageDiv.innerHTML = `
    <strong>${data.name}</strong><br>
    ${data.text}
    <div class="timestamp">${time}</div>
  `;

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});