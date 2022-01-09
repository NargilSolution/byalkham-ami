/* eslint-disable linebreak-style */
/* eslint-disable max-len */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

import * as user from "./user";

export const inviteUser = user.inviteUser;
export const getAuthProfile = user.getAuthProfile;
export const updateAuthProfile = user.updateAuthProfile;
export const createUserProfile = user.createUserProfile;
