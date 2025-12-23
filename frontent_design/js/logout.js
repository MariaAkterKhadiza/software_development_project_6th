import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.logoutUser = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};
