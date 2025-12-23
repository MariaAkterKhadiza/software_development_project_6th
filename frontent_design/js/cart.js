// cart.js - SIMPLE WORKING VERSION
import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// GLOBAL FUNCTION - SIMPLE
window.addToCart = async function(name, price, image) {
  console.log("Adding to cart:", name, price);
  
  // Check if user is logged in
  const user = auth.currentUser;
  
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }
  
  try {
    // Clean price
    let parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      parsedPrice = 100;
    }
    
    // Add to Firestore
    await addDoc(collection(db, "carts"), {
      userId: user.uid,
      name: name,
      price: parsedPrice,
      image: image,
      qty: 1,
      createdAt: new Date()
    });
    
    alert("✅ Added to cart!\n" + name + "\nPrice: ৳" + parsedPrice);
    console.log("Item added successfully!");
    
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error: " + error.message);
  }
};

console.log("🛒 Cart system loaded!");