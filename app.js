/**
 * Created by dinusha on 11/15/2016.
 */
var restify = require('restify');
var config = require('config');
var uuid = require('node-uuid');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var integrationOpHandler = require('./IntegrationAPIOperations.js');
var externalApiHandler = require('./ExternalApiAccessHandler.js');
var externalProfileHandler = require('./ExternalProfileHandler.js');
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
var util = require('util');


var server = restify.createServer({
    name: 'DVP Integration API',
    version: '1.0.0'
});

var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;

restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(jwt({secret: secret.Secret}));

var mongoip=config.Mongo.ip;
var mongoport=config.Mongo.port;
var mongodb=config.Mongo.dbname;
var mongouser=config.Mongo.user;
var mongopass = config.Mongo.password;



var mongoose = require('mongoose');
var connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip,mongoport,mongodb)


mongoose.connection.on('error', function (err) {
    throw new Error(err);
});

mongoose.connection.on('disconnected', function() {
    throw new Error('Could not connect to database');
});

mongoose.connection.once('open', function() {
    console.log("Connected to db");
});


mongoose.connect(connectionstring);

server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});




server.post('/DVP/API/:version/IntegrationAPI/IntegrationInfo', authorization({resource:"integration", action:"write"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-IntegrationAPI.AddIntegrationInfo] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var integrationInfo = req.body;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.saveIntegrationAPIDetails(reqId, integrationInfo, companyId, tenantId)
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details added successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.AddIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error saving", false, null);
                logger.error('[DVP-IntegrationAPI.AddIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.AddIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.put('/DVP/API/:version/IntegrationAPI/IntegrationInfo/:id', authorization({resource:"integration", action:"write"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-IntegrationAPI.UpdateIntegrationInfo] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var integrationInfo = req.body;
        var id = req.params.id;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.updateIntegrationAPIDetails(reqId, id, integrationInfo, companyId, tenantId)
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details updated successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.UpdateIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error saving", false, null);
                logger.error('[DVP-IntegrationAPI.UpdateIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.UpdateIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.del('/DVP/API/:version/IntegrationAPI/IntegrationInfo/:id', authorization({resource:"tag", action:"delete"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-IntegrationAPI.DeleteIntegrationInfo] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var id = req.params.id;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.deleteIntegrationAPIDetails(reqId, id, companyId, tenantId)
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details deleted successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.DeleteIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error saving", false, null);
                logger.error('[DVP-IntegrationAPI.DeleteIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.DeleteIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.get('/DVP/API/:version/IntegrationAPI/IntegrationInfo', authorization({resource:"integration", action:"read"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-IntegrationAPI.GetIntegrationInfo] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.getIntegrationAPIDetails(reqId,null, companyId, tenantId)
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details retrieved successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.GetIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error getting data", false, null);
                logger.error('[DVP-IntegrationAPI.GetIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.GetIntegrationInfo] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.get('/DVP/API/:version/IntegrationAPI/IntegrationInfo/Reference/:refName', authorization({resource:"integration", action:"read"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-IntegrationAPI.GetIntegrationInfoByRef] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;


        var refName = req.params.refName;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.getIntegrationAPIDetailsByRef(reqId, companyId, tenantId, refName)
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details retrieved successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.GetIntegrationInfoByRef] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error getting data", false, null);
                logger.error('[DVP-IntegrationAPI.GetIntegrationInfoByRef] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.GetIntegrationInfoByRef] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.post('/DVP/API/:version/IntegrationAPI/:referenceType/CallAPIs', authorization({resource:"integration", action:"write"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-IntegrationAPI.CallAPIs] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;

        var extraData = req.body;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.getIntegrationAPIDetails(reqId,req.params.referenceType, companyId, tenantId)
            .then(function(resp)
            {
                if(resp&&resp.length){
                    extraData.tenantId = tenantId;
                    extraData.companyId = companyId;
                    extraData.referenceType = req.params.referenceType;
                    return externalApiHandler.generateAPICalls(reqId, resp, extraData);
                }
                else {
                    var jsonString = messageFormatter.FormatMessage(null, "Invalid Details.", false, resp);
                    logger.debug('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }


            })
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details retrieved successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error getting data", false, null);
                logger.error('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.post('/DVP/API/:version/IntegrationAPI/CallAPI/:id', authorization({resource:"integration", action:"write"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        /*logger.debug('[DVP-IntegrationAPI.CallAPIs] - [%s] - HTTP Request Received', reqId);
        var json = {
            Name: "Dinusha Kannangara",
            Gender: "Male",
            Active: true,
            Company: "Duo Software"
        };

        var jsonString = messageFormatter.FormatMessage(null, "Integration API details retrieved successfully", true, json);
        res.end(jsonString);*/

        logger.debug('[DVP-IntegrationAPI.CallAPIs] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var id = req.params.id;

        var extraData = req.body;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        integrationOpHandler.getIntegrationAPIDetailsById(reqId, id, companyId, tenantId)
            .then(function(resp)
            {
                var tempArr = [];
                tempArr.push(resp);
                return externalApiHandler.generateAPICalls(reqId, tempArr, extraData);

            })
            .then(function(resp)
            {
                var jsonString = messageFormatter.FormatMessage(null, "Integration API details retrieved successfully", true, resp);
                logger.debug('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            })
            .catch(function(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error getting data", false, null);
                logger.error('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

            })

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('[DVP-IntegrationAPI.CallAPIs] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.get('/DVP/API/:version/IntegrationAPI/Profile/External/:Reference', authorization({resource:"integration", action:"write"}), function(req, res, next)
{
    var reqId = uuid.v1();
    try
    {

        logger.debug('getAdditionalProfileData - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        externalProfileHandler.getAdditionalProfileData(req,res);
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
        logger.error('getAdditionalProfileData - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});