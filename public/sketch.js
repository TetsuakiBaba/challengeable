/*
my google script url for free translation 
https://script.google.com/d/14bneey4l1045Kf9tXrfIbD81jwk3Xdh4W44LoYGt65a5oVHb37CcOWN5/edit?splash=yes#

languageApp detail info, you can check all list of language codes.
https://developers.google.com/apps-script/reference/language/language-app
*/

class VoiceTextLog {
    constructor() {
        this.sound = new p5.SoundFile();
        this.text = "";
        this.timestamp_start_recording = millis();
    }
    setText(_text) {
        this.text = _text;
    }
    getText() {

    }
    createP(_text) {
        this.element = createDiv(_text);
        this.element.mouseClicked(this.play.bind(this));
        this.element.parent('text-holder');
        this.element.class('vtlog');
    }
    removeP() {
        this.element.remove();
    }
    setFirstParsingTime() {
        this.timestamp_start_parsing_time = millis();
    }
    play() {
        let jumptime = (this.timestamp_start_parsing_time - this.timestamp_start_recording) / 1000;
        pauseRecognition();
        this.sound.play();
        console.log(jumptime, this.timestamp_start_parsing_time / 1000, this.timestamp_start_recording / 1000);
        console.log("duration:", this.sound.duration());
        if (jumptime >= 1.0) {
            this.sound.jump(jumptime - 1.0)
        }
        else {
            //this.sound.jump(jumptime);
        }
    }
}

var vtlog = [];
var myRec = new p5.SpeechRec('', parseResult); // new P5.SpeechRec object

var socket;

var mic, recorder, soundFile;
var state = 0;
var flg_rec_started = false;

function preload() {

    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}
function setup() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('chrome') != -1) {

    }
    else {
        window.confirm("ブラウザをChromeで開き直してください。このページはChromeのみで動作します。This page works only on Chrome browser.");
    }
    // graphics stuff:
    noCanvas();
    //var canvas = createCanvas(400, 400);
    //canvas.parent("sketch-holder");
    socket = io.connect(window.location.origin);


    // create an audio in
    mic = new p5.AudioIn();
    mic.start();
    // create a sound recorder
    recorder = new p5.SoundRecorder();
    // connect the mic to the recorder
    recorder.setInput(mic);
    // create an empty sound file that we will use to playback the recording
    soundFile = new p5.SoundFile();


    myRec.onEnd = endSpeech;
    myRec.onStart = startSpeech;
    myRec.continuous = false; // no continuous recognition
    myRec.interimResults = true; // allow partial recognition (faster, less accurate)
    //myRec.onResult = parseResult; // now in the constructor


    select("#toggle_start_pause").mouseClicked(toggleStartPause);

}

function pauseRecognition() {
    document.getElementById("toggle_start_pause").innerHTML = "<i class=\"far fa-comment-alt\"></i> Start";
    document.getElementById("toggle_start_pause").className = "btn btn-primary";
    document.getElementById("text").placeholder = "Press Start button then speak something.";
    flg_rec_started = false;
    myRec.stop();
}

function startRecognition() {
    document.getElementById("toggle_start_pause").innerHTML = "<i class=\"far fa-pause-circle\"></i> Pause";
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
    }
    else if (flg_rec_started == true) { //pause recognition
        pauseRecognition();
    }
}



var is_recording = false;
var is_first_playing = false;
var is_playing = 0;
var flg_rec_cancel = false;
function draw() {
    background(150);
    circle(width / 2, height / 2, mic.getLevel() * 1000);
    text(mic.getLevel(), 10, 10)
    text(is_recording, 10, 20);
    text(vtlog.length, 10, 30);
    select("#volume").style("width", str(1000 * mic.getLevel()) + "%");

    is_playing = 0;
    for (let i = 0; i < vtlog.length; i++) {
        if (vtlog[i].sound.isPlaying()) {
            is_playing++;
        }
    }
    text("is_playing:" + str(is_playing), 10, 40);

    if (is_recording == false && mic.getLevel() > 0.01 && is_playing == 0) {
        vtlog.push(new VoiceTextLog());
        userStartAudio();
        recorder.record(vtlog[vtlog.length - 1].sound);
        is_recording = true;
        //myRec.start();
    }
}

var flg_first_parseResult = true;
function parseResult() {
    if (is_playing > 0) {
        return;
    }
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
    console.log("start");
    if (is_playing == true) {
        flg_rec_cancel = true;
    }
}
function endSpeech() {
    console.log("End");
    flg_first_parseResult = true;
    // 結果がなかった場合
    if (!myRec.resultValue) {
        if (is_recording) {
            is_recording = false;
            //userStartAudio();
            recorder.stop();
            vtlog.pop();
        }
        if (flg_rec_started == true) {
            myRec.start(); // start engine
        }
        return;
    }
    // 音声入力結果があった場合
    let str_result = document.getElementById("text").value;
    if (str_result.length > 0 && is_playing == 0) {
        console.log("End");
        document.getElementById("label").innerHTML = "quiet";
        //userStartAudio();
        recorder.stop();
        let = count = 0;
        //while (!vtlog[vtlog.length - 1].sound.isLoaded()) {}

        console.log("isLoaded():", vtlog[vtlog.length - 1].sound.isLoaded());
        if (vtlog.length > 0) {
            vtlog[vtlog.length - 1].createP(myRec.resultString);
            vtlog[vtlog.length - 1].setText(myRec.resultString);
            while (vtlog.length > 10) {
                vtlog[0].removeP();
                vtlog.shift();
            }
        }
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
    }
    else {
        if (is_recording) {
            is_recording = false;
            userStartAudio();
            recorder.stop();
            vtlog.pop();
        }
    }
    if (flg_rec_started == true) {
        myRec.start(); // start engine
    }
    is_recording = false;
}

