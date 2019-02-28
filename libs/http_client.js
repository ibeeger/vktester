/* 
 * @Author: willclass
 * @Date:   2015-10-28 14:41:09
 * @Last Modified by:   cuixiaohan
 * @Last Modified time: 2019-02-28 19:34:13
 */

'use strict';

var http = require("http"),
	https = require('https'),
	cookie = "",
	host = "localhost",
	type = 'application/json',
	method = 'POST',
	port = 80;
const URL = require('url');

console.log(URL)

var client = {
	post: function(config, data, callback = () => {}) {
		var _data = JSON.stringify(data),
			_datalth = Buffer.byteLength(_data, 'utf8');
		var _url = new URL.parse(config.url)
		var _options = {
			hostname: _url.host,
			path: _url.pathname,
			method: config.method,
			search: _url.search,
			headers: {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7,zh-TW;q=0.6,fr;q=0.5,es;q=0.4,und;q=0.3",
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
				"Pragma": "no-cache",
				"Upgrade-Insecure-Requests": "1",
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
			}
		};

		let start = Date.now();

		function cb(res) {
			if (res.statusCode != 200) {
				callback(res.statusCode, Date.now() - start)
				return
			}
			var str = "";
			res.setEncoding('utf8');
			res.on("data", function(body) {
				str += body;
			});
			res.on("end", function() {
				callback(res.statusCode, Date.now() - start)
			});
			res.on("error", function() {
				callback(res.statusCode, Date.now() - start)
			})

		}
		var _req = http.request(_options, cb);
		if (config.protocol == 'https') {
			https.request(_options, cb);
		}
		_req.on('error', function() {
			callback('error', Date.now() - start)
		})
		_req.write(_data);
		_req.end();
	},
	setHost: function(value) {
		host = value;
	},
	setMethod: function(value) {
		method = value;
	},
	setPort: function(value) {
		port = value;
	},
	setCookie: function(name, value) {
		cookie = name + "=" + value;
	},
	setType: function(value) {
		type = value;
	}
}


module.exports = client;