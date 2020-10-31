export const rmse = (posArr, posReal) => {
  var sum = 0;
  for (let i = 0; i < posArr.length; i++) {
    const el = posArr[i];

    var dx = posReal.x - el.x;
    var dy = posReal.y - el.y;

    var c2 = Math.pow(dx, 2) + Math.pow(dy, 2);
    sum += c2;
    // console.log(c2);
  }

  var mse = sum / posArr.length;
  var rmse = Math.sqrt(mse);
  return rmse;
};
