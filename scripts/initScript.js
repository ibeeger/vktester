/*
* @Author: cuixiaohan
* @Date:   2018-11-13 11:20:39
* @Last Modified by:   cuixiaohan
* @Last Modified time: 2018-11-13 17:01:31
*/

const first = `
	const {ipcRenderer} = require("electron");
	window.addEventListener('click', function(e) {
		let list = e.target.getAttributeNames();
		let _result = {}
		for(let i =0; i<list.length; i++) {
			_result[list[i]] = e.target.getAttribute(list[i]);
		}
		_result['tag'] = e.target.tagName.toLocaleLowerCase();
		ipcRenderer.send('domTarget', _result)
	})
	`;


const getUserDevice = `function getUserDevice() {
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true },
      function () {
        window.vk_device = true
      },
      function () {
        window.vk_device = false
      }
    )
  } else {
    window.vk_device = false
  }
};getUserDevice()
`

module.exports = {
	first,
	getUserDevice
}