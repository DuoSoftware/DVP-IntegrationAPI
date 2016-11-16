/**
 * Created by dinusha on 11/16/2016.
 */
var Promise = require('bluebird');
var config = require('config');
var util = require('util');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var httpReq = require('request');
var async = require('async');

var callApiMethod = function(reqId, url, method, parameters, inputObject, callback)
{
    var payload = {};
    var url = url;
    var isFirstQueryParam = true;
    parameters.forEach(function(param)
    {
        var paramValue = null;
        if(param.referenceName && param.name)
        {
            var profile = inputObject[param.parameterType];

            if(profile)
            {
                paramValue = profile[param.referenceName];
            }
        }

        if(paramValue != null && paramValue != undefined && paramValue != '')
        {
            if(param.parameterLocation === 'BODY')
            {
                payload[param.name] = paramValue;
            }
            else if(param.parameterLocation === 'QUERY')
            {
                if(isFirstQueryParam)
                {
                    isFirstQueryParam = !isFirstQueryParam;

                    url = url + '?' + param.name + '=' + paramValue;
                }
                else
                {
                    url = url + '&' + param.name + '=' + paramValue;
                }
            }

        }

        var jsonBody = JSON.stringify(payload);

        var options = {
            url: url,
            method: method,
            body: jsonBody
        };

        httpReq(options, function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                var apiResp = JSON.parse(body);

                callback(null, apiResp);

            }
            else
            {
                callback(null, null);
            }
        })


    })
};

var generateAPICalls = function(reqId, apiDetails, inputObject)
{
    return new Promise(function(fulfill, reject)
    {
        var asyncFunctionArr = [];
        apiDetails.forEach(function(apiInfo)
        {
            asyncFunctionArr.push(callApiMethod.bind(this, reqId, apiInfo.url, apiInfo.method, apiInfo.parameters, inputObject));
        });

        async.parallel(asyncFunctionArr, function(err, results)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                fulfill(results);
            }
        })


    });
};



module.exports.generateAPICalls = generateAPICalls;
