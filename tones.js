var tone = require("tonegenerator");
var header = require("waveheader"); // https://www.npmjs.org/package/waveheader
var fs = require("fs");
//change

var fileName = process.argv[2];




var soundTime = 0.2;
var f1 = 220,
    f2 = 1.5 * f1;


//var w = new wave().slide(f1,f2,soundTime);
//var w2 = new wave().slide(f1*0.9,f2*0.9,soundTime);
//var w3 = new wave().slide(f1*1.1,f2*1.1,soundTime);
//var w4 = new wave().slide(f2*1.1,f1*1.1,soundTime);
var w = new wave();
var w2 = new wave();
var w3 = new wave();
var w4 = new wave();
var w5 = new wave();

for (var i=0; i<10; i++){

    w.slide(f2*0.9,f1*0.9,soundTime).slide(f1*0.9,f2*0.9,soundTime);
    w2.slide(f2*1.1,f1*1.1,soundTime).slide(f1*1.1,f2*1.1,soundTime);
    w5.slide(f2,f1,soundTime).slide(f1,f2,soundTime);
    w4.slide(f1,f2,soundTime).slide(f2,f1,soundTime);
}


w.combine(w2).combine(w5).combine(w4).save(fileName);
//w.combine(w2).combine(w3).combine(w4).combine(w5).save(fileName);

function wave(fileName) {

    this.data = [];
    this.fileName = fileName;

    //if (fileName) {
    //    this.data = fs.readFileSync(fileName);
    //    console.log(this.data);
    //    process.exit();
    //}

    this.slide = function (start,stop,time){

        const SLIDE_STEP = 0.01; //10ms

        var stepToneDelta = SLIDE_STEP * (stop-start) /time,
            steps = time / SLIDE_STEP;

        for (var i = 0; i<steps; i++){
            this.data = this.data.concat(tone(start+i*stepToneDelta,SLIDE_STEP));
        }

        return this;
    }

    this.save = function(fileName){
        var writer = new fs.createWriteStream(fileName + '.wav');
        writer.write(header( 44100 * 8 )); // 44100 Hz * 8 seconds
        writer.write(new Buffer(this.data));
        writer.end();
    }

    this.tone = function(freq,length){
        this.data = this.data.concat(tone(freq,length));
        return this;
    }

    this.combine = function(w){

        var length = Math.min(this.data.length, w.data.length);
        var tone = [];

        for (var i=0; i<length;i++){
            tone.push(this.data[i] + w.data[i]);
        }

        this.data = tone;
        return this;
    }



    return this;
}





//function combineTones(tone1,tone2){
//
//    var length = Math.min(tone1.length,tone2.length);
//    var tone = [];
//
//    for (var i=0; i<length;i++){
//        tone.push(tone1[i],tone2[i]);
//    }
//
//    return tone;
//}


//var bpm = process.argv[2];
//var step = 15 / bpm; //60 / 4
