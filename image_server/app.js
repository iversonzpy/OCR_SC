'use strict'

const express = require('express')
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')
const app = express()
const router = express.Router()
const util = require('util');

const port     = process.env.PORT || 8080;

const requestOcr = require('request')
const bodyParser = require("body-parser");
//const ocrurl = "http://localhost:5000/v1/ocr";
//const imageurl = "http://localhost:" + port
//

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const upload = multer({
    dest:'images/', 
    limits: {fileSize: 20 * 1024 * 1024, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')


const vision = require('@google-cloud/vision');



router.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
    //res.json({output: 'Welcome to OCR API'})
})


//For speech 

async function getSpeech(text, outputFile) {
    const textToSpeech = require('@google-cloud/text-to-speech');
    
    

    const client = new textToSpeech.TextToSpeechClient();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    //const text = 'Hello';
    var outputPath = 'voices/' + outputFile;
    console.log(outputPath)
    //var file = fs.createWriteStream(outputFile);

    const request = {
      input: {text: text},
      voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
      audioConfig: {audioEncoding: 'MP3'},
    };
    return await client.synthesizeSpeech(request).audioContent;

    //const writeFile = util.promisify(fs.writeFile);
    //await writeFile(outputPath, response.audioContent, 'binary');
    //console.log(`Audio content written to file: ${outputPath}`);
    //
    //console.log("Audio:----------------" )
    //console.log(response.audioContent);
    //const audiobase64 = Buffer.from(response.audioContent, 'binary').toString('base64');
    //return audiobase64;
}




router.post('/images/upload2', (req, res) => {

    try{
        upload(req, res, function (err) {

            if (err) {
                console.log("Upload Error")
                console.log(err.message)

                res.status(400).json({output: err.message})

            } else {

                // get the uploaded image path
                //let path = `/images/${req.file.filename}`
                try{
                // get the uploaded image path
                    var path = `images/${req.file.filename}`
                    console.log(path)
                }catch(error){
                    res.status(400).json({output: error.message})
                    res.end()
                }

                if ( typeof path !== 'undefined' && path )
                {
                    
                    // request for ocr to recognise the text
                    console.log("Request for OCR for file " + path)
                    const client = new vision.ImageAnnotatorClient();


                    client
                      .textDetection(path)
                      .then(results => {
                        const detections = results[0].documentTextDetection;
                        console.log('Text:');
                        detections.forEach(text => console.log(text.description));
                        //console.log(detections[0].description);
                        res.status(200).json({output: detections[0].description});
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                        res.status(400).json({output: ""})
                        res.end()
                    });

                }
                else
                {
                    res.status(400).json({output: "Image not found on server"})
                    res.end()
                }
                
            }
        })
    }
    catch(err){
        res.status(400).json({output: err.message})
        res.end()
    }
})


router.post('/images/upload3', (req, res) => {

    try{
        upload(req, res, function (err) {

            if (err) {
                console.log("Upload Error")
                console.log(err.message)

                res.status(400).json({output: err.message})

            } else {

                // get the uploaded image path
                //let path = `/images/${req.file.filename}`
                try{
                // get the uploaded image path
                    var path = `images/${req.file.filename}`
                    console.log(path)
                }catch(error){
                    res.status(400).json({output: error.message})
                    res.end()
                }

                if ( typeof path !== 'undefined' && path )
                {
                    
                    // request for ocr to recognise the text
                    console.log("Request for OCR for file " + path)
                    const client = new vision.ImageAnnotatorClient();
                    const client2 = new vision.ImageAnnotatorClient();
                    

                    //res.writeHead(200, {"Content-Type": "application/json"});
                    client
                      .textDetection(path)
                      .then(results => {
                        const detections = results[0].textAnnotations;
                        console.log('Text:');
                        if(typeof(detections) == 'undefined' || typeof(detections[0]) == 'undefined'){
                            outputJson = 'Unrecognized Text';
                        }else{
                            //detections.forEach(text => console.log(text.description));
                            //console.log(detections[0].description);
                            //res.status(200).json({output: detections[0].description});
                            outputJson = detections[0].description;
                        }
                            console.log("outputJson----------------");
                            console.log(outputJson);
                        
                        //res.status(200).json({output: outputJson});
                        //res.write(JSON.stringify({output: outputJson})); 
                        client2
                          .labelDetection(path)
                          .then(results => {
                            const detections = results[0].labelAnnotations;
                            console.log('Labels:');
                            if(typeof(detections) == "undefined"){
                                outputJson = 'Unrecognized Text';
                            }else{
                            //detections.forEach(label => console.log(label.description));
                            detections.forEach(label => labels.push(label.description));
                            }
                            //console.log(detections[0].description);
                            //res.status(200).json({output: detections[0].description});
                            console.log("Labels----------------");
                            console.log(labels.toString())

                            if(labels.length > 4){
                                labels = labels.slice(0, 5);
                            }

                            //res.status(200).json({labels: labels.toString()});
                            res.status(200).json({
                                output: outputJson,
                                labels: labels.toString()});
                            res.end();

                        })
                        .catch(err => {
                        console.error('ERROR:', err);
                        throw err;
                        //res.status(400).json({output: ""})
                        //res.end()
                        });
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                        throw err;
                        //res.status(400).json({output: ""})
                        //res.end()
                    });
                }
                else
                {
                    res.status(400).json({output: "Image not found on server", 
                    labels: ''})
                    res.end()
                }
                
            }
        })
    }
    catch(err){
        //res.status(400).json({output: err.message})
        console.log(err.message);
        res.status(400).json({
            output: outputJson,
            labels: labels.toString()});
        
        res.end()
    }
})


router.post('/images/upload', (req, res) => {

    var outputJson = '';
    var labels = [];
    try{
        upload(req, res, function (err) {

            if (err) {
                console.log("Upload Error")
                console.log(err.message)

                res.status(400).json({output: err.message})

            } else {

                // get the uploaded image path
                //let path = `/images/${req.file.filename}`
                var voicename = `${req.file.filename}`
                try{
                // get the uploaded image path
                    var path = `images/${req.file.filename}`

                    console.log(path)
                }catch(error){
                    res.status(400).json({output: error.message})
                }

                if ( typeof path !== 'undefined' && path )
                {
                    
                    // request for ocr to recognise the text
                    console.log("Request for OCR for file " + path)
                    const client = new vision.ImageAnnotatorClient();
                    const client2 = new vision.ImageAnnotatorClient();
                    

                    //res.writeHead(200, {"Content-Type": "application/json"});
                    client
                      .documentTextDetection(path)
                      .then(results => {
                        const fullTextAnnotation = results[0].fullTextAnnotation;
                        console.log('fullTextAnnotation:');
                        if(typeof(fullTextAnnotation) == 'undefined' || !fullTextAnnotation || !(fullTextAnnotation.text) ){
                            outputJson = 'Unrecognized Text';
                            console.log("Unrecognized Text");
                        }else{
                            //detections.forEach(text => console.log(text.description));
                            console.log("fullTextAnnotation----------------");
                            console.log(fullTextAnnotation.text);
                            //res.status(200).json({output: detections[0].description});
                            outputJson = fullTextAnnotation.text;
                        }
                            
                            //console.log(outputJson);
                        
                        //res.status(200).json({output: outputJson});
                        //res.write(JSON.stringify({output: outputJson})); 
                        client2
                          .labelDetection(path)
                          .then(results => {
                            const detections = results[0].labelAnnotations;
                            console.log('Labels:');
                            if(typeof(detections) == "undefined"){
                                labels = 'Unrecognized Labels';
                            }else{
                            //detections.forEach(label => console.log(label.description));
                            detections.forEach(label => labels.push(label.description));
                            }
                            //console.log(detections[0].description);
                            //res.status(200).json({output: detections[0].description});
                            console.log("Labels----------------");
                            console.log(labels.toString())

                            if(labels.length > 4){
                                labels = labels.slice(0, 5);
                            }

                            //var voicepath = 'voices/'+ voicename +'.mp3';
                            //res.status(200).json({labels: labels.toString()});
                            res.status(200).json({
                                output: outputJson,
                                labels: labels.toString()
                                })
                            res.end();

                        })
                        .catch(err => {
                        console.error('ERROR:', err);
                        throw err;
                        //res.status(400).json({output: ""})
                        //res.end()
                        });
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                        throw err;
                        //res.status(400).json({output: ""})
                        //res.end()
                    });
                }
                else
                {
                    res.status(400).json({output: "Image not found on server", 
                    labels: ''})
                }
                
            }
        })
    }
    catch(err){
        //res.status(400).json({output: err.message})
        console.log(err.message);
        res.status(400).json({
            output: outputJson,
            labels: labels.toString()});
        
    }
})

router.get('/voices', (req, res) => {

    try{
        var voicetext = req.query.voicetext;
        console.log(voicetext)
        const textToSpeech = require('@google-cloud/text-to-speech');
        const client = new textToSpeech.TextToSpeechClient();
        
        //var file = fs.createWriteStream(outputFile);

        const request = {
          input: {text: voicetext},
          voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
          audioConfig: {audioEncoding: 'MP3'},
        };

        var audiodata = '';
        client
          .synthesizeSpeech(request)
          .then(response => {
            //const audioContent = response[0].audioContent;
            console.log('Audio: ---------');
            //if(typeof(audioContent) !== "undefined" && audioContent !==''){
            const audiobase64 = Buffer.from(response[0].audioContent, 'binary').toString('base64'); 
            
            res.status(200).json({
                audioContent: audiobase64
                })
            res.end();

        })
        .catch(err => {
        console.error('ERROR:', err);
        //throw err;
        res.status(400).json({audioContent: ""})
        res.end()
        });
    }catch(err){
        Console.error('ERROR:', err);
        //throw err;
        res.status(400).json({audioContent: ""})
        res.end()
    }
})


router.post('/voices/upload', (req, res) => {

    var voicetext = req.body.voicetext//`${req.body.voicetext}`;
    console.log(voicetext)
    const textToSpeech = require('@google-cloud/text-to-speech');
    const client = new textToSpeech.TextToSpeechClient();
    
    //var file = fs.createWriteStream(outputFile);

    const request = {
      input: {text: voicetext},
      voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
      audioConfig: {audioEncoding: 'MP3'},
    };

    var audiodata = '';
    client
      .synthesizeSpeech(request)
      .then(response => {
        //const audioContent = response[0].audioContent;
        console.log('Audio: ---------');
        //if(typeof(audioContent) !== "undefined" && audioContent !==''){
        const audiobase64 = Buffer.from(response[0].audioContent, 'binary').toString('base64'); 
        
        res.status(200).json({
            audioContent: audiobase64
            })
        res.end();

    })
    .catch(err => {
    console.error('ERROR:', err);
    //throw err;
    res.status(400).json({audioContent: ""})
    res.end()
    });

})

router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

    res.writeHead(200, {'Content-Type': mime })
    res.end(image, 'binary')
})

router.get('/voices/:voicename', (req, res) => {
    let voicename = req.params.voicename
    let voicepath = __dirname + "/voices/" + voicename
    let voice = fs.statSync(voicepath)
    //let mime = fileType(voice).
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': voice.size
    });
    const readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to util.pump()
    util.pump(readStream, res);
})

app.use('/', router)


app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        
        res.status(404).json({output: ''})

    } else {

        res.status(500).json({output: err.message}) 
    } 
})


app.listen(port)
console.log(`App Runs on ${port}`)