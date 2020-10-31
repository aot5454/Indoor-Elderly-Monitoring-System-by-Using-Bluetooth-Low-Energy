import React, {Component} from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import MessageStack from "./MessageStack/MessageStack.js";
import KnownBeaconsList from "./Settings/Settings.js";
import {merge} from "lodash";
import {Sidebar, Container, Menu, Icon} from "semantic-ui-react";
import Floorplan from "./Floorplan/Floorplan.js";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beacons: {},
      sortedBeacons: {},
      knownBeacons: [],
      stations: {},
      visible: false,
      width: 0,
      height: 0,
      widthMeters: 5.0,
      heightMeters: 5.0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  receiver = function (beaconList) {
    this.setState({beacons: beaconList});
    this.updateStationMacList();
    let beacons = this.beaconMacList();
    this.setState({sortedBeacons: beacons});
  };

  toggleVisibility = () => this.setState({visible: !this.state.visible});

  beaconMacList = () => {
    let objectList = {};
    let list = [];
    let b = this.state.beacons;
    if (typeof b === "undefined" || Object.keys(b).length === 0) {
      return [];
    }

    for (let beacon in b) {
      for (let mac in b[beacon]) {
        if (typeof objectList[mac] !== "undefined") {
          if (objectList[mac].rssi < b[beacon][mac].rssi) {
            objectList = merge(objectList, b[beacon]);
          }
        } else {
          objectList = merge(objectList, b[beacon]);
        }
      }
    }

    for (let beacon in objectList) {
      list.push({mac: beacon, rssi: objectList[beacon].rssi, timestamp: objectList[beacon].timestamp});
    }
    // console.log(objectList);
    return list
      .sort(function (a, b) {
        return a.rssi - b.rssi;
      })
      .reverse();
  };

  updateStationMacList = () => {
    let b = this.state.beacons;
    if (typeof b === "undefined" || Object.keys(b).length === 0) {
      return [];
    }

    let thisStations = this.state.stations;
    for (let beacon in b) {
      for (let station in b[beacon]) {
        if (typeof thisStations[station] === "undefined") {
          if (station == "st1") {
            thisStations[station] = {
              x: Math.floor(1),
              y: Math.floor(15),
            };
          }

          if (station == "st2") {
            thisStations[station] = {
              x: Math.floor(this.state.height - 90),
              y: Math.floor(15),
            };
          }

          if (station == "st3") {
            thisStations[station] = {
              x: Math.floor(this.state.height / 2 - 50),
              y: Math.floor(this.state.height - 70),
            };
          }
          this.setState({stations: thisStations});
        }
      }
    }
  };

  updateWindowDimensions() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  componentWillMount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    // this.setState({height: window.innerHeight, width: window.innerWidth});
  }

  componentDidMount() {
    // Start MQTT subscription
    new MessageStack(this.receiver.bind(this));
    this.updateStationMacList();

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  render() {
    const {visible} = this.state;
    return (
      <div className="App">
        <Sidebar.Pushable
          as={Container}
          style={{width: this.state.width + "px", height: this.state.height + "px"}}
          fluid
        >
          <Sidebar as={Menu} animation="slide out" visible={visible} icon="labeled" vertical inverted width="wide">
            <Menu.Item name="beacons">
              <KnownBeaconsList beacons={this.state.sortedBeacons} knownBeacons={this.state.beacons} />
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Container style={{width: this.state.width + "px", height: this.state.height + "px"}} fluid>
              <Floorplan
                beacons={this.state.beacons}
                stations={this.state.stations}
                height={this.state.height}
                width={this.state.width}
                widthMeters={this.state.widthMeters}
                heightMeters={this.state.heightMeters}
              />
              <Icon
                style={{position: "absolute"}}
                onClick={this.toggleVisibility}
                className={"menubutton"}
                name="sidebar"
                size="large"
              />
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;
