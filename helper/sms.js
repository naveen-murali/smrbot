let twilio = {

    STATUS: null,

    CONNECT: () => {
        try {
            this.STATUS = require("twilio")(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
            console.log("-------------------------------[Twilio: CONNECTED]-------------------------------");
        } catch (error) {
            console.log(error);
        }
    },

    SND_SMS: async (number, body) => {
        let msgStatus = await this.STATUS.messages.create({
            to: number,
            from: process.env.TWILIO_NUMBER,
            body: body
        });

        return msgStatus;
    }

};

module.exports = twilio;