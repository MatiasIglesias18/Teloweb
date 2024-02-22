import { customInitApp } from "./firebase-admin-config.js"
import pkg from 'firebase-admin';
const { auth } = pkg;
// Init the Firebase SDK every time the server is called
const app = customInitApp();

// Get the uid of the user
const uid = "v6qgogdU9WXI8xEQ5elR3tbpLqZ2";

// Create the custom claims
const customClaims = {
  // The key of the custom claim
  "rol": "admin",
};

// Set the custom claims on the user

auth().setCustomUserClaims(uid, customClaims)
auth().getUser(uid).then(user => (console.log(user)))
