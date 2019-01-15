# OCR_SC Project:

* Get ideas from Python_ocr_turorial: https://realpython.com/blog/python/setting-up-a-simple-ocr-server/
* Combine with nodejs to store images
* Uploading to be continued
* Build with Docker

### Updated on 2019.1.15
Updated backend image server with upload API.

##### An easier way to use:
Pull image from docker hub.
```sh
# docker pull miedocker/ubuntu-ocr-backend:1.0.0
# docker run -d -p 8080:8080 miedocker/ubuntu-ocr-backend:1.0.0
```
##### Use postman to test:
![Image of Testing with Postman-1](https://raw.githubusercontent.com/iversonzpy/OCR_SC/upload_server/files/postman_test1.jpg)
![Image of Testing with Postman-2](https://raw.githubusercontent.com/iversonzpy/OCR_SC/upload_server/files/postman_test2.jpg)


## Instructions:

Inside project folder, you can put your testing images to /image_server/img/, jpg files only for now.

Install Docker CE on your computer. 
```sh
# cd OCR_SC
# docker build . -t python_ocr_with_node:latest
```
after build succefully
```sh
# docker images
# docker run -d -p 8000:8000 -p 5000:5000 'IMAGE_ID'
```
or
```sh
# docker run -it -p 8000:8000 -p 5000:5000 'IMAGE_ID' /bin/sh
```

To run some commands in docker container, use docker ps to get the 'CONTAINER_ID':
```sh
# docker ps
# docker exec -it 'CONTAINER_ID' /bin/sh
```

It will run nodejs at port 8000, ocr at port 5000.

To test image server is running:
```sh
# curl http://localhost:8000/index.html
```
It will return index.html.

To test your images: 
```sh
# curl -X POST http://localhost:5000/v1/ocr -d '{"image_url": "http://localhost:8000/img/sample2.jpg"}' -H "Content-Type: application/json"
```
Change your image url in the above command.
