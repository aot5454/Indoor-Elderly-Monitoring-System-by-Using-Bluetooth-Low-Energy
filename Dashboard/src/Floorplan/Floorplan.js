import React from "react";
// import floor_image_file from "../img/appartment_floorplan.jpg";
import floor_image_file from "../img/floor213.jpg";
import "./Floorplan.css";
import Pin from "./BeaconPin";
import Station from "../Satellite/Satellite";
import {locate} from "../Positioner/PositionCalculator.js";
// import {locate2} from "../Positioner/PosOne.js";
// import {rmse} from "../Positioner/Rmse.js";

import Notify from "../Notify/Notify.js";

class Floorimage extends React.Component {
  constructor(props) {
    super(props);

    this.coords = {};
    this.notifyCount = 0;
    this.updateBeaconPositionsCount = 0;

    this.available = true;
    this.roomPxWidth = 0;

    // TEST SYSTEM
    // this.XReal = 3;
    // this.YReal = 1;
    // this.timeSec = 20 * 1000; //20s
    // this.logPos = false;
    // this.posArr = [];
    // TEST SYSTEM

    const sta = localStorage.getItem("stations");
    if (typeof sta === "undefined") {
      // init first
    } else {
      this.state = {
        stations: JSON.parse(sta),
      };
    }
    this.updateBeaconPositions();
    console.log(sta);
  }

  // Set delay of notify
  setDelay = function () {
    setTimeout(
      function () {
        this.available = true;
      }.bind(this),
      60000 // from 30000
    );
  };

  // TEST SYSTEM
  //   setTime = function () {
  //     setTimeout(
  //       function () {
  //         this.logPos = true;
  //       }.bind(this),
  //       this.timeSec // 20s
  //     );
  //   };
  // TEST SYSTEM

  stationPosition = function (p) {
    console.log(p);
    let sta = this.props.stations;
    sta[p.mac] = {
      x: p.x,
      y: p.y,
    };
    this.setState({stations: sta});
    localStorage.setItem("stations", JSON.stringify(sta));
  };

  updateBeaconPositions = function () {
    this.roomPxWidth = (this.props.height / this.props.heightMeters).toFixed(2);

    // Beacons
    this.beaconCoords = {};
    if (this.props.beacons) {
      let b = this.props.beacons;

      for (var key in b) {
        // console.log(Object.keys(b[key]).length);
        // if (Object.keys(b[key]).length == 1) {
        //   console.log(b[key]);
        //   console.log(locate2(b[key]));
        // }

        if (Object.keys(b[key]).length >= 3 && Object.keys(this.props.stations).length >= 3) {
          // CALCULATE POSITION COORDINATES
          // let coords = locate(b[key], this.props.stations, this.props.width / this.props.widthMeters);
          let coords = locate(b[key], this.props.stations, this.props.height / this.props.widthMeters);

          if (coords !== null) {
            this.beaconCoords[key] = coords;
            this.checkPos(coords);
            this.updateBeaconPositionsCount += 1;

            if (this.updateBeaconPositionsCount === 4) {
              this.updateBeaconPositionsCount = 0;
              console.log(coords);

              // TEST SYSTEM
              //   let posMeter = {
              //     x: Number((coords.x / this.roomPxWidth).toFixed(2)),
              //     y: Number((coords.y / this.roomPxWidth).toFixed(2)),
              //   };
              // TEST SYSTEM

              // console.log("PosPX: ");
              // console.log(coords);
              // console.log("PosMeter: ");
              // console.log(posMeter);
              // console.log("--------------------------------------------------------------");

              //   if (this.posArr.length === 0) {
              //     this.setTime();
              //   }
              //   this.posArr.push(posMeter);

              //   if (this.logPos) {
              //     this.logPos = false;
              //     console.log("*************************************************************");
              //     console.log("Pos: (" + this.XReal + ", " + this.YReal + ")");
              //     console.log("Time " + this.timeSec / 1000 + "s");
              //     let posReal = {
              //       x: this.XReal,
              //       y: this.YReal,
              //     };
              //     var rmsee = rmse(this.posArr, posReal);
              //     var error = ((rmsee * 100) / this.props.heightMeters).toFixed(2);
              //     console.log(this.posArr);
              //     console.log("RMSE= " + rmsee);
              //     console.log("Error= " + error + "%");
              //     console.log("*************************************************************");

              //     this.posArr = [];
              //     // this.setTime();
              //   }

              // TEST SYSTEM
            } // end if countPos
          } else {
            console.log("Failed to locate:");
            console.debug(b[key]);
          }
        } // end if Obj
      } // end for
    } // end if prop.beacon
  };

  checkPos = function (posPin) {
    let sta = this.props.stations;
    // console.log(posPin);
    if (posPin.x <= sta.st1.x || posPin.y <= sta.st1.y) {
      this.sentNotifyAndDelay("ผู้สูงอายุออกนอกเขตที่ 1 | " + new Date().toLocaleString());
      //   console.log("ออกนอกเขต1");
    } else if (posPin.x >= sta.st2.x || posPin.y <= sta.st2.y) {
      this.sentNotifyAndDelay("ผู้สูงอายุออกนอกเขตที่ 2 | " + new Date().toLocaleString());
      //   console.log("ออกนอกเขต2");
    } else if (posPin.y >= sta.st3.y) {
      this.sentNotifyAndDelay("ผู้สูงอายุออกนอกเขตที่ 3 | " + new Date().toLocaleString());
      //   console.log("ออกนอกเขต3");
    }
  };

  sentNotifyAndDelay = function (msg) {
    this.notifyCount += 1;

    if (this.notifyCount === 4) {
      this.notifyCount = 0;

      if (this.available) {
        let Noti = new Notify();
        Noti.sentNotify(msg);
        this.available = false;
        this.setDelay();
        console.log("SENT ALREADY!!!");
      }
    }
  };

  render() {
    let stationIcons;
    let beaconIcons;
    // Stations
    let sta = this.props.stations;
    // console.log("Floorplan.js, num stations: " + Object.keys(this.props.stations).length);
    if (Object.keys(this.props.stations).length >= 3) {
      stationIcons = Object.keys(sta).map((key) => (
        <Station
          key={key}
          mac={key}
          x={sta[key].x}
          y={sta[key].y}
          setPositionCallback={this.stationPosition.bind(this)}
        ></Station>
      ));
    }
    // Beacons
    this.updateBeaconPositions();
    if (Object.keys(this.beaconCoords).length > 0) {
      beaconIcons = Object.keys(this.beaconCoords).map((key) => (
        <Pin key={key} mac={key} x={this.beaconCoords[key].x} y={this.beaconCoords[key].y}></Pin>
      ));
      // console.log(this.beaconCoords[Object.keys(this.beaconCoords)]);
    }
    return (
      <svg
        className="floorplan"
        viewBox={"0 0 " + this.props.height + " " + this.props.height}
        width={this.props.height}
        height={this.props.height}
        style={{backgroundImage: "url(" + floor_image_file + ")"}}
      >
        {beaconIcons}
        {stationIcons}
      </svg>
    );
  }
}

export default Floorimage;
