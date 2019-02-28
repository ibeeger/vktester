/*
 * @Author: cuixiaohan
 * @Date:   2019-02-27 19:49:43
 * @Last Modified by:   cuixiaohan
 * @Last Modified time: 2019-02-28 19:36:24
 */

const fs = require('fs');
const client = require('../libs/http_client')

/**
 * 项目配置路径
 */
function init(url) {
	var rst = fs.readFileSync(url, 'utf8');
	rst = JSON.parse(rst)
	global.vmcontent.$data.loaded = true
	global.vmcontent.$data.apis = rst['apis']
}

/**
 * 等待时长执行
 */
function awaitTimeTest(api, once_num, time = 5) {
	return new Promise((resolve, reject) => {
		let isover = false
		let result = []
		var start = 0;
		for (let i = 0; i < once_num; i++) {
			start++
			client.post(api, '', function selfclient(res, tm) {
				start--
				// console.log(start +'-' + api.url)
				result.push({
					code: res,
					tm: tm
				})
				if (start == 0) {
					console.log(api.url, 'over')
					resolve(result)
				}
				if (!isover) {
					start++
					client.post(api, '', selfclient);
				}
			})
		}
		setTimeout(function() {
			isover = true;
		}, time * 1000)
	});
}


/*
 * 总数压测
 */
function totalNumTest(api, total, once_num) {
	return new Promise((resolve, reject) => {
		let result = [];
		let start = 0;
		for (let i = 0; i < once_num; i++) {
			start++
			client.post(api, '', function selfclient(res, tm) {
				if (start < total) {
					client.post(api, '', selfclient);
					start++
				}
				result.push({
					code: res,
					tm: tm
				})
				// console.log(start, api.url);
				if (result.length == total) {
					resolve(result);
				}
			})
		}
	});
}


function dataToView(reportData) {
	global.vmcontent.$data.curTestIndex = 0
}

function changeCurIndex(i, data) {
	global.vmcontent.$data.curTestIndex = i
}

function showOneReport(i, data) {
	let min = 10000000,
		max = 0;
	let str = {}
	let max3 = 0
	let apis = global.vmcontent.$data.apis;
	let _data = data.map(function(item) {
		min = Math.min(item['tm'], min);
		max = Math.max(item['tm'], max);
		if (item['tm'] > 3000 ) {
			max3++
		}
		if (item['code'] != '200') {
			if (!str.hasOwnProperty(item['code'])) {
				str[''+item['code']] = 1;
			} else {
				str[''+item['code']]++;
			}
		}
		return item['tm']
	});
	apis[i]['report'] = {
		total: data.length,
		min: min,
		max: max,
		max3: max3,
		bfb: (max3/_data.length)*100+'%',
		str: JSON.stringify(str),
		data: _data
	}
	global.vmcontent.$data.apis = apis;
	let option = {
		grid: {
			y: '15px',
			x2: '20px',
			y2: '15px'
		},
		xAxis: {
			type: 'category',
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: _data,
			type: 'line',
			smooth: true
		}]
	};
	var myChart = echarts.init(document.getElementById('view' + i));
	myChart.setOption(option);
}

function testOver(report) {
	global.vmcontent.$data.curTestIndex = Object.keys(report).length;
	global.vmcontent.$data.isover = true;
}

/**
 * 开始测试
 */
async function beginTest(data) {
	let total_num = data.total_num; // 总数
	let once_num = data.once_num; //并发数
	let apis = data.apis;
	let total_time = data.total_time;
	let testtype = data.testtype;
	let pms = {}
	for (let i = 0; i < apis.length; i++) {
		changeCurIndex(i);
		if (testtype == 1) {
			pms['r' + i] = await totalNumTest(apis[i], total_num, once_num)
		} else {
			pms['r' + i] = await awaitTimeTest(apis[i], once_num, total_time)
		}
		showOneReport(i, pms['r' + i]);
	}
	testOver(pms)
}

module.exports = {
	init: init,
	beginTest: beginTest
}