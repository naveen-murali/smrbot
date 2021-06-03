const bcrypt = require('bcrypt');
const { FailedDependency } = require('http-errors');
const fs = require('fs')

// Alert schema
const AlertSchema = require('../models/Alert');
// user schema
const AdminSchema = require('../models/Admin');
// customer schema
const CustomersSchema = require('../models/Customers');
// customer schema
const SMSSchema = require('../models/SMS_status');

// email.
const { SEND_EMAIL } = require('./email');
let emailHTML = (user) => {
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
                                        style="display:block;width:48px;height:48px" class="CToWUd">
                            </td>
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
                            <td style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:24px;
                                color:#ffffff;line-height:1.25;text-align:center;">
                                Welcome to SMR BoT Family
                            </td>
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
                                <p>Hi ${user.name},</p>
                                <p>
                                    We are glade to welcome to SMR BoT comunity 
                                    <span style="color:#659cef" dir="ltr">
                                        <a href="mailto:${user.email}" rel="noreferrer noreferrer" target="_blank">
                                            ${user.email}
                                        </a>
                                    </span> through your email
                                    address. Your SMR BoT password is:
                                </p>
                                <div style="text-align:center">
                                    <p dir="ltr">
                                        <strong style="text-align:center;font-size:20px;font-weight:bold;">
                                            ${user.password}
                                        </strong>
                                    </p>
                                </div>
                                <p>
                                    <strong>Please change your password after login.</strong>
                                    <br/>
                                    <strong>Do not forward this password and mail to anyone.</strong>
                                </p>
                                <p>
                                    Web Site: http://127.0.0.1:3000/admin/login <br/>
                                    Username: 
                                    <span style="color:#659cef">
                                        <a href="mailto:${user.email}" rel="noreferrer noreferrer" target="_blank">
                                            ${user.email}
                                        </a>
                                    </span>.
                                </p>
                                <p>
                                    You received this message because this email address is listed as the recovery email for the SMR BoT Account
                                    <span style="color:#659cef">
                                        <a href="mailto:${user.email}" rel="noreferrer noreferrer" target="_blank">
                                            ${user.email}
                                        </a>
                                    </span>.
                                </p>
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
}

module.exports = {
    GET_ADMINS: () => {
        return new Promise(async(resolve, reject) => {
            try {
                resolve(await AdminSchema.find());
            } catch (err) {
                console.error(err);
                resolve([]);
            }
        });
    },

    GET_ONE_ADMIN: (id) => {
        return new Promise((resolve, reject) => {
            AdminSchema.findById(id)
                .then(data => resolve(data))
                .catch(err => {
                    console.error(err);
                    resolve({})
                });
        });
    },

    TOTAL_USERS: () => {
        return new Promise((resolve, reject) => {
            AdminSchema.countDocuments()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    console.error(err);
                    resolve(0);
                });
        })
    },

    TOTAL_CUSTOMERS: () => {
        return new Promise((resolve, reject) => {
            CustomersSchema.countDocuments()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    console.error(err);
                    resolve(0);
                });
        });
    },

    EDIT_USER: (id, data) => {
        return new Promise((resolve, reject) => {
            let match = data.phone.match(/(?:\+?91) ?([\d]{10})/)
            data.phone = match ? match[1] : data.phone;

            data.city = data.city.toLowerCase();
            data.district = data.district.toLowerCase();

            AdminSchema.findByIdAndUpdate(id, data)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    console.error(err);
                    resolve(0);
                })
        });
    },

    ADD_ADMIN: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let emailContent = {
                    to: data.email,
                    subject: 'Welcome to SMR BoT Family',
                    html: emailHTML(data)
                };

                data.password = await bcrypt.hash(data.password, 10);
                data.createdTime = new Date();
                
                let match = data.phone.match(/(?:\+?91) ?([\d]{10})/)
                data.phone = match ? match[1] : data.phone;
    
                data.city = data.city.toLowerCase();
                data.district = data.district.toLowerCase();
    
                data = await AdminSchema.create(data);

                if (!data)
                    return resolve({ status: false, msg: "Faild to create admin." });

                SEND_EMAIL(emailContent)
                .then((emailres) => {
                    if (!emailres.response)
                        return resolve({ status: true, email: false, data, msg: "Faild to send email admin." });
                    
                    return resolve({ status: true, email: true, data, sucess_msg: `Admin ${data.name} is created.` });
                })
                .catch((err) => {
                    console.error(err);
                    return resolve({ status: true, email: false, data, msg: "Faild to send email admin." });
                });
            } catch (err) {
                console.error(err);
                return resolve({status: false, msg: "Faild to create admin."});
            }
            
        });
    },

    REMOVE_ADMIN: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let admin = await AdminSchema.findByIdAndRemove(id);
                await AlertSchema.deleteOne({ userId: id });
                await CustomersSchema.deleteMany({ userId: id });
                await SMSSchema.deleteOne({ userId: id });
                if(admin.localImg)
                    fs.unlink(`./public${admin.localImg}`, (err) => {
                        if (err) console.error(err);
                    });

                if (!admin)
                    return resolve({ status: false, msg: "No admin found." });

                return resolve({ status: true, admin, msg: `${admin.name} is removed.` });
            } catch (err) {
                console.error(err);
                return resolve({ status: false, msg: "Faild to remove the user." });
            }
        })
    }
}