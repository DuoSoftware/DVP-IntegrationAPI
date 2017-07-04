/**
 * Created by dinusha on 11/16/2016.
 */
var Promise = require('bluebird');
var IntegrationData = require('dvp-mongomodels/model/IntegrationData').IntegrationData;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var saveIntegrationAPIDetails = function (reqId, apiInfo, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        var integrationInfo = IntegrationData({

            url: apiInfo.url,
            referenceType: apiInfo.referenceType,
            name: apiInfo.name,
            globalToken: apiInfo.globalToken,
            method: apiInfo.method,
            parameters: apiInfo.parameters,
            company: companyId,
            tenant: tenantId

        });

        integrationInfo.save(function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(resp);
            }
        });

    })
};


var getIntegrationAPIDetails = function (reqId, referenceType, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        var conditions = {company: companyId, tenant: tenantId};
        if (referenceType) {
            conditions["referenceType"] = referenceType;
        }
        IntegrationData.find(conditions, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                if (!resp) {
                    reject(new Error('No integration data found for company'));
                }
                else {
                    fulfill(resp);
                }

            }
        });

    })
};

var getIntegrationAPIDetailsByRef = function (reqId, companyId, tenantId, refName) {
    return new Promise(function (fulfill, reject) {
        IntegrationData.find({company: companyId, tenant: tenantId, referenceName: refName}, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                if (!resp) {
                    reject(new Error('No integration data found for company'));
                }
                else {
                    fulfill(resp);
                }

            }
        });

    })
};

var getIntegrationAPIDetailsById = function (reqId, id, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        IntegrationData.findOne({_id: id, company: companyId, tenant: tenantId}, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                if (!resp) {
                    reject(new Error('No integration data found for id'));
                }
                else {
                    fulfill(resp);
                }

            }
        });

    })
};


var updateIntegrationAPIDetails = function (reqId, id, apiInfo, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        IntegrationData.findAndUpdate({company: companyId, tenant: tenantId, _id: id},
            {
                url: apiInfo.url,
                referenceName: apiInfo.referenceName,
                method: apiInfo.method,
                parameters: apiInfo.parameters,
                company: companyId,
                tenant: tenantId

            }, function (err, resp) {
                if (err) {
                    reject(err);
                }
                else {
                    if (resp) {
                        reject(new Error('No integration data found for company'));
                    }
                    else {
                        fulfill(resp);
                    }

                }
            });

    })
};

var deleteIntegrationAPIDetails = function (reqId, id, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        IntegrationData.findOneAndRemove({_id: id, company: companyId, tenant: tenantId}, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(true);
            }
        });

    })
};


module.exports.saveIntegrationAPIDetails = saveIntegrationAPIDetails;
module.exports.getIntegrationAPIDetails = getIntegrationAPIDetails;
module.exports.updateIntegrationAPIDetails = updateIntegrationAPIDetails;
module.exports.deleteIntegrationAPIDetails = deleteIntegrationAPIDetails;
module.exports.getIntegrationAPIDetailsById = getIntegrationAPIDetailsById;
module.exports.getIntegrationAPIDetailsByRef = getIntegrationAPIDetailsByRef;