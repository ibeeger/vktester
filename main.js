/*
* @Author: cuixiaohan
* @Date:   2018-11-13 10:42:59
* @Last Modified by:   cuixiaohan
* @Last Modified time: 2019-02-28 09:44:50
*/

'use strict';

const {
	app,
	BrowserWindow,
	MenuItem,
	Menu,
	dialog,
	ipcMain,
	shell
} = require('electron');
const url = require('url'), path = require('path')
var win = null;

const {first, getUserDevice}  = require('./scripts/initScript')

app.on('browser-window-created', function(event, win) {
	// win.webContents.on('context-menu', function(e, params) {
	// 	menu.popup(win, params.x, params.y)
	// })
})

ipcMain.on('message', function (event, result) {
	console.log(result)
})


ipcMain.on('domTarget', function(event, result) {
	console.log(result)
})

function createWindow () {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		// maxWidth: 800,
		// maxHeight: 600
	});
	win.webContents.openDevTools();
	// 加载应用的 index.html。
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
	// console.log(win.webContents.__proto__)
}

app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 否则绝大部分应用及其菜单栏会保持激活。
	// if (process.platform !== 'darwin') {
		app.quit()
	// }
})

app.on('activate', () => {
	// 在这文件，你可以续写应用剩下主进程代码。
	// 也可以拆分成几个文件，然后用 require 导入。
	if (win === null) {
		createWindow()
	}
})