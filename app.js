const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios").default;
const dotenv = require("dotenv");

const env = dotenv.config().parsed;
const app = express();

const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};

//create client เรียกฝั่งของ line จาก package line/bot-sdk
const client = new line.Client(lineConfig);

//Routing ไปที่ webhook
app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    console.log("event=>>>", events);
    // ถ้ามี events เกิดขึ้น ให้ไปเรียก fucntion handleEvent แต่ถ้าไม่มีอะไร ให้ส่ง status 200
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("ok");
  } catch (error) {
    //
    res.status(500).end();
  }
});
// รับ event
const handleEvent = async (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  } else if (event.type === "message") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Test",
    });
  }
};

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("listen on port 4000");
});
