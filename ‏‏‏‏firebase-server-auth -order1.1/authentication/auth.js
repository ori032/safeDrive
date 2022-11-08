const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://server-auth-41acc.firebaseio.com",
});



function verifySession(req, res, next) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      res.userData = userData
      console.log("verifySession: next")
      next();
    })
    .catch((error) => {
      console.log("verifySession: redirect /login")
      res.render("/login");
    });
}
