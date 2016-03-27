/*-------------DOM元素获取与事件绑定---------------------*/
function $(element) {
	return document.getElementById(element);
}

function addEvent(element, event, listener) {
	if (element.addEventListener) { //标准
		element.addEventListener(event, listener, false);
	} else if (element.attachEvent) { //低版本ie
		element.attachEvent("on" + event, listener);
	} else { //都不行的情况
		element["on" + event] = listener;
	}
}

//去除两边空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}


/*-------------DOM元素获取与事件绑定---------------------*/


//存放树的数据，便于遍历
var arrDiv = new Array();

//动画进行时标志
var animateFlag = true;


//深度优先
function DFSTraverse(T) {

	//模拟栈，用于深度优先
	var stack = [];
	stack.push(T);
	while (stack.length > 0) {
		var temp = stack.pop();

		//按深度优先遍历顺序存放进全局数组内，用于动画展示
		arrDiv.push(temp);
		for (var i = temp.children.length - 1; i >= 0; i--) {
			if (temp.children[i]) stack.push(temp.children[i]);
		}
	}

}

//广度优先
function BFSTraverse(T) {

	//模拟队列，用于广度优先
	var stack = [];
	stack.push(T);
	while (stack.length > 0) {
		var temp = stack.shift();

		//按广度优先遍历顺序存放进全局数组内，用于动画展示
		arrDiv.push(temp);

		for (var i = 0; i < temp.children.length; i++) {
			if (temp.children[i]) stack.push(temp.children[i]);
		}
	}
}

//获取数据
function getData() {
	var aqiData = $('aqi-data');
	return trim(aqiData.value);
}


//查找动画演示
function searchAnimate(data) {

	//若为空，退出
	if (!data) {
		alert('请输入你要查找的英文');
		return;
	}

	animateFlag = false;
	var index = 0;

	a = setInterval(function() {
		if (index >= arrDiv.length) {

			clearInterval(a);
			arrDiv[index - 1].style.backgroundColor = '#fff';

			alert('没有找到该英文')

			//动画结束，重置全局数组，动画进行标志
			arrDiv = [];
			animateFlag = true;
		} else {

			if (index) arrDiv[index - 1].style.backgroundColor = '#fff';
			arrDiv[index].style.backgroundColor = '#00f';

			//若查找到了，则将色块变色，退出动画
			if (trim(arrDiv[index].firstChild.nodeValue) == data) {
				arrDiv[index].style.backgroundColor = '#f00';

				alert('已找到');

				//重置
				arrDiv[index].style.backgroundColor = '#fff';
				arrDiv = [];
				animateFlag = true;
				clearInterval(a);
			}

			index++;
		}
	}, 500)
}

//初始化
function init() {
	var T = $('tree-root');

	addEvent($('DFS'), 'click', function() {
		if (animateFlag) {
			DFSTraverse(T);
			searchAnimate(getData());
		}
	})

	addEvent($('BFS'), 'click', function() {
		if (animateFlag) {
			BFSTraverse(T);
			searchAnimate(getData());
		}
	})
}


window.onload = function() {
	init();
}