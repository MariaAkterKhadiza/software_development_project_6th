
import { auth, db } from "./firebase.js";
import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const profileBox = document.getElementById("profileBox");

onAuthStateChanged(auth, async (user) => {
    if (!user) return (window.location.href = "login.html");

    // Firestore path -> users / uid / profile / info
    const ref = doc(db, "users", user.uid, "profile", "info");
    const snap = await getDoc(ref);

    let name = "Not set";

    // Profile exists?
    if (snap.exists()) {
        name = snap.data().name || "Not set";
    } else {
        // Auto create a profile document first time login
        await setDoc(ref, {
            name: user.displayName || "Guest User",
            email: user.email,
            createdAt: new Date()
        });
    }

    const createdDate = new Date(user.metadata.creationTime).toLocaleString();

    profileBox.innerHTML = `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Account Created:</b> ${createdDate}</p>
        <p><b>Password:</b> <button id="resetPassBtn" style="
            background:#ff6666; color:white; border:none; padding:6px 12px;
            border-radius:6px; cursor:pointer;">Reset Password</button></p>
    `;

    // Reset Password
    document.getElementById("resetPassBtn").onclick = () => {
        sendPasswordResetEmail(auth, user.email);
        alert("Password reset link sent to your email.");
    };
});
