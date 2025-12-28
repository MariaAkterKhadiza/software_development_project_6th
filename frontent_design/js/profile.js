import { auth, db } from "../js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let userData = {}, uid = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        location.href = "login.html";
        return;
    }
    uid = user.uid;
    loadProfile();
});

// LOAD PROFILE DATA
async function loadProfile() {
    try {
        const snap = await getDoc(doc(db, "users", uid, "profile", "info"));

        if (!snap.exists()) {
            // Create profile if it doesn't exist
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "users", uid, "profile", "info"), {
                    name: user.displayName || "User",
                    email: user.email,
                    phone: "",
                    createdAt: serverTimestamp()
                });
                // Reload after creating
                return loadProfile();
            }
            
            document.getElementById("profileBox").innerHTML = "<p>No profile found</p>";
            return;
        }

        userData = snap.data();

        const joinedDate = userData.createdAt?.seconds 
            ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString()
            : "Recently";

        document.getElementById("profileBox").innerHTML = `
            <p><strong>Name:</strong> ${userData.name || "Not set"}</p>
            <p><strong>Email:</strong> ${userData.email || "Not set"}</p>
            <p><strong>Phone:</strong> ${userData.phone || "Not Added"}</p>
            <p><strong>Joined:</strong> ${joinedDate}</p>
        `;

        document.getElementById("editButtons").style.display = "none";
        document.getElementById("editBtn").style.display = "inline-block";

    } catch (error) {
        console.error("Error loading profile:", error);
        document.getElementById("profileBox").innerHTML = `
            <p style="color: red;">Error loading profile. Please try again.</p>
        `;
    }
}

// ENABLE EDIT MODE
window.enableEdit = function () {
    document.getElementById("profileBox").innerHTML = `
        <label><strong>Name:</strong></label>
        <input id="editName" value="${userData.name || ""}" style="margin-bottom: 15px;">
        <label><strong>Phone:</strong></label>
        <input id="editPhone" value="${userData.phone || ""}">
    `;

    document.getElementById("editButtons").style.display = "block";
    document.getElementById("editBtn").style.display = "none";
};

// SAVE UPDATED DATA
window.saveProfile = async () => {
    const newName = document.getElementById("editName").value.trim();
    const newPhone = document.getElementById("editPhone").value.trim();

    if (!newName) {
        alert("Name cannot be empty!");
        return;
    }

    if (newPhone && newPhone.length < 10) {
        alert("Phone number must be at least 10 digits!");
        return;
    }

    try {
        await updateDoc(doc(db, "users", uid, "profile", "info"), { 
            name: newName,
            phone: newPhone
        });

        alert("Profile Updated Successfully!");
        loadProfile(); // RELOAD UI
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
};

// Make loadProfile available globally if needed
window.loadProfile = loadProfile;