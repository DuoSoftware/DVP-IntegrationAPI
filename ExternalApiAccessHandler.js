/**
 * Created by dinusha on 11/16/2016.
 */
var Promise = require('bluebird');
var config = require('config');
var util = require('util');
var logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var httpReq = require('request');
var async = require('async');
var externalProfileHandler = require('./ExternalProfileHandler.js');
var url_util = require('url');
var ESB = require('./light-esb-node.js');
var format = require("string-template");
const request = require('request');

var traverseObject = function (obj, param, isInner) {
    var val = null;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (property === param && typeof obj[property] !== "object") {
                val = obj[property];
                break;
            }
            else {
                if (typeof obj[property] === "object") {
                    val = traverseObject(obj[property], param, true);
                    break;
                }
            }
        }
    }

    if (!isInner) {
        return val;
    }
};


var callApiMethod = function (reqId, apiInfo, inputObject, callback) {

    var url = apiInfo.url;
    var method = apiInfo.method;
    var parameters = apiInfo.parameters;

    var payload = {};

    var isFirstQueryParam = true;
    var profile = inputObject[apiInfo.referenceType];
    if (profile) {
        parameters.forEach(function (param) {
            var paramValue = null;
            if (param.referenceName && param.name) {
                paramValue = traverseObject(profile, param.referenceName, false);
            }

            if (paramValue != null && paramValue != undefined && paramValue != '') {
                if (param.parameterLocation === 'BODY') {
                    payload[param.name] = paramValue;
                }
                else if (param.parameterLocation === 'QUERY') {

                    var url_parts = url_util.parse(url, true);
                    isFirstQueryParam = url_parts.query === undefined;

                    if (isFirstQueryParam) {
                        url = url + '?' + param.name + '=' + paramValue;
                    }
                    else {
                        url = url + '&' + param.name + '=' + paramValue;
                    }
                }
                else {
                    var stringToGoIntoTheRegex = param.name;
                    var regex = new RegExp(":" + stringToGoIntoTheRegex, "gi");
                    url = url.replace(regex, paramValue);
                }

            }
        });

        var jsonBody = JSON.stringify(payload);

        var options = {
            url: url,
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": apiInfo.globalToken,
                "companyinfo": inputObject.tenantId + ":" + inputObject.companyId
            },
            body: jsonBody
        };


        httpReq(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var apiResp = JSON.parse(body);

                if (apiInfo.referenceType === "PROFILE_SEARCH_DATA") {
                    if (Array.isArray(apiResp)) {
                        var asyncFunctionArraaaa = [];

                        apiResp.forEach(function (apiInfo) {
                            //asyncFunctionArr.push(callApiMethod.bind(this, reqId, apiInfo, inputObject));
                            asyncFunctionArraaaa.push(externalProfileHandler.CreateProfileIsNotExist.bind(this, inputObject.tenantId, inputObject.companyId, apiInfo,false));
                        });

                        async.parallel(asyncFunctionArraaaa, function (err, results) {
                            if (err) {
                                callback(err, null);
                            }
                            else {
                                callback(null, results);
                            }
                        })

                    } else {
                        if (apiResp) {
                            /*externalProfileHandler.CreateProfileIsNotExist(inputObject.tenantId, inputObject.companyId, apiResp,profile.hasOwnProperty("reference"), function (error, profile) {*/
                            externalProfileHandler.CreateProfileIsNotExist(inputObject.tenantId, inputObject.companyId, apiResp,true, function (error, profile) {
                                if (error) {
                                    callback(error, null);
                                }else{
                                    callback(null, profile);
                                }
                            }, function (err) {

                                callback(err, null);
                            });

                        }
                        else {
                            callback(null, null);
                        }
                    }
                }
                else {
                    callback(null, apiResp);
                }
            }
            else {
                // callback(null, null);
                if(error){
                    callback("Error: " + error.message, null);
                }else{
                    callback("Error: " + options.url, null);
                }
            }
        })
    }
    else {
        callback(null, null);
    }

};

/*callApiMethod('dsfd', 'dfsf', 'POST', [{

 name: 'param1',
 referenceType: 'param1',
 parameterLocation: 'QUERY',
 parameterType: 'PROFILE'

 }], {PROFILE: {name: 'sdsssds', age: 'sdsdsds', param2: 'dfdsfdsfd', param3: {param4: 'dsdssd', param1: '2222222', param66: 'sdsdsd'}, param55: 'dsdsd'}}, function(err, resp)
 {
 console.log(res);
 });*/

var generateAPICalls = function (reqId, apiDetails, inputObject) {
    return new Promise(function (fulfill, reject) {
        var asyncFunctionArr = [];

        apiDetails.forEach(function (apiInfo) {
            asyncFunctionArr.push(callApiMethod.bind(this, reqId, apiInfo, inputObject));
        });

        async.parallel(async.reflectAll(asyncFunctionArr), function (err, results) {
            if (err) {
                reject(err);
            }
            else {

                console.log(results);

                var reply = {
                    'data': [],
                    'failedRequests': []
                };

                results.map(function (item) {

                    if(item.error){
                        reply.failedRequests.push(item.error);
                    }else{
                        if (Array.isArray(item.value)) {
                            item.value.map(function (data) {
                                reply.data.push(data);
                            })
                        }
                        else {
                            reply.data.push(item.value);
                        }
                    }

                });
                fulfill(reply);
            }
        })


    });
};

var callAppIntegrationx = function (integrationData, reqObj) {
    return new Promise(function (fulfill, reject) {

        let esbCallback = function(error,esbMessage){
            try{
                if(error){
                    reject(error.cause);
                    return;
                }else{
                    let responseObject = {
                        Success: null,
                        ApiResponse: null,
                        Message: null
                    };

                    if(Buffer.isBuffer(esbMessage.payload)){
                        esbMessage.payload = esbMessage.payload.toString('utf8');
                    }

                    responseObject.ApiResponse = esbMessage.payload;

                    // check if the response status code is in list of accepted codes..
                    if(integrationData.response_map){
                        if(integrationData.response_map.accepted_codes.includes(esbMessage.status.code.toString())){
                            responseObject.Success = true;
                            responseObject.Message = integrationData.response_map.success_msg;
                        }else{
                            responseObject.Success = false;
                            responseObject.Message = integrationData.response_map.error_msg;
                        }

                        responseObject.Message = responseObject.Message.replace(/{(.*)}/, function(match, placeholder){
                            return placeholder.trim().split('.').reduce((o,i)=>o[i], responseObject.ApiResponse);
                        });
                    }else{
                        // response map is not defined (a default integration?), so we get the response status from the EsbMessage
                        responseObject.Message = esbMessage.status.message;

                        if(parseInt(esbMessage.status.code) >= 200 && parseInt(esbMessage.status.code) < 300){ //a 2** response
                            responseObject.Success = true;
                        }else{
                            responseObject.Success = false;
                        }
                    }

                    fulfill(responseObject);
                    return;
                }
            }catch(e){
                reject(e);
                return;
            }
        };

        let paramObj = {
                "PARAMS": {},
                "QUERY": {},
                "BODY": {}
            };

        if(integrationData.parameters) {
            var paramError = false;

            for(param of integrationData.parameters){
                let paramVal;

                // if the parameter referenceObject is Custom, then we don't refer to any object, just use the property as value.
                if(param.referenceObject == "Custom") {
                    paramVal = param.referenceProperty;
                }else{
                    paramVal = reqObj[param.referenceObject][param.referenceProperty];
                }

                if(paramVal != "" && !paramVal){
                    // paramter cannot be null , undefined, throw error! (but could be empty! as requested by the developer)
                    paramError = true;
                    break;
                }else{
                    paramObj[param.parameterLocation][param.name] = paramVal;
                }
            };
        };

        let authProperties = {};

        if(integrationData.auth_type == "Basic"){
            authProperties.auth_type = "Basic";
            authProperties.user = integrationData.username;
            authProperties.password = integrationData.password;
        }else if(integrationData.auth_type == "Bearer"){
            authProperties.auth_type = "Bearer";
            authProperties.token = integrationData.token;
        };

        let requestProperties = {
            timeout: 10000, //milliseconds,
            trycount: 5
        };

        if(integrationData.app && integrationData.app.timeout){
            requestProperties.timeout = parseInt(integrationData.app.timeout) * 1000;
        }

        if(integrationData.app && integrationData.app.trycount){
            requestProperties.trycount = parseInt(integrationData.app.trycount);
        }

        if(paramError){
            esbCallback(new Error('Missing parameter value for ' + param.referenceObject + '.' + param.referenceProperty));
        }else{
            let ESBMessage = ESB.createMessage(paramObj.BODY);

            let loggerComponent = ESB.createLoggerComponent(esbCallback);
            let requestComponent = ESB.createCallComponent(esbCallback, integrationData.url, integrationData.method, paramObj.PARAMS, paramObj.QUERY, authProperties, requestProperties);
            let resultComponent = ESB.createResultComponent(esbCallback);

            requestComponent.connect(loggerComponent);
            requestComponent.connect(resultComponent);
            requestComponent.send(ESBMessage);

        }
    });

};


var callAppIntegration = async function (integrationData, reqObj) {
    //return new Promise(function (fulfill, reject) {

    let requestMethod = async function (option) {

        return new Promise(
            function (resolve, reject) {

                request(option, function (error, response, body) {
                    if(error)
                        return reject(error);
                    return resolve(response);
                });

            }
        );

    }

    let options = {
        method: integrationData.method.toUpperCase(),
        uri: integrationData.url
    };

    let paramObj = {
        "PARAMS": {},
        "QUERY": {},
        "BODY": {}
    };

    if (integrationData.parameters) {
        var paramError = false;

        for (let param of integrationData.parameters) {
            let paramVal;

            // if the parameter referenceObject is Custom, then we don't refer to any object, just use the property as value.
            if (param.referenceObject == "Custom") {
                paramVal = param.referenceProperty;
            } else {
                paramVal = reqObj[param.referenceObject][param.referenceProperty];
            }

            if (paramVal != "" && !paramVal) {
                // paramter cannot be null , undefined, throw error! (but could be empty! as requested by the developer)
                paramError = true;
                break;
            } else {
                paramObj[param.parameterLocation][param.name] = paramVal;
            }
        };
    };


    if (integrationData.auth_type == "Basic") {
        options.auth = {};
        options.auth.user = integrationData.username;
        options.auth.pass = integrationData.password;
    } else if (integrationData.auth_type == "Bearer") {
        options.auth = {
            bearer: integrationData.token
        }
    };

    let requestProperties = {
        timeout: 10000, //milliseconds,
        trycount: 5
    };

    if (integrationData.app && integrationData.app.timeout) {
        requestProperties.timeout = parseInt(integrationData.app.timeout) * 1000;
    }

    if (integrationData.app && integrationData.app.trycount) {
        requestProperties.trycount = parseInt(integrationData.app.trycount);
    }

    options.timeout = requestProperties.timeout;

    if (paramObj.QUERY) {
        options.qs = paramObj.QUERY;
    }

    if (paramObj.BODY && options.method != "GET") {
        options.json = paramObj.BODY
    }else{
        options.json = true;
    }


    if (paramObj.PARAMS) {
        options.uri = format(options.uri, paramObj.PARAMS);
    }


    for (let i = 0; i <= requestProperties.trycount; i++) {
        try {


            let result = await requestMethod(options);

            // if(result){
            //     if(integrationData.response_map){
            //         if(integrationData.response_map.accepted_codes.includes(esbMessage.status.code.toString())){
            //             responseObject.Success = true;
            //             responseObject.Message = integrationData.response_map.success_msg;
            //         }else{
            //             responseObject.Success = false;
            //             responseObject.Message = integrationData.response_map.error_msg;
            //         }
            //
            //         responseObject.Message = responseObject.Message.replace(/{(.*)}/, function(match, placeholder){
            //             return placeholder.trim().split('.').reduce((o,i)=>o[i], responseObject.ApiResponse);
            //         });
            //     }else{
            //         // response map is not defined (a default integration?), so we get the response status from the EsbMessage
            //         responseObject.Message = esbMessage.status.message;
            //
            //         if(parseInt(esbMessage.status.code) >= 200 && parseInt(esbMessage.status.code) < 300){ //a 2** response
            //             responseObject.Success = true;
            //         }else{
            //             responseObject.Success = false;
            //         }
            //     }
            // }
            if (result) {


                let responseObject = {};
                responseObject.ApiResponse = result.body;
                if (integrationData.response_map) {
                    if (integrationData.response_map.accepted_codes.includes(result.statusCode.toString())) {
                        responseObject.Success = true;
                        responseObject.Message = integrationData.response_map.success_msg;
                    } else {
                        responseObject.Success = false;
                        responseObject.Message = integrationData.response_map.error_msg;
                    }

                    responseObject.Message = responseObject.Message.replace(/{(.*)}/, function (match, placeholder) {
                        return placeholder.trim().split('.')
                            .reduce((o, i) => o[i], responseObject.ApiResponse);
                    });
                } else {
                    // response map is not defined (a default integration?), so we get the response status from the EsbMessage
                    responseObject.Message = result.body;

                    if (parseInt(result.statusCode) >= 200 && parseInt(result.statusCode) < 300) { //a 2** response
                        responseObject.Success = true;
                    } else {
                        responseObject.Success = false;
                    }
                }
                return responseObject;

            }

        } catch (ex) {

            console.log(ex.message);
        }
    }


    let responseObject = {};
    if (integrationData.response_map) {

        responseObject.Success = false;
        responseObject.Message = integrationData.response_map.error_msg;
    } else {
        // response map is not defined (a default integration?), so we get the response status from the EsbMessage


        responseObject.Success = false;

    }
    return responseObject;


    //});

};

module.exports.generateAPICalls = generateAPICalls;
module.exports.callAppIntegration = callAppIntegration;
