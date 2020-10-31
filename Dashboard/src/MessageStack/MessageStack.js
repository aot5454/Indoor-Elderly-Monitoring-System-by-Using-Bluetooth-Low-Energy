import Paho from "paho-mqtt";
import conf from "./config";
// import {locate2} from "../Positioner/PosOne.js";

class MessageStack {
  constructor(callbackFunc) {
    this.callbackFunc = callbackFunc;
    this.errors = [];
    this.beacons = {};
    this.stations = [];

    // This function keep only one record of each beacon
    this.processMessage = function (message) {
      // message is Buffer
      let x = '"';
      let y = '\\"';
      let payload = message.payloadString.split(y).join(x);
      console.log(payload);

      let msg;
      try {
        msg = JSON.parse(payload);
        // TEST SYSTEM
        // if (msg.e[0]) console.log(locate2(parseInt(msg.e[0].r)));
      } catch (error) {
        msg = null;
        console.log(error.message);
      }

      if (msg !== null) {
        for (let i = 0; i < msg.e.length; i++) {
          let mac = msg.e[i].m.toLowerCase();
          let station = msg.st.toLowerCase();
          if (this.stations.includes(station)) {
          } else {
            this.stations.push(station);
          }
          if (this.stations.includes(mac)) {
            // Dont measure stations rssi
            // with other stations.
          } else {
            if (typeof this.beacons[mac] !== "object") {
              // Initialize
              this.beacons[mac] = {};
            } else if (typeof this.beacons[mac][station] === "object") {
              // Remove old record
              delete this.beacons[mac][station];
            }
            // Insert new record
            this.beacons[mac][station] = {
              rssi: parseInt(msg.e[i].r, 10),
              timestamp: Math.floor(Date.now() / 1000),
            };
          }
          this.callbackFunc(this.beacons);
        }
      }
    };

    /* OPEN WEBSOCKET CONNECTION TO MQTT BROKER */
    let client = new Paho.Client(conf.host, conf.port, conf.path, conf.clientId);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = this.processMessage.bind(this);

    client.connect({
      useSSL: true,
      userName: conf.username,
      password: conf.password,
      onSuccess: onConnect,
      onFailure: doFail,
      // reconnect: true,
    });

    function onConnect() {
      console.log("Dashboard is now listening.");
      client.subscribe(conf.topic);
    }

    function doFail(e) {
      console.log(e);
    }

    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }
}
export default MessageStack;
