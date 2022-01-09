/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { AccountUpdateData, NewUserData } from "../models/user.model";

const mail = encodeURIComponent(functions.config().gmail.email);
const password = encodeURIComponent(functions.config().gmail.password);
const transporter = nodemailer.createTransport(`smtps://${mail}:${password}@smtp.gmail.com`);

// firebase functions:config:set gmail.email="mail" gmail.password="password"
// firebase functions:config:get gmail

export const inviteUser = functions.firestore.document("invitedUsers/{userId}").onCreate((snap) => {
  const val = snap.data();
  const html = `
  <p>Сайн байна уу,</p>
  <p><strong>${val.name}</strong> таньд сайтын хэрэглэгч болох урилга илгээж байна. <br>
  Доорх холбоосоор орж өөрийн мэдээллийг бөглөж хэрэглэгчээр бүртгүүлнэ үү.</p>
  <br>
  <p>Бүртгүүлэх хаяг: <a href="ski.nargil.net/signup/${snap.id}">ski.nargil.net/signup/${snap.id}</a></p>

  <p>Монголын Цанын Холбоо</p>
  `;

  const mailOptions = {
    from: "\"Наргил шийдэл\" service@nargil.net",
    to: val.email,
    subject: "Шинэ хэрэглэгчийн бүртгэл",
    html: html,
  };
  return transporter.sendMail(mailOptions)
      .then(() => {
        return console.log("Mail sent to: "+val.email);
      });
});

export const createUserProfile = functions.https.onCall((newProfile: NewUserData) => {
  let profile = {};
  return admin.firestore().doc("users/"+newProfile.userId).set({
    email: newProfile.email,
    firstName: newProfile.firstName,
    lastName: newProfile.lastName,
    registry: newProfile.registry,
    phoneNumber: newProfile.phoneNumber,
    displayName: newProfile.displayName,
    roles: newProfile.roles,
  }).then((res) => {
    profile = res;
    return admin.firestore().doc(`invitedUsers/${newProfile.invitationId}`).delete();
  }).then(() => {
    return profile;
  });
});

export const getAuthProfile = functions.https.onCall((uid) => {
  return admin.auth().getUser(uid).then((userRecord) => {
    return userRecord.toJSON();
  }).catch((error) => {
    console.log(error);
  });
});

export const updateAuthProfile = functions.https.onCall((data: AccountUpdateData) => {
  return admin.auth().updateUser(data.uid, data.update).then((userRecord) => {
    return userRecord.toJSON();
  }).catch((error) => {
    console.log(error);
  });
});
