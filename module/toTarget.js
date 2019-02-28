/*
 * @Author: cuixiaohan
 * @Date:   2018-11-20 10:23:02
 * @Last Modified by:   cuixiaohan
 * @Last Modified time: 2019-02-28 19:17:50
 */

const project = require('./initProject')
const {
  dialog
} = require('electron').remote;
const {
  ipcRenderer,
  app,
  shell,
  desktopCapturer
} = require("electron");
const fs = require('fs')

var content = document.querySelector('.content')

global.vmcontent = new Vue({
  el: '#content',
  data: {
    isover: false,
    testtype: 1, // 1次数 2时间
    curTestIndex: -1,
    total_num: 1000,
    total_time: 10,
    once_num: 100,
    loaded: false,
    apis: [],
    methods: [{
      text: 'GET',
      value: 'GET'
    }, {
      text: 'POST',
      value: 'POST'
    }]
  },
  methods: {
    download: function(a) {
      let t = new Date();
      let _this = this;
      let time = t.getMonth() * 1 + 1 + "-" + t.getDate();
      fs.readFile(__dirname + '/../templates/report.html', 'utf8', function(err, html) {
        let filename = process.env.HOME + '/Desktop/' + time + '.html';
        html = html.replace('{{times}}', time);
        html = html.replace('{{jscontent}}', `
          new Vue({
            el: '#app',
            data: {
              apis:${JSON.stringify(_this.apis)}
            }
          });
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
            data: '',
            type: 'line',
            smooth: true
          }]
        };
        var apis = ${JSON.stringify(_this.apis)};
          for(let i =0; i<apis.length; i++) {
            option.series[0]['data'] = apis[i]['report']['data']
            echarts.init(document.getElementById('view' + i)).setOption(option);
          }          
          `)
        fs.writeFile(filename, html, 'utf8', function(err) {
          if (!err) {
            const options = {
              type: 'question',
              buttons: ['取消', '确定'],
              defaultId: 2,
              title: '保存成功',
              message: filename
            };
            dialog.showMessageBox(null, options, (response) => {
               if (response) {
                shell.openExternal('file://'+filename)
               }
            });
          }
        })
      })
    },
    begin: function() {
      project.beginTest(this.$data)
    }
  }
})


fs.readFile(__dirname + '/../test/demo.json', 'utf8', function(err, result) {
  result = JSON.parse(result)
  new Vue({
    el: '#app',
    data: {
      historys: result['historys']
    },
    methods: {
      abc: function(a) {
        project.init(a.url)
      }
    }
  })
})