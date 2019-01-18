'use strict'

const express = require('express')
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')
const app = express()
const router = express.Router()

const port     = process.env.PORT || 8080;

const requestOcr = require('request')
const ocrurl = "http://localhost:5000/v1/ocr";
const imageurl = "http://localhost:" + port

const upload = multer({
    dest:'images/', 
    limits: {fileSize: 2 * 1024 * 1024, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(jpg)$/)) {

            return callback(new Error('Only .jpg Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')


router.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
    //res.json({message: 'Welcome to OCR API'})
})

// deal with the post request when user want upload file
router.post('/images/upload', (req, res) => {

    try{
        upload(req, res, function (err) {

            if (err) {

                res.status(400).json({message: err.message})

            } else {

                // get the uploaded image path
                //let path = `/images/${req.file.filename}`
                try{
                // get the uploaded image path
                    var path = `/images/${req.file.filename}`
                }catch(error){
                    res.status(400).json({message: error.message})
                    res.end()
                }

                if ( typeof path !== 'undefined' && path )
                {
                    
                    // request for ocr to recognise the text
                    console.log("Request for OCR for file " + path)

                    var data = {
                        url: ocrurl,
                        json: true,
                        headers: {
                            "content-type": "application/json",
                        },
                        body: { 'image_url' : imageurl + path }
                    }
                
               // var ocrBody = {'output' : 'Error, please upload image again.'}
                    requestOcr.post(data, function(error, httpResponse, body){
                        console.log("Reponse from OCR url")
                        res.status(200).json(body)
                    });
                }
                else
                {
                    res.status(400).json({message: "Request Error"})
                    res.end()
                }
                
            }
        })
    }
    catch(err){
        res.status(400).json({message: error.message})
        res.end()
    }
})

router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

    res.writeHead(200, {'Content-Type': mime })
    res.end(image, 'binary')
})

app.use('/', router)

app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 
})


app.listen(port)
console.log(`App Runs on ${port}`)