import { auth, db } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.querySelector(".order-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      product: document.getElementById("product")?.value,
      flavor: document.getElementById("flavor")?.value,
      size: document.getElementById("size")?.value,
      quantity: document.getElementById("quantity")?.value,
      date: document.getElementById("date")?.value,
      message: document.getElementById("message")?.value,
      createdAt: new Date(),
      status: "pending"
    });

    document.getElementById("confirmation").style.display = "block";
    form.reset();
  });
}
