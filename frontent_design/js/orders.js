import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  const q = query(collection(db, "orders"), where("userId", "==", user.uid));
  const snap = await getDocs(q);

  ordersList.innerHTML = "";

  snap.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.product}</strong><br>
      Qty: ${data.quantity}<br>
      Status: ${data.status}
    `;
    ordersList.appendChild(li);
  });
});
