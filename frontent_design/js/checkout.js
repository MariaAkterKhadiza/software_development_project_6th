// checkout.js - FIXED VERSION
import { auth, db } from "./firebase.js";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Global variables
let cartItems = [];
let selectedPayment = 'cash';
let orderTotal = 0;

// Load cart items on page load
document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }
        await loadCartItems(user.uid);
    });
});

// Load cart items
async function loadCartItems(userId) {
    try {
        const q = query(
            collection(db, "carts"),
            where("userId", "==", userId)
        );

        const snap = await getDocs(q);
        cartItems = [];
        let subtotal = 0;

        const orderItemsDiv = document.getElementById('orderItems');
        orderItemsDiv.innerHTML = '';

        if (snap.empty) {
            orderItemsDiv.innerHTML = '<p>Your cart is empty. <a href="menu.html">Browse menu</a></p>';
            return;
        }

        snap.forEach((docItem) => {
            const item = docItem.data();
            item.id = docItem.id;
            cartItems.push(item);

            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            orderItemsDiv.innerHTML += `
                <div class="order-item">
                    <span>${item.name} × ${item.qty}</span>
                    <span>৳${itemTotal}</span>
                </div>
            `;
        });

        const deliveryFee = subtotal >= 1000 ? 0 : 50;
        orderTotal = subtotal + deliveryFee;

        document.getElementById('subtotal').textContent = `৳${subtotal}`;
        document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`;
        document.getElementById('totalAmount').textContent = `৳${orderTotal}`;

    } catch (error) {
        console.error("Error loading cart:", error);
        document.getElementById('orderItems').innerHTML = '<p>Error loading cart items</p>';
    }
}

// ✅ FIXED: pass event explicitly
window.selectPayment = function (method, ev) {
    selectedPayment = method;

    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });

    ev.currentTarget.classList.add('selected');
};

// Validate form
function validateForm() {
    const address = document.getElementById("address").value.trim();

    if (!address || address.length < 10) {
        document.getElementById('addressError').textContent =
            'Please enter a complete delivery address';
        document.getElementById('addressError').style.display = 'block';
        return false;
    }

    document.getElementById('addressError').style.display = 'none';
    return cartItems.length > 0;
}

// Place order
window.placeOrder = async function () {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const btn = document.getElementById('placeOrderBtn');

    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> Processing...';

        const orderId = 'ORD-' + Date.now();

        const orderData = {
            orderId,
            userId: user.uid,
            email: user.email,
            items: cartItems,
            address: document.getElementById("address").value.trim(),
            paymentMethod: selectedPayment,
            status: selectedPayment === 'cash' ? 'Pending' : 'Paid',
            total: orderTotal,
            createdAt: new Date()
        };

        await addDoc(collection(db, "orders"), orderData);

        for (const item of cartItems) {
            await deleteDoc(doc(db, "carts", item.id));
        }

        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('orderId').textContent = orderId;
        document.getElementById('orderTotal').textContent = '৳' + orderTotal;

        setTimeout(() => {
            window.location.href = "orders.html"; // ✅ FIXED
        }, 3000);

    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = 'Place Order';
        alert("Order failed. Try again.");
    }
};
