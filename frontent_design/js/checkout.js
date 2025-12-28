// checkout.js (FINAL WORKING VERSION)
import { auth, db } from "./firebase.js";
import {
    collection,
    query,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// GLOBAL VARIABLES
let cartItems = [];
let selectedPayment = "cash";
let totalAmount = 0;

// Load when page opens
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) return window.location.href = "login.html";
        loadCart(user.uid);
    });
});

// ================= Load Cart =================
async function loadCart(userId) {
    const cartRef = collection(db, "users", userId, "carts");
    const snap = await getDocs(cartRef);

    const container = document.getElementById("orderItems");
    container.innerHTML = "";

    if (snap.empty) {
        container.innerHTML = `<p>Your cart is empty <a href="menu.html">Shop now</a></p>`;
        return;
    }

    let subtotal = 0;
    cartItems = [];

    snap.forEach(d => {
        const item = d.data();
        item.id = d.id;
        cartItems.push(item);

        const sum = item.price * item.qty;
        subtotal += sum;

        container.innerHTML += `
        <div class="order-item">
            <span>${item.name} × ${item.qty}</span>
            <span>৳${sum}</span>
        </div>`;
    });

    const delivery = subtotal >= 1000 ? 0 : 50;
    totalAmount = subtotal + delivery;

    document.getElementById("subtotal").innerText = "৳" + subtotal;
    document.getElementById("deliveryFee").innerText = delivery === 0 ? "FREE" : "৳" + delivery;
    document.getElementById("totalAmount").innerText = "৳" + totalAmount;
}

// ================= PAYMENT SELECT =================
window.selectPayment = function (method, event) {
    selectedPayment = method;

    document.querySelectorAll(".payment-option")
        .forEach(el => el.classList.remove("selected"));

    event.target.closest(".payment-option").classList.add("selected");
};

// ================= CHECK VALIDATION =================
function validateForm() {
    const address = document.getElementById("address").value.trim();
    const error = document.getElementById("addressError");

    if (address.length < 10) {
        error.innerText = "Enter full delivery address";
        error.style.display = "block";
        return false;
    }
    error.style.display = "none";
    return true;
}

// ================= PLACE ORDER =================
window.placeOrder = async function () {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) return location.href = "login.html";

    const btn = document.getElementById("placeOrderBtn");
    btn.disabled = true;
    btn.innerHTML = `<span class="loading"></span> Processing...`;

    const address = document.getElementById("address").value.trim();
    const id = "ORD-" + Date.now();

    const orderData = {
        orderId: id,
        items: cartItems,
        total: totalAmount,
        paymentMethod: selectedPayment,
        status: selectedPayment === "cash" ? "Pending" : "Paid",
        address,
        createdAt: new Date()
    };

    // Save order
    await addDoc(collection(db, "users", user.uid, "orders"), orderData);

    // Clear the cart
    for (let i of cartItems) {
        await deleteDoc(doc(db, "users", user.uid, "carts", i.id));
    }

    // Success display
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("orderId").innerText = id;
    document.getElementById("orderTotal").innerText = "৳" + totalAmount;

    btn.style.display = "none";

    setTimeout(() => (window.location.href = "orders.html"), 2000);
};

console.log("✅ Checkout system ready");
