// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const map = L.map('map').setView([18.7357, -70.1627], 8); // Centered on DR
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load existing chismes
const loadChismes = async () => {
  const querySnapshot = await getDocs(collection(db, "chismes"));
  querySnapshot.forEach(doc => {
    const data = doc.data();
    L.marker(data.coords).addTo(map).bindPopup(data.text);
  });
};

loadChismes();

// Add chisme
map.on('click', async (e) => {
  const text = prompt("¿Qué chisme hay por aquí?");
  if (text) {
    await addDoc(collection(db, "chismes"), {
      coords: [e.latlng.lat, e.latlng.lng],
      text
    });
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(map).bindPopup(text);
  }
});
