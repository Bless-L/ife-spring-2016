function addEvent(element, event, listener) {
  if (element.addEventListener) { //标准
    element.addEventListener(event, listener, false);
  } else if (element.attachEvent) { //低版本ie
    element.attachEvent("on" + event, listener);
  } else { //都不行的情况
    element["on" + event] = listener;
  }
}


/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {

};



//获取随机颜色
function randomColor() {
  return "#" + Math.random().toString(16).substring(2, 8);
}


// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}


/**
 * 渲染图表
 */
function renderChart() {

  var chart_wrap = document.getElementById('chart-wrap');

  var graCity = pageState['nowSelectCity'];
  var graTime = pageState['nowGraTime'];

  var graData = chartData[graTime][graCity];

  var html = '';
  var style = "style='width:{width}; height:{height}; background-color:{color}'   ";
  var div_title = "title = '{time} 的空气质量数值为 : {data}' ";
  var model = "<div   " + style + div_title + "></div>";

  for (e in graData) {
    html += model.replace('{width}', graData[e]['width']).replace('{height}', graData[e]['height'])
      .replace('{color}', graData[e]['color']).replace('{time}', e)
      .replace('{data}', graData[e]['data'])
  }

  chart_wrap.innerHTML = html;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  // 确定是否选项发生了变化 
  if (e.target.value == pageState['nowGraTime']) {
    return false;
  }
  // 设置对应数据
  pageState['nowGraTime'] = e.target.value;
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {

  // 确定是否选项发生了变化 
  if (e.target.value == pageState['nowSelectCity']) {
    return false;
  }
  // 设置对应数据
  pageState['nowSelectCity'] = e.target.value;
  // 调用图表渲染函数
  renderChart();

}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var time_seclect = document.getElementById('form-gra-time');

  addEvent(time_seclect, "change", graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var city_select = document.getElementById("city-select");
  var html = '';
  var model = '<option>{city}</option>'
  for (e in aqiSourceData) {
    html += model.replace('{city}', e) + '<br>';
  }
  city_select.innerHTML = html;

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEvent(city_select, "change", citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var day = {};

  var week = {};
  var weekDays = 5; //满7为一个自然周
  var weekNum = 1;
  var weekTotal = 0; //一周的总的空气指数 

  var month = {};
  var monthNum = 1;
  var monthTotal = 0; //一个月的总的空气指数 



  for (city in aqiSourceData) {

    //设置城市数据
    day[city] = {};
    week[city] = {};
    month[city] = {};

    for (date in aqiSourceData[city]) {

      var aqiData = aqiSourceData[city][date];

      //设置日的图表数据

      var dayGra = {};

      dayGra['data'] = aqiData;
      dayGra['height'] = aqiData * 0.8 + 'px';
      dayGra['width'] = '8px';
      dayGra['color'] = randomColor();

      day[city][date] = dayGra;

      //设置周的图表数据

      weekTotal += aqiData;

      if (weekDays == 7 || date == '2016-03-31') {

        // 处理头和尾不够一周的情况

        if (date == '2016-01-03') {
          var weekData = (weekTotal / 3).toFixed(2);
        } else if (date == '2016-03-31') {
          var weekData = (weekTotal / 4).toFixed(2);
        } else {
          var weekData = (weekTotal / 7).toFixed(2);
        }

        var key = '第' + weekNum + '周';
        var weekGra = {};

        weekGra['data'] = weekData;
        weekGra['height'] = weekData * 0.8 + 'px';
        weekGra['width'] = '70px';
        weekGra['color'] = randomColor();

        week[city][key] = weekGra;

        weekTotal = 0;
        weekDays = 0;
        weekNum++;
      }

      weekDays++;

      //设置月的图表数据

      monthTotal += aqiData;

      if (date == '2016-01-31' || date == '2016-03-31' || date == '2016-02-29') {

        // 处理2月和1、3月天数不同的情况
        if (date == '2016-02-29') {
          var monthData = (monthTotal / 29).toFixed(2);
        } else {
          var monthData = (monthTotal / 31).toFixed(2);
        };
        var key = monthNum + '月';
        var monthGra = {};

        monthGra['data'] = monthData;
        monthGra['height'] = monthData * 0.8 + 'px';
        monthGra['width'] = '150px';
        monthGra['color'] = randomColor();

        month[city][key] = monthGra;


        monthTotal = 0;
        monthNum++;
      }
    }

    //周数和月数初始化
    weekDays = 5;
    weekNum = 1;
    monthNum = 1;
  }
  chartData.day = day;
  chartData.week = week;
  chartData.month = month;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  
  //默认显示北京的空气指数
  if (pageState['nowSelectCity'] == -1) {
    pageState['nowSelectCity'] = '北京';
    renderChart();
  }
}

init();