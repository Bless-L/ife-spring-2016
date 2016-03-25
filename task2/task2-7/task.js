var numData = new Array(50);

function randomData() {
	for (var i = 0; i < numData.length; i++) {
		var num = 10 + Math.random() * 90;
		numData[i] = num;
	}
}


function getData() {
	var inputData = document.getElementById('aqi-data').value;
	if (inputData < 10 || inputData > 100 || /[^0-9]/.test(inputData)) {
		alert('请输入10-100的整数');
	} else {
		return inputData;
	}
}

function leftIn() {
	var tempDate = getData();
	if (tempDate) {
		numData.unshift(tempDate);
		renderChart();
	}
}

function leftOut() {
	var tempDate = numData.shift();
	renderChart();
	alert("弹出" + tempDate);
}

function rightIn() {
	var tempDate = getData();
	if (tempDate) {
		numData.push(tempDate);
		renderChart();
	}
}

function rightOut() {
	var tempDate = numData.pop();
	renderChart();
	alert("弹出" + tempDate);
}

function initBotton() {
	var lIn = document.getElementById('aqi-leftIn');
	var rIn = document.getElementById('aqi-rightIn');
	var lOut = document.getElementById('aqi-leftOut');
	var rOut = document.getElementById('aqi-rightOut');
	var rdom = document.getElementById('aqi-random');
	var arrange = document.getElementById('aqi-arrange');


	lIn.addEventListener('click', leftIn);
	rIn.addEventListener('click', rightIn);
	lOut.addEventListener('click', leftOut);
	rOut.addEventListener('click', rightOut);
	rdom.addEventListener('click', init);
	arrange.addEventListener('click', function() {
		fastArrange(numData, 0, numData.length - 1);
	})
}

function renderChart() {
	var chart_wrap = document.getElementById('aqi-chart-wrap');

	var html = '';
	var model = "<div style='height:{height}'></div>"

	for (var i = 0; i < numData.length; i++) {
		var height = numData[i] * 3 + 'px';
		html += model.replace('{height}', height);
	}

	chart_wrap.innerHTML = html;
}

function fastArrange(data, left, right) {
	if (left >= right) {
		return true;
	}

	var key = data[left];
	var i = left;
	var j = right;

	while (i < j) {

		while (i < j && key <= data[j]) {
			j--;
		}

		data[i] = data[j];

		while (i < j && key >= data[i]) {
			i++
		}

		data[j] = data[i];
	}

	data[i] = key;

	setTimeout(function() {
		renderChart();
		fastArrange(data, left, i - 1);
	}, 800);
	setTimeout(function() {
		renderChart();
		fastArrange(data, i + 1, right);
	}, 1600);


	return data;
}



function init() {
	randomData();
	renderChart();
}

window.onload = function() {
	initBotton();
	init();
}


