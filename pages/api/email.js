// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import fs from "fs";
import path from "path";

const tk = fs.readFileSync(path.join(__dirname, "../../../../", "token.json"));
const t = JSON.parse(tk);

export default async function handler(req, res) {
  if (req.method == "POST") {
    if (t.access_token == null || t.refresh_token == null) {
      const result = await login();
      saveTokens(result.data.resultObject);
    }

    try {
      const result1 = await sendMail(req.body);

      return res.status(200).send(result1.data);
    } catch (error) {
      if (error.data?.resultCode == 401 || error.response?.status == 401) {
        try {
          const result2 = await getRefreshToken();

          saveTokens(result2.data.resultObject);

          const result3 = await sendMail(req.body);

          return res.status(200).send(result3.data);
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      }
      console.log(error);
      return res.status(500).send(error);
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

function saveTokens(data) {
  fs.writeFileSync(
    path.join(__dirname, "../../../../", "token.json"),
    JSON.stringify(data)
  );
}

function getRefreshToken() {
  return axios.post("https://useapi.useinbox.com/token/refresh", {
    RefreshToken: t.refresh_token,
  });
}
