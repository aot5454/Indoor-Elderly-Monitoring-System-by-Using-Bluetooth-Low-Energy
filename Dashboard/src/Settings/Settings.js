import React, {Component} from "react";
import {Menu, Icon} from "semantic-ui-react";
import "./Settings.css";

class SettingsSidemenu extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    var all = [];
    var known = [];

    var allBeacons = this.props.beacons;

    if (Object.keys(allBeacons).length > 0) {
      all = Object.keys(allBeacons).map((key) => (
        <li key={allBeacons[key].mac}>{allBeacons[key].mac.toUpperCase()}</li>
      ));
    }

    var allDevice = this.props.knownBeacons;
    if (Object.keys(allDevice).length > 0) {
      known = Object.keys(allDevice).map((key) => <li key={key}>{key}</li>);
    }

    return (
      <div>
        {/* All Beacon */}
        <Menu.Item name="unhide">
          <span>
            <h3>
              <Icon name="tablet" />
              Devices
            </h3>
          </span>

          <ul className="known-beacons-list">{known}</ul>
        </Menu.Item>

        {/* All Stations */}
        <Menu.Item name="hide">
          <span>
            <h3>
              <Icon name="list alternate" />
              Stations
            </h3>
          </span>
          <ul className="all-beacons-list">{all}</ul>
        </Menu.Item>
      </div>
      // End div
    );
  }
}

export default SettingsSidemenu;
