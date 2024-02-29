const express = require("express");
const { getData } = require("./api");

const CF_API_URL = process.env.CF_API_URL || "https://api.fr.cloud.gov/v3";
const CF_USER_TOKEN = process.env.CF_USER_TOKEN || undefined;
const ENV = process.env.ENV || "local";

const app = express();
app.set("view engine", "ejs")

async function getHomeInfo(onResponse) {
  const body = await getData(CF_API_URL + "/apps", CF_USER_TOKEN)
  const resources = body.resources;
  return onResponse(resources);
}

function isLoggedIn() {
  return (ENV == "local" && CF_USER_TOKEN !== undefined)
}

app.get("/", (req, res) => {
  getHomeInfo(function(data) {
    res.render("index", {
      resources: data
    });
  });
})

var server = app.listen(8000, () => {
  console.log("Listening on http://localhost:8000");
  if (!isLoggedIn()) {
    console.log("Please log into cloud foundry via sso cli");
    server.close();
  }
})
