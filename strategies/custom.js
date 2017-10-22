// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).

var log = require('../core/log');
var config = require('../core/util').getConfig();
var queue = require('../queue');

var timeRange = 5;
var has = false;
var cb;
var strat = {};
strat.init = function () {
  queue.setMaxLen(timeRange)
}

strat.update = function (candle) {
  queue.push(candle);
}

strat.log = function () {

}


strat.check = function () {
  if (queue.size() >= timeRange) {
    //买入信号

    if (has && queue.getFront().high - cb.high > 40) {
      //止盈
      this.advice('short');
      has = false;
      return
    }
    if (has && queue.getFront().high - cb.high < -200) {
      //止损
      this.advice('short');
      has = false;
      return
    }

    //下跌趋势结束
    var range = strat.getRange(queue.getAll());
    if (!has&&range.max.high - range.min.high > 40 && !range.grow){
        this.advice('long');
        cb = queue.getFront();
        has = true;
        return;
    }

    // if (!strat.isDown() && !has) {
    //   this.advice('long');
    //   cb = queue.getFront();
    //   has = true;
    //   return;
    // }
      }

}
strat.sta = function () {
  var a = queue.getAll();
  for (var candle in a) {

  }
}
//判断价格区间
strat.getRange = function (arr) {
  var max, min;
  for (var c in arr) {
    var candle = arr[c];
    if (!max) {
      max = candle;
      min = candle;
    } else if (candle.vwp > max.vwp) {
      max = candle;
    } else if (candle.vwp < min.vwp) {
      min = candle;
    }
  }
  return {max: max, min: min, grow: max.start > min.start};
}
strat.isUp = function () {
  var arr = queue.getAll()
  var len = queue.size();
  var pre;
  var down = false;
  //从最新的开始判断
  for (var index = 0; index < len; index++) {
    let kline = arr[index];
    if (!pre) {
      pre = kline;
      down = false;
      continue;
    }
    if (( kline.open - kline.close) < -15) {
      //短时间内大跌
      pre = kline;
      down = false;
      return false;
    }
    // else if (kline.high < pre.low) {
    //   pre = kline;
    //   down = false;
    //   return false;
    // }
    //联系2个阴线，也算涨势停止
    else if (kline.close < kline.open) {
      if (down) {
        return false;
      }
      down = true;
      pre = kline;
    }
  }
  return true;
}

strat.isDown = function () {
  var arr = queue.getAll()
  var len = queue.size();
  var last, pre;
  var up = false;
  for (var index = 0; index < len; index++) {
    let kline = arr[index];
    if (!last) {
      last = kline;
      pre = kline;
      up = false;
      continue;
    }
    // if (kline.close - kline.open > 15) {
    //   //短时间价格回升
    //   log.debug("短时间价格回升");
    //   pre = kline;
    //   up = false;
    //   return false;
    // }
    else if (kline.low > pre.high) {
      //持续下跌
      log.debug("持续下跌");
      pre = kline;
      up = false;
      return false;
    }
    // // 连续2个阳线，也算涨势停止
    // else if (kline.close > kline.open) {
    //   if (up) {
    //     log.debug("连续2个阳线");
    //     return false;
    //   }
    //   up = true;
    //   pre = kline;
    // }
  }
  return true;
}


module.exports = strat;
