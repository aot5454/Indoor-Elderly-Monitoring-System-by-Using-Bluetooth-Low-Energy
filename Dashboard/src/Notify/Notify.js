import React from "react";
import conf from "./config";

class Notify extends React.Component {
  sentNotify = function (text) {
    const TOKEN = conf.token;
    const proxyurl = conf.proxyurl;
    const url = conf.url + "notify";
    const data = new URLSearchParams();
    data.append("message", text);

    fetch(proxyurl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + TOKEN,
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    })
      .then((response) => response.text())
      .then((contents) => console.log(contents))
      .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
  };

  checkNotify = function () {
    const TOKEN = conf.token;
    const proxyurl = conf.proxyurl;
    const url = conf.url + "status";

    fetch(proxyurl + url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + TOKEN,
      },
    })
      .then((response) => response.text())
      .then((contents) => console.log(contents))
      .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
  };
}

export default Notify;
