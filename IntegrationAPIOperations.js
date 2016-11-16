/**
 * Created by dinusha on 11/16/2016.
 */
var Promise = require('bluebird');
var IntegrationData = require('dvp-mongomodels/model/IntegrationData').IntegrationData;

var saveIntegrationAPIDetails = function(reqId, apiInfo, companyId, tenantId)
{
    return new Promise(function(fulfill, reject)
    {
        var integrationInfo = IntegrationData({

            url: apiInfo.url,
            method: apiInfo.method,
            parameters: apiInfo.parameters,
            company: companyId,
            tenant: tenantId

        });

        integrationInfo.save(function (err, resp)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                fulfill(resp);
            }
        });

    })
};

var getIntegrationAPIDetails = function(reqId, companyId, tenantId)
{
    return new Promise(function(fulfill, reject)
    {
        IntegrationData.find({company: companyId, tenant: tenantId}, function(err, resp)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                if(!resp)
                {
                    reject(new Error('No integration data found for company'));
                }
                else
                {
                    fulfill(resp);
                }

            }
        });

    })
};

var updateIntegrationAPIDetails = function(reqId, id, apiInfo, companyId, tenantId)
{
    return new Promise(function (fulfill, reject)
    {
        IntegrationData.findAndUpdate({company: companyId, tenant: tenantId, _id: id},
            {
                url: apiInfo.url,
                method: apiInfo.method,
                parameters: apiInfo.parameters,
                company: companyId,
                tenant: tenantId

            }, function (err, resp)
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    if (resp)
                    {
                        reject(new Error('No integration data found for company'));
                    }
                    else
                    {
                        fulfill(resp);
                    }

                }
            });

    })
};

var deleteIntegrationAPIDetails = function(reqId, id, companyId, tenantId)
{
    return new Promise(function(fulfill, reject)
    {
        IntegrationData.findOneAndRemove({_id: id, company: companyId, tenant: tenantId}, function(err, resp)
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                fulfill(true);
            }
        });

    })
};


module.exports.saveIntegrationAPIDetails = saveIntegrationAPIDetails;
module.exports.getIntegrationAPIDetails = getIntegrationAPIDetails;
module.exports.updateIntegrationAPIDetails = updateIntegrationAPIDetails;
module.exports.deleteIntegrationAPIDetails = deleteIntegrationAPIDetails;