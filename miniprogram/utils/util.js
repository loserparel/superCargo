const formatTime = date => {

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return  [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-');
}

function getDaysAgo(days) {
  var date = new Date()
  if(!days || days == ''){
    return formatDate(date)
  }
  date.setDate(date.getDate() - days)
  return formatDate(date)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getDaysBetween = (date1,date2) =>{
  var startDate = Date.parse(date1);
  var endDate = Date.parse(date2);
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  console.log(days);
  return days;
}



const charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const numCharts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const random = function generateMixed(n,hasAlp) {
  var res = '';
  if (hasAlp){
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += charts[id];
    }
  }else{
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 9);
      res += numCharts[id];
    }
  }
  return res;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  random: random,
  getDaysBetween: getDaysBetween,
  getDaysAgo:getDaysAgo,
  getQueryObject: function (t) {
    for (var e = t.split("?")[1].split("&"), n = new Object(), r = 0; r < e.length; r++) {
      var i = e[r].split("=")[0], o = e[r].split("=")[1];
      n[i] = o;
    }
    return n;
  },
  getCurrentPage: function () {
    var t = getCurrentPages();
    return t[t.length - 1];
  },
  versionCompare: function (t, e) {
    var n = parseFloat(t), r = parseFloat(e), i = t.replace(n + ".", "") || "", o = e.replace(r + ".", "") || "", u = parseFloat(i), a = parseFloat(o);
    return n > r ? 1 : n < r ? -1 : u > a ? 1 : u === a ? 0 : -1;
  },
  SafeSetStorageSync: function (t, e) {
    try {
      wx.setStorageSync(t, e);
    } catch (n) {
      try {
        wx.setStorageSync(t, e);
      } catch (n) {
        wx.setStorage({
          key: t,
          data: e
        });
      }
    }
  },
  removeStorageKeys: function (t) {
    t.forEach(function (t) {
      wx.removeStorage({
        key: t
      });
    });
  },
}