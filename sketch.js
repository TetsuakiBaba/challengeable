/*
my google script url for free translation 
https://script.google.com/d/14bneey4l1045Kf9tXrfIbD81jwk3Xdh4W44LoYGt65a5oVHb37CcOWN5/edit?splash=yes#

languageApp detail info, you can check all list of language codes.
https://developers.google.com/apps-script/reference/language/language-app
*/
var vtlog = [];
var myRec = new p5.SpeechRec('', parseResult); // new P5.SpeechRec object
var se;
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

class VoiceTextLog {
    constructor() {
        this.sound = new p5.SoundFile();
        this.text = "";
        this.timestamp_start_recording = millis();
        this.date_and_timestamp = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    }
    setText(_text) {
        this.text = _text;
    }
    getText() {

    }
    createP(_text) {
        this.text = _text;
        this.element = createDiv(_text);

        this.element_button_play = createSpan('<i class="bi bi-play-circle"></i> ');
        this.element_button_play.parent(this.element);
        this.element_button_play.class("pointer");
        this.element_button_play.mouseClicked(this.play.bind(this));
        this.element_button_download = createSpan(' <i class="bi bi-download"></i> ');
        this.element_button_download.parent(this.element);
        this.element_button_download.class("pointer");
        this.element_button_download.mouseClicked(this.download.bind(this));


        //this.element.mouseClicked(this.play.bind(this));
        //this.element.mouseOver(this.showButtons.bind(this));

        this.element.class("vtlog");
        //this.element_button.class("vtlog");
        this.element.parent('text-holder');
        //this.element_button_play.hide();
        //this.element_button_download.hide();
        //this.element.mouseOver(this.showButtons.bind(this));
        //this.element.mouseOut(this.hideButtons.bind(this));
    }
    removeP() {
        this.element_button_play.remove();
        this.element_button_download.remove();
        this.element.remove();
        this.element_button_play = void 0;
        this.element_button_download = void 0;
        this.element = void 0;
    }
    setFirstParsingTime() {
        this.timestamp_start_parsing_time = millis();
    }
    play() {
        let jumptime = (this.timestamp_start_parsing_time - this.timestamp_start_recording) / 1000;
        pauseRecognition();

        se.play();
        var self = this.sound;
        se.onended(function () {
            self.play();
            if (jumptime >= 1.0) {
                self.jump(jumptime - 1.0)
            } else {
                //this.sound.jump(jumptime);
            }
        });
        //this.sound.play();



        // console.log(
        //     "jumptime:" + str(jumptime),
        //     "timestamp_start_parsing_time:" + str(this.timestamp_start_parsing_time / 1000),
        //     "timestamp_start_recording:" + str(this.timestamp_start_recording / 1000));
        // console.log("duration:", this.sound.duration());

    }
    download() {
        this.sound.save(this.text + ".wav");
    }
    showButtons() {
        this.element_button_play.show();
        this.element_button_download.show();
    }
    hideButtons() {
        this.element_button_play.hide();
        this.element_button_download.hide();
    }
}



//var socket;

var mic, recorder;
var state = 0;
var flg_rec_started = false;


function setup() {
    se = loadSound('sounds/VSQSE_0017_kirarin_17.mp3');
    se.setVolume(0.1);
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('chrome') != -1) { } else {
        window.confirm("ブラウザをChromeで開き直してください。このページはChromeのみで動作します。This page works only on Chrome browser.");
    }
    // graphics stuff:
    noCanvas();
    //var canvas = createCanvas(400, 400);
    //canvas.parent("sketch-holder");

    //socket = io.connect(window.location.origin);

    myRec.onEnd = endSpeech;
    myRec.onStart = startSpeech;
    myRec.continuous = false; // no continuous recognition
    myRec.interimResults = true; // allow partial recognition (faster, less accurate)

    //myRec.onResult = parseResult; // now in the constructor

    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    // create an audio in
    mic = new p5.AudioIn();
    attachAudioDevicesToSelect("#audio_devices");

    mic.start();
    // create a sound recorder
    recorder = new p5.SoundRecorder();
    // connect the mic to the recorder
    recorder.setInput(mic);

    select("#toggle_start_pause").mouseClicked(toggleStartPause);
    select('#select_language').changed(changedLanguage);
}

function changedLanguage() {
    console.log(this.value());
    myRec.rec.abort();
    myRec.rec.lang = this.value();
}

function pauseRecognition() {
    document.getElementById("toggle_start_pause").innerHTML = `<i class="bi bi-play-circle"></i> Start`;
    document.getElementById("toggle_start_pause").className = "btn btn-primary";
    document.getElementById("text").placeholder = "Press Start button then speak something.";
    flg_rec_started = false;
    myRec.stop();
}

function startRecognition() {
    for (let i = 0; i < vtlog.length; i++) {
        vtlog[i].sound.stop();
    }
    document.getElementById("toggle_start_pause").innerHTML = `<i class="bi bi-pause-circle"></i> Pause`;
    document.getElementById("toggle_start_pause").className = "btn btn-danger";
    document.getElementById("text").placeholder = "Speak something, or Press Pause button to stop recognition.";
    flg_rec_started = true;


    myRec.start(); // start engine


}

function toggleStartPause() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    if (flg_rec_started == false) { // start recognition
        startRecognition();
    } else if (flg_rec_started == true) { //pause recognition
        pauseRecognition();
    }
}



function finalizeRecording() {
    //console.log("successed recording");
}
var flg_first_parseResult = true;

function parseResult() {
    if (flg_first_parseResult == true) {

        if (vtlog.length > 0) {
            vtlog[vtlog.length - 1].setFirstParsingTime();
        }
        flg_first_parseResult = false;
    }
    document.getElementById("label").innerHTML = "speaking...";
    document.getElementById("text").value = myRec.resultString;
}



function startSpeech() {
    //console.log("start");
    if (flg_rec_started == false) {
        return;
    }
    userStartAudio();
    vtlog.push(new VoiceTextLog());
    recorder.record(vtlog[vtlog.length - 1].sound, 15, finalizeRecording);

}

function endSpeech() {
    //console.log("End");
    myRec.stop();
    flg_first_parseResult = true;
    // 結果がなかった場合
    if (!myRec.resultValue) {
        //userStartAudio();
        recorder.stop();
        vtlog.pop();
        console.log("vtlog poped");
        if (flg_rec_started) myRec.start();
        return;
    }
    // 音声入力結果があった場合
    let str_result = document.getElementById("text").value;
    if (str_result.length > 0) {
        //console.log("End");
        document.getElementById("label").innerHTML = "quiet";


        recorder.stop();

        if (!vtlog[vtlog.length - 1].sound) {
            //console.log("Error");
        }
        let = count = 0;
        //while (!vtlog[vtlog.length - 1].sound.isLoaded()) {}

        //console.log("isLoaded():", vtlog[vtlog.length - 1].sound.isLoaded());
        if (vtlog.length > 0) {
            vtlog[vtlog.length - 1].createP(myRec.resultString);
            vtlog[vtlog.length - 1].setText(myRec.resultString);
            while (vtlog.length > document.getElementById("history_size").value) {
                vtlog[0].removeP();
                vtlog[0].sound = void 0;
                vtlog[0] = void 0;
                vtlog.shift();
                console.log("vtlog shifted");
            }
        }

        //recorder = void 0;
        //recorder = new p5.SoundRecorder();
        //recorder.setInput(mic);
        userStartAudio();
        /*
        var data = {
            text: encodeURI(myRec.resultString),
            source: 'ja',
            target: 'en'
        }
        socket.emit('translate', data);
        */
        document.getElementById("text").value = "";
        myRec.resultString = '';

        var element = document.documentElement;
        var bottom = element.scrollHeight - element.clientHeight;
        //console.log(bottom, element.scrollHeight);
        window.scroll({
            left: 0,
            top: element.scrollHeight,
            behavior: "smooth"
        });
    } else {
        //console.log("using");
        userStartAudio();
        recorder.stop();
        vtlog.pop();

    }
    if (flg_rec_started) myRec.start();

}