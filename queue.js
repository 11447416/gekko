/**
 * 一个队列，来管理最新的k线
 * Created by myjie on 2017-10-22.
 */
var queue = {}
var arr = [];
var count;
queue.setMaxLen = function (maxLen) {
  count = maxLen;
}
//入队操作
queue.push = function (element) {
  arr.push(element);
  if (arr.length > count) {
    //如果达到最大长度，就把之前的出队
    arr.shift();
  }
  return true;
}
//出队操作
queue.pop = function () {
  return arr.shift();
}
//获取队首
queue.getFront = function () {
  return arr[0];
}
//获取队尾
queue.getTail = function () {
  return arr[arr.length - 1]
}
//清空队列
queue.clear = function () {
  arr = [];
}
//获取队长
queue.size = function () {
  return arr.length;
}
queue.getAll = function () {
  return arr;
}

module.exports = queue;
