#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm nodejs-legacy
#RUN git clone https://github.com/DuoSoftware/DVP-IntegrationAPI.git /usr/local/src/integrationapi
#RUN cd /usr/local/src/integrationapi; npm install
#CMD ["nodejs", "/usr/local/src/integrationapi/app.js"]

#EXPOSE 8882

FROM node:5.10.0
RUN git clone https://github.com/DuoSoftware/DVP-IntegrationAPI.git /usr/local/src/integrationapi
RUN cd /usr/local/src/integrationapi;
WORKDIR /usr/local/src/integrationapi
RUN npm install
EXPOSE 8882
CMD [ "node", "/usr/local/src/integrationapi/app.js" ]