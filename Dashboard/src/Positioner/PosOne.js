export const locate2 = (rssi) => {
  // ITAG -70 ... -94
  // Samsung -73 ... -95

  // RSSI = TxPower - 10 * n * lg(d)
  // n = 2...4
  // d = 10^(TxPower - RSSI) / (10 * n))

  function calculateDistance(rssi) {
    let P = -69; // @TODO This value should come from MQTT message from -69
    let n = 3;
    let d = Math.pow(10, (P - rssi) / (10 * n)); //(n ranges from 2 to 4)
    return d;
  }

  return {rssi: rssi, distance: calculateDistance(rssi).toFixed(3)};
};
