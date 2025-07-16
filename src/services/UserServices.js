const UserModel = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel')
const EmailSend = require('../utility/EmailHelper')
const {EncodeToken} = require('../utility/TokenHelper')


const UserOTPService = async (req) => {
    try {
      const email = req.params.email;
      const code = Math.floor(100000 + Math.random() * 900000);
      const EmailText = `Your Verification Code is ${code}`;
      const EmailSubject = "Email Verification";
      await EmailSend(email, EmailText, EmailSubject);

      await UserModel.updateOne(
        { email: email },
        { $set: { otp: code } },
        { upsert: true }
      );
      return {
        status: "success",
        message: "6 Digit OTP has been sent successfully",
      };
    } catch (err) {
        return {
          status: "error",
          message:
            "An error has occurred, failed to send email verification+" +
            err.message,
        };
    }
    
}

const VerifyLoginService = async (req) => {
    try {
        const email = req.params.email;
        const otp = req.params.otp;
        if (otp === 0) return {status: 'error', message: 'Invalid verification code'}
        // user count
        const total = await UserModel.find({email: email, otp: otp}).countDocuments()
        if (total === 1) {
            // User id read
            const user_id = await UserModel.find({email: email, otp: otp}).select('_id')
// Token generated
            const token = EncodeToken(email, user_id[0]['_id'].toString())
            // update otp
            await UserModel.updateOne({email: email}, {$set: {otp: '0'}}, {upsert: true})
            return {status: 'success', message: 'User has been successfully verified', token: token}
        } else {
            return {status: 'error', message: 'User verification error verified'}
        }
    } catch (err) {
        return {status: 'error', message: 'Invalid verification code or Email Address'}
    }
}

const SaveProfileService = async (req) => {
    try {
        const user_id = req.headers.user_id
        let reqBody = req.body
        reqBody.userID = user_id
        await ProfileModel.updateOne({userID: user_id}, {$set: reqBody}, {upsert: true})
        return {status: 'success', message: 'Profile has been saved successfully'}

    } catch (err) {
        return {status: 'error', message: 'Error saving profile'}
    }
}


const ReadProfileService = async (req) => {
    try {


        const user_id = req.headers.user_id
        const result = await ProfileModel.findOne({userID: user_id})
        if (result) {
            return {status: 'success', data: result}
        } else {
            return {status: 'error', message: 'No profile found for this user'}
        }
    } catch (err) {
        return {status: 'error', message: 'Error reading profile'}
    }

}


module.exports = {
    UserOTPService,
    VerifyLoginService,
    SaveProfileService,

    ReadProfileService
}