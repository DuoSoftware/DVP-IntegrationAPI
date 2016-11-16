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
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');

var server = restify.createServer({
    name: "DVP Integration API"
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false }));

restify.CORS.ALLOW_HEADERS.push('authorization');
restify.CORS.ALLOW_HEADERS.push('companyinfo');
server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(jwt({secret: secret.Secret}));

server.use(jwt({secret: secret.Secret}));

var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;


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

server.del('/DVP/API/:version/IntegrationAPI/IntegrationInfo/:id', authorization({resource:"integration", action:"write"}), function(req, res, next)
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

server.get('/DVP/API/:version/IntegrationAPI/IntegrationInfo', authorization({resource:"integration", action:"write"}), function(req, res, next)
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

        integrationOpHandler.getIntegrationAPIDetails(reqId, companyId, tenantId)
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

server.post('/DVP/API/:version/IntegrationAPI/CallAPIs', authorization({resource:"integration", action:"write"}), function(req, res, next)
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

        integrationOpHandler.getIntegrationAPIDetails(reqId, companyId, tenantId)
            .then(function(resp)
            {
                return externalApiHandler.generateAPICalls(reqId, resp, extraData);

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



server.listen(hostPort, hostIp, function () {

    logger.info("DVP-IntegrationAPI Server %s listening at %s", server.name, server.url);

});