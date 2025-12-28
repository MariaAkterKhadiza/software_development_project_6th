// ================= cart.js =================

import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// GLOBAL function so menu.html buttons can call it
window.addToCart = async function (name, price, image) {

  // Check user login
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  try {
    // Price cleaning (avoid string errors)
    let parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) parsedPrice = 100;

    // Save item inside: users > uid > carts
    await addDoc(
      collection(db, "users", user.uid, "carts"),
      {
        name: name,
        price: parsedPrice,
        image: image,
        qty: 1,
        createdAt: new Date()
      }
    );

    alert(`🛒 Added to cart!\n${name}\nPrice: ৳${parsedPrice}`);
    console.log("✔ Cart item saved");

  } catch (error) {
    console.error("Cart Error:", error);
    alert("❌ " + error.message);
  }
};

console.log("🛒 cart.js Loaded Successfully!");
