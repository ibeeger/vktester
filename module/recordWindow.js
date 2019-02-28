/*
 * @Author: cuixiaohan
 * @Date:   2018-11-14 11:32:25
 * @Last Modified by:   cuixiaohan
 * @Last Modified time: 2018-11-14 11:57:34
 */
const {ipcRenderer,app,desktopCapturer} = require("electron");
const fs = require('fs')
var recorder, chunks = [];
desktopCapturer.getSources({
	types: ['window', 'screen']
}, (error, sources) => {
	if (error) throw error
	for (let i = 0; i < sources.length; ++i) {
		if (sources[i].name === 'IDE') {
			navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop', //'desktop',
							chromeMediaSourceId: sources[i].id,
							minWidth: 1280,
							maxWidth: 1280,
							minHeight: 720,
							maxHeight: 720
						}
					}
				})
				.then((stream) => handleStream(stream))
				.catch((e) => handleError(e))
			return
		}
	}
})

function handleStream(stream) {
	navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(mediaStream){
      var audioTracks = mediaStream.getAudioTracks();
      console.log(audioTracks)
      var mixAudioTrack = mixTracks(audioTracks);
      stream.addTrack(mixAudioTrack);
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = function(event) {
        chunks.push(event.data);
      };
      recorder.start(10);
    }).catch(function(err) {
      console.log("handle stream error", err);
    })
}

var stopbtn = document.querySelector('#stop')
	stopbtn.addEventListener('click', stopRecording, false)


function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        let arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
    let buffer = new Buffer(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}


function stopRecording() {
	console.log(recorder, 'stop');
    recorder.stop();
    console.log('stop')
    toArrayBuffer(new Blob(chunks, {type: 'video/webm'}), function(ab) {
        var buffer = toBuffer(ab);
        var file = `./test.webm`;
        fs.writeFile(file, buffer, function(err) {
            if (err) {
                console.error('Failed to save video ' + err);
            } else {
                console.log('Saved video: ' + file);
            }
        });
    });
}


function mixTracks(tracks) {
    var ac = new AudioContext();
    var dest = ac.createMediaStreamDestination();
    for(var i=0;i<tracks.length;i++) {
      const source = ac.createMediaStreamSource(new MediaStream([tracks[i]]));
      source.connect(dest);
    }
    return dest.stream.getTracks()[0];
  }

function handleError(e) {
	console.error(e, '1')
}