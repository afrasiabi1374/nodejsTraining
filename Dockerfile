FROM node:alpine
RUN mkdir -p /app
COPY app/package.json /app/
RUN cd /app && npm install express && npm install nodemon -g && npm install -f 
COPY ./app/ /app
EXPOSE  5000
WORKDIR /app
CMD ["nodemon"]
