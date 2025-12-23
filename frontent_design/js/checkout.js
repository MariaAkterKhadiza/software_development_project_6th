import { auth, db } from "./firebase.js";
import { addDoc, collection } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("checkoutForm").addEventListener("submit", async e => {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return alert("Cart empty");

  const user = auth.currentUser;
  if (!user) return location.href = "login.html";

  await addDoc(collection(db, "orders"), {
    userId: user.uid,
    items: cart,
    address: address.value,
    status: "pending",
    createdAt: new Date()
  });

  localStorage.removeItem("cart");
  alert("Order placed successfully 🎉");
  location.href = "orders.html";
});
