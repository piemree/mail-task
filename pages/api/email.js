// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

let t = {};

export default async function handler(req, res) {
  if (req.method == "POST") {
    if (Object.keys(t).length === 0) {
      const result = await login();
      t = Object.assign(t, result.data.resultObject);
    }

    try {
      const { data } = await sendMail(req.body);
      return res.status(200).send(data);
    } catch (error) {
      if (error.response?.status == 401) {

        try {
          const result = await login();
          t = Object.assign(t, result.data?.resultObject);
          const { data } = await sendMail(req.body);
          return res.status(200).send(data);
        } catch (error) {
          return res.status(500).send(error.response);
        }
      }
      return res.status(500).send(error.response);
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
    EmailAddress: process.env.EMAIL,
    Password: process.env.PASSWORD,
  });
}

