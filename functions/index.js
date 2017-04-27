const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.onDown = functions.https.onRequest((request, response) => {
  const color = request.body.color;

  admin.database().ref('/').once('value', snapshot => {

    let count = snapshot.val()[color] + 1;
    let obj = {};
    if (color === 'green') {
      obj = {green: count}
    } else {
      obj = {red: count}
    }
    admin.database().ref('/').update(obj);
    response.status(200).send();
  });
});

exports.onUp = functions.https.onRequest((request, response) => {
  const color = request.body.color;

  admin.database().ref('/').once('value', snapshot => {

    let count = snapshot.val()[color] - 1;

    count = Math.max(0, count);

    let obj = {};
    if (color === 'green') {
      obj = {green: count}
    } else {
      obj = {red: count}
    }
    admin.database().ref('/').update(obj);
    response.status(200).send();
  });
});

exports.reset = functions.https.onRequest((request, response) => {
  admin.database().ref('/').update({green: 0, red: 0});
  response.status(200).send();
});