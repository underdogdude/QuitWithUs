// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDcZ1YxsaLOf5K4AZ06ZqciY4kuhIelygk",
    authDomain: "quitwithus-7222a.firebaseapp.com",
    databaseURL: "https://quitwithus-7222a.firebaseio.com",
    projectId: "quitwithus-7222a",
    storageBucket: "quitwithus-7222a.appspot.com",
    messagingSenderId: "172399022330",
    appId: "1:172399022330:web:1bd9d438de185f79eef943",
    measurementId: "G-TW5VXT801J"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function logout() {
    firebase
        .auth()
        .signOut()
        .then(function() {
            window.location.replace("./login.html");
        })
        .catch(function(error) {
            // An error happened.
            alert(error);
        });
}
