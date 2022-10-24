 function colorRgb (sColor) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
    } else {
        return sColor;
    }
};
// 将rgb表示方式转换为hex表示方式
 function colorHex  (rgb) {
    var _this = rgb;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
        var aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            hex = Number(aColor[i]) < 16 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        //console.log(strHex);
        if (strHex.length !== 7) {
            strHex = _this;
        }
        strHex = strHex.toUpperCase();
        return strHex;
    } else if (reg.test(_this)) {
    	//console.log(_this);
        var aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return _this;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return _this;
    }
}
function gradientColor(startColor, endColor, step) {
var    startRGB = colorRgb(startColor);//转换为rgb数组模式
  var  startR = startRGB[0];
  var  startG = startRGB[1];
 var   startB = startRGB[2];

  var  endRGB = colorRgb(endColor);
 var   endR = endRGB[0];
 var   endG = endRGB[1];
  var  endB = endRGB[2];

   var sR = (endR - startR) / step;//总差值
  var  sG = (endG - startG) / step;
 var   sB = (endB - startB) / step;

    var colorArr = [];
    for (var i = 0; i < step; i++) {
        //计算每一步的hex值 
        var hex = colorHex('rgb('+ parseInt((sR * i + startR))+ ',' + parseInt((sG * i + startG))+ ',' + parseInt((sB * i + startB)) + ')');
        colorArr.push(hex);
        //console.log(hex);
    }
    return colorArr;
}


export {gradientColor}