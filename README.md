OCR_SC Project:

Get idea from Python_ocr_turorial: https://realpython.com/blog/python/setting-up-a-simple-ocr-server/
Combine with nodejs to store images
Uploading to be contine
Build with Docker

Instructions:

Inside project folder, you can put your testing images to /image_server/img/, jpg files only for now.

Install Docker CE on your computer. 

cd 'project_folder'

# docker build . -t python_ocr_with_node:latest

after build succefully

# docker images
# docker run -d -p 8000:8000 -p 5000:5000 'IMAGE_ID'

or
# docker run -it -p 8000:8000 -p 5000:5000 'IMAGE_ID' /bin/sh

To run some commands in docker container, use docker ps to get the 'CONTAINER_ID':

# docker ps
# docker exec -it 'CONTAINER_ID' /bin/sh

It will run nodejs at port 8000, ocr at port 5000.

To test image server is running:
# curl http://localhost:8000/index.html

It will return index.html.

To test your images: 

# curl -X POST http://localhost:5000/v1/ocr -d '{"image_url": "http://localhost:8000/img/sample2.jpg"}' -H "Content-Type: application/json"

Change your image url in the above command.
