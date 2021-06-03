const OTP = require('otp-generator');
const bcrybt = require('bcrypt');

// user schema
const AdminSchema = require('../models/Admin');
// otp account
const OTP_Schema = require('../models/OTP');

// email
const { SEND_EMAIL } = require('./email');
// sms
const { SND_SMS } = require('./sms');
const GEN_OTP = () => {
    return OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
}

// creating email and sms main section.
const emailHTML = (type, user, emailContent) => {
    if (type === 'otp')
        return `<table border="0" cellspacing="0" cellpadding="0" style="max-width:600px">
        <tbody>
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td align="left">
                                    <img width="48" height="48"
                                            src="https://lh3.googleusercontent.com/a-/AOh14Ggg6GJyOaYsC9f3XonXFTkfVbFBiDtpEawp00Dm=s96-c"
                                            style="display:block;width:48px;height:48px" class="CToWUd"></td>
                                <td align="right">
                                    <img width="32" height="32"
                                            style="display:block;width:32px;height:32px"
                                            src="https://ci3.googleusercontent.com/proxy/12rTzUTfWWCBJcvBcXJwQVKJIoKWWntqD08OrTXdjt7fq1-LLHD4oI_HQpgdZC1Gx7dX6vqHiGVE_VTOkZWq_yGhaViaMBlMd9o=s0-d-e1-ft#https://ssl.gstatic.com/accountalerts/email/keyhole.png"
                                            class="CToWUd">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr height="16"></tr>
            <tr>
                <td>
                    <table bgcolor="#4184F3" width="100%" border="0" cellspacing="0" cellpadding="0"
                        style="min-width:332px;max-width:600px;border:1px solid #e0e0e0;border-bottom:0;
                        border-top-left-radius:3px;border-top-right-radius:3px">
                        <tbody>
                            <tr>
                                <td height="72px" colspan="3"></td>
                            </tr>
                            <tr>
                                <td width="32px"></td>
                                <td
                                    style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:24px;
                                    color:#ffffff;line-height:1.25">
                                    SMR BoT Verification Code</td>
                                <td width="32px"></td>
                            </tr>
                            <tr>
                                <td height="18px" colspan="3"></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table bgcolor="#FAFAFA" width="100%" border="0" cellspacing="0" cellpadding="0"
                        style="min-width:332px;max-width:600px;border:1px solid #f0f0f0;border-bottom:1px
                        solid #c0c0c0;border-top:0;border-bottom-left-radius:3px;border-bottom-right-radius:3px">
                        <tbody>
                            <tr height="16px">
                                <td width="32px" rowspan="3"></td>
                                <td></td>
                                <td width="32px" rowspan="3"></td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Hi ${user.phone},</p>
                                    <p>We received a request to access your SMR BoT Account <span style="color:#659cef"
                                            dir="ltr"><a href="mailto:${user.email}"
                                                rel="noreferrer noreferrer"
                                                target="_blank">${user.email}</a></span> through your email
                                        address. Your SMR BoT verification code is:</p>
                                    <div style="text-align:center">
                                        <p dir="ltr"><strong
                                                style="text-align:center;font-size:24px;font-weight:bold">${emailContent}</strong>
                                        </p>
                                    </div>
                                    <p>If you did not request this code, it is possible that someone else is trying to
                                        access the Google Account <span style="color:#659cef" dir="ltr"><a
                                                href="mailto:${user.email}" rel="noreferrer noreferrer"
                                                target="_blank">${user.email}</a></span>. <strong>Do not
                                            forward or give this code to anyone.</strong></p>
                                    <p>You received this message because this email address is listed as the recovery
                                        email for the SMR BoT Account <span style="color:#659cef"><a
                                                href="mailto:${user.email}" rel="noreferrer noreferrer"
                                                target="_blank">${user.email}</a></span>.</p>
                                    <p>Sincerely yours,</p>
                                    <p>The SMR BoT Accounts team</p>
                                </td>
                            </tr>
                            <tr height="32px"></tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr height="16"></tr>
        </tbody>
        </table>`
    
    if (type === 'passwordChanged')
        return `<table border="0" cellspacing="0" cellpadding="0" style="padding-bottom:20px;max-width:516px;min-width:220px">
        <tbody>
            <tr>
                <td width="8" style="width:8px"></td>
                <td>
                    <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                        align="center"><img
                            src="https://lh3.googleusercontent.com/a-/AOh14Ggg6GJyOaYsC9f3XonXFTkfVbFBiDtpEawp00Dm=s96-c"
                            width="48" height="48" style="margin-bottom:16px" alt="Google" class="CToWUd">
                        <div
                            style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                            <div style="font-size:24px">Your password was changed </div>
                            <table align="center" style="margin-top:8px">
                                <tbody>
                                    <tr style="line-height:normal">
                                        <td align="right" style="padding-right:8px"><img width="20" height="20"
                                                style="width:20px;height:20px;vertical-align:sub;border-radius:50%"
                                                src="${user.profileImg}"
                                                alt="" class="CToWUd"></td>
                                        <td><a style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);font-size:14px;line-height:20px"
                                                rel="noreferrer">${user.email}</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">
                            The password for your SMR BoT Account <a href="mailto:${user.email}" rel="noreferrer"
                                target="_blank">${user.email}</a> was changed. If you didn't change it, you should
                            <a href="http://localhost:3000?email=${user.email}"
                                style="text-decoration:none;color:#4285f4" rel="noreferrer" target="_blank"
                                data-saferedirecturl="http://localhost:3000?email=${user.email}">recover&nbsp;your&nbsp;account</a>.
                        </div>
                        <div
                            style="padding-top:20px;font-size:12px;line-height:16px;color:#5f6368;letter-spacing:0.3px;text-align:center">
                            You can also see security activity at<br><a
                                style="color:rgba(0,0,0,0.87);text-decoration:inherit"
                                rel="noreferrer">https://myaccount.google.com/<wbr>notifications</a></div>
                    </div>
                    <div style="text-align:left">
                        <div
                            style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">
                            <div>
                                You received this email to let you know about important changes to your SMR BoT Account and
                                services.
                            </div>
                            <div style="direction:ltr">
                                © ${new Date().getFullYear()},
                                <a style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center"
                                    rel="noreferrer">
                                    EKNM Gov. Polytechnic College Trikkaripur
                                </a>
                            </div>
                        </div>
                    </div>
                </td>
                <td width="8" style="width:8px"></td>
            </tr>
        </tbody>
    </table>`
}
const smsBODY = (otp) => {
return `Your mobile One Time Password or OTP for SMR BoT account is:
    ${otp}
Treat this as confidential. Dont share the OTP with anyone for security reasons.

Sincerely yours,
The SMR BoT Accounts team`;
}

module.exports = {
    GET_USER_BY_EMAIL: (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await AdminSchema.find({ email });
                resolve(user);
            } catch (err) {
                console.error(err);
                resolve([]);
            }
        });
    },

    GET_USER_BY_ID: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await AdminSchema.findById(id);
                resolve(user);
            } catch (err) {
                console.error(err);
                resolve({});
            }
        });
    },

    ADD_GOOGLE_ID: (googleId, googleImg, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await AdminSchema.findByIdAndUpdate(id, { googleId, googleImg: googleImg, profileImg: googleImg });
                resolve(user);
            } catch (err) {
                resolve({});
            }
        });
    },

    SEND_OTP: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                let phoneOTP = GEN_OTP();
                let emailOTP = GEN_OTP();

                let otp_update = await OTP_Schema.findOneAndUpdate(
                    { userId: user._id },
                    {
                        phoneOTP,
                        emailOTP
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                );

                if (!otp_update) {
                    return resolve({ status: false });
                }

                let emailContent = {
                    to: user.email,
                    subject: 'SMR BoT Varification Code',
                    html: emailHTML('otp', user, emailOTP)
                };

                // sending otp to email to phone.
                let emailres = await SEND_EMAIL(emailContent);
                let smsRes = await SND_SMS(`+91${user.phone}`, smsBODY(phoneOTP));
                
                if (!emailres || !smsRes.sid)
                    return resolve({ status: false });
                    
                return resolve({ status: true });

            } catch (err) {
                console.error(err);
                resolve({ status: false });
            }
        });
    },

    MATCH_OTP: ({ phoneOTP, emailOTP }, userId) => {
        return new Promise((resolve, reject) => {
                
            AdminSchema.findOne(
                {
                    userId,
                    phoneOTP,
                    emailOTP
                }
            ).then((user) => {

                resolve({ status: true });
                
            }).catch((err) => {

                console.error(err);
                resolve({ status: false });

            });
        });
    },

    CHANGE_PASSWORD: (password, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                password = await bcrybt.hash(password, 10);
                let user = await AdminSchema.findByIdAndUpdate(id, { password }, { new: true });
                
                if (!user)
                    return resolve({});
                
                let emailContent = {
                    to: user.email,
                    subject: 'Security alert',
                    html: emailHTML('passwordChanged', user, '')
                }
                await SEND_EMAIL(emailContent);
                return resolve({ status: true });
            } catch (err) {
                console.error(err);
                return resolve({});
            }
        });
    },

    CREATE_NEW_PASSWORD: (body, user) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!await bcrybt.compare(body.currentPasssword, user.password))
                    return resolve({ status: false, error_msg: "Current password is not matching." });

                if (!(body.newPassword === body.cPassword))
                    return resolve({ status: false, error_msg: "New password and confirm password dosen't match." });
                
                body.newPassword = await bcrybt.hash(body.newPassword, 10);

                AdminSchema.findByIdAndUpdate(user._id, { password: body.newPassword }, { new: true })
                    .then((data) => {
                        console.log("here");
                        return resolve({ status: true, sucess_msg: "Password changed.", newId: data.password });
                    })
                    .catch((err) => {
                        console.error(err);
                        return resolve({ status: false, error_msg: "Falied to change password." });
                    });
            } catch (err) {
                console.error(err);
                return resolve({ status: false, error_msg: "Falied to change password." });
            }
        });
    },

    EDIT_PROFILE: ({ name, phone, email, address }, id, profileImg, status) => {
        return new Promise(async (resolve, reject) => {
            try {
                let editRes = null
                if (status === 'addToLocal') {
                    editRes = await AdminSchema.findByIdAndUpdate(id,
                        { name, phone, email, address, localImg: profileImg, profileImg },
                        { new: true });
                } else {
                    editRes = await AdminSchema.findByIdAndUpdate(id,
                        { name, phone, email, address, profileImg },
                        { new: true });
                }

                resolve({ status: true, editRes });
            } catch (err) {
                console.error(err);
                resolve({ status: false });
            }
        });
    },

    PROFILE_IMG_TO_GOOGLE: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                await AdminSchema.findByIdAndUpdate(user._id, { profileImg: user.googleImg });
                resolve({ status: true });
            } catch (err) {
                console.error(err);
                resolve({ status: true });
            }
        });
    },

    PROFILE_IMG_TO_LOCAL: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                await AdminSchema.findByIdAndUpdate(user._id, { profileImg: user.localImg });
                resolve({ status: true });
            } catch (err) {
                console.error(err);
                resolve({ status: true });
            }
        });
    }
}