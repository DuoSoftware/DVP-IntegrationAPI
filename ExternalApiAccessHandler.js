/**
 * Created by dinusha on 11/16/2016.
 */
var Promise = require('bluebird');
var config = require('config');
var util = require('util');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var httpReq = require('request');
var async = require('async');

var val = null;

var traverseObject = function(obj, param, isInner)
{
    for (var property in obj)
    {
        if (obj.hasOwnProperty(property))
        {
            if(property === param && typeof obj[property] !== "object")
            {
                val = obj[property];
                break;
            }
            else
            {
                if(typeof obj[property] === "object")
                {
                    val = traverseObject(obj[property], param, true);
                    break;
                }
            }
        }
    }

    if(!isInner)
    {
        return val;
    }
};



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
                paramValue = traverseObject(profile, param.referenceName, false);
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

/*callApiMethod('dsfd', 'dfsf', 'POST', [{

    name: 'param1',
    referenceName: 'param1',
    parameterLocation: 'QUERY',
    parameterType: 'PROFILE'

}], {PROFILE: {name: 'sdsssds', age: 'sdsdsds', param2: 'dfdsfdsfd', param3: {param4: 'dsdssd', param1: '2222222', param66: 'sdsdsd'}, param55: 'dsdsd'}}, function(err, resp)
{
    console.log(res);
});*/

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
