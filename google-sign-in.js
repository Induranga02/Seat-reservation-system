import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIp0LOvfB2WNSzhJXKse09zTvUDC-N684",
  authDomain: "book-my-seat-442805.firebaseapp.com",
  projectId: "book-my-seat-442805",
  storageBucket: "book-my-seat-442805.firebasestorage.app",
  messagingSenderId: "1047839388627",
  appId: "1:1047839388627:web:b6b5978077790068d37526"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

const provider = new GoogleAuthProvider();

// Handle Google Sign-In
const googleLogin = document.getElementById("google-sign-in");
googleLogin.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem("userId", user.uid); // Save user ID in localStorage
      localStorage.setItem("userName", user.displayName); // Save user name
      alert(`Welcome, ${user.displayName}`);
      window.location.href = "landingPage.html"; // Redirect after login
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in. Please try again.");
    });
});

// Check user authentication state on page load
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("userId", user.uid); // Save user ID for use across pages
    localStorage.setItem("userName", user.displayName);
  } else {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  }
});
