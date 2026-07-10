const functions = require("firebase-functions");

let handler;

module.exports.app = functions.https.onRequest(async (req, res) => {
  if (!handler) {
    const mod = await import("./server/entry-firebase.js");
    handler = mod.default;
  }
  return handler(req, res);
});
