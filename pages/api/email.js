// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

let t = {};

export default async function handler(req, res) {
  if (req.method == "POST") {
    if (t.access_token) {
      const result = await login();
      t = Object.assign(t, result.data.resultObject);
    }

    try {
      const result1 = await sendMail(req.body);

      return res.status(200).send(result1.data);
    } catch (error) {
      try {
        const result = await login();
        t = Object.assign(t, result.data.resultObject);
        const result3 = await sendMail(req.body);
        console.log(result3.data);
        return res.status(200).send(result3.data);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  }
}

function sendMail(data) {
  return axios.post("https://useapi.useinbox.com/notify/v1/send", data, {
    headers: {
      Authorization: "Bearer " + t.access_token,
    },
  });
}

function login() {
  return axios.post("https://useapi.useinbox.com/token", {
    EmailAddress: "emre.demir@tazebt.com",
    Password: "Lftixyz1.",
  });
}
