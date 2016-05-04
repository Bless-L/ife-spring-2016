Vue.component('demo-date', {
	template: '#calendar-template',
	props: ['a'],
	data: function() {

		var now = new Date();
		var y = now.getFullYear(),
			m = now.getMonth() + 1,
			d = now.getDate(),
			week = now.getDay();

		//返回基本数据
		return {
			weeks: ['日', '一', '二', '三', '四', '五', '六'],
			sDay: d,
			sWeek: week,
			sYear: y,
			sMonth: m,
			monthRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			yearRange: this.intYearRange(y),
			daysData: this.creatDate(y, m),
		}
	},
	computed: {
		weekStyle: function() {
			var res = {
				'red': false
			};
			for (var i = 0; i < this.weeks.length; i++) {
				if(this.weeks[i] == '日' || '六')
					res['red'] = true;
			}
			return res;
		}
	},
	methods: {
		//初始化年的范围
		intYearRange: function(y, num) {
			var yearRange = [],
				num = parseInt(num) || 20;
			for (var i = -num; i < num; i++) {
				yearRange.push(y + i);
			}
			return yearRange;
		},

		//根据年月生成日历数据
		creatDate: function(year, month) {

			//一个月多少周和一周多少天
			var WEEK_NUM = 6,
				DAY_NUM = 7,

				//按日历格式放日历数据为一个对象
				daysData = {},

				showDate = new Date(year, month - 1),
				//日子标志
				daysFlag = 1 - showDate.getDay();

			for (var i = 0; i < WEEK_NUM; i++) {
				daysData[i] = [];

				for (var j = 0; j < DAY_NUM; j++) {
					daysData[i][j] = {};

					showDate = new Date(year, month - 1, daysFlag);
					//相等则直接添加
					if (showDate.getDate() == daysFlag) {
						daysData[i][j].day = daysFlag;
						daysData[i][j].active = true;
					} else {
						//判断5行还是6行，如果5行则退出循环
						if (i == 5 && j == 0 && showDate.getDate() < 8) {
							delete daysData[i];
							break;
						}
						//否则将标志转换为标准日期再添加
						daysData[i][j].day = showDate.getDate();
						daysData[i][j].active = false;

					}

					//更新日期
					daysFlag++;
				}
			}
			return daysData;
		},

		//更新日历数据
		update: function() {
			this.daysData = this.creatDate(this.sYear, this.sMonth);
		},

		chooseDay: function() {
			console.log(00);
		}
	}
});
new Vue({
	el: '#date',
})