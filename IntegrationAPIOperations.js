/**
 * Created by dinusha on 11/16/2016.
 */
var Promise = require('bluebird');
var db = require('dvp-mongomodels');
var IntegrationData = require('dvp-mongomodels/model/IntegrationData').IntegrationData;
var AppData = require('dvp-mongomodels/model/AppData');
var ReportEmail = require('dvp-mongomodels/model/ReportEmailConfig').ReportEmailConfig;


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

var getAppDetails = function (companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        var conditions = {company: companyId, tenant: tenantId};
        
        AppData.find(conditions, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                if (!resp) {
                    reject(new Error('No apps found for company'));
                }
                else {
                    fulfill(resp);
                }

            }
        });

    })
};

var getAppDetailsById = function (reqId, companyId, tenantId, id) {

    return new Promise(function (fulfill, reject) {
        AppData.findOne({_id: id, company: companyId, tenant: tenantId}, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                if (!resp) {
                    reject(new Error('No apps found for id'));
                }
                else {
                    fulfill(resp);
                }
            }
        });

    })
};

var saveAppDetails = function (reqId, appInfo, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        var appObj = AppData(appInfo);

        appObj.company = companyId;
        appObj.tenant = tenantId;

        appObj.save(function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(resp);
            }
        });
    })
};

var updateAppDetails = function (appId, appData, companyId, tenantId) {
    
    return new Promise(function (fulfill, reject) {
        AppData.findOneAndUpdate({company: companyId, tenant: tenantId, _id: appId}, appData, function (err, resp) {
                if (err) {
                    reject(err);
                }
                else {
                    if (!resp) {
                        reject(new Error('No apps found for id'));
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

var deleteAppDetails = function (reqId, id, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        AppData.findOneAndRemove({_id: id, company: companyId, tenant: tenantId}, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(true);
            }
        });

    })
};

var getUserById = function(id, companyId, tenantId)
{
    return new Promise(function(fulfill, reject)
    {
        try
        {
            if(id)
            {
                User.findOne({company: companyId, tenant: tenantId, _id: id})
                    .exec( function(err, user)
                    {
                        if (err)
                        {
                            reject(err);
                        }
                        else
                        {
                            fulfill(user);
                        }
                    });
            }
            else
            {
                fulfill(null);
            }

        }
        catch(ex)
        {
            reject(ex);
        }
    });


};

module.exports.getUserById = getUserById;
module.exports.saveIntegrationAPIDetails = saveIntegrationAPIDetails;
module.exports.getIntegrationAPIDetails = getIntegrationAPIDetails;
module.exports.getAppDetails = getAppDetails;
module.exports.getAppDetailsById = getAppDetailsById;
module.exports.saveAppDetails = saveAppDetails;
module.exports.updateAppDetails = updateAppDetails;
module.exports.updateIntegrationAPIDetails = updateIntegrationAPIDetails;
module.exports.deleteIntegrationAPIDetails = deleteIntegrationAPIDetails;
module.exports.deleteAppDetails = deleteAppDetails;
module.exports.getIntegrationAPIDetailsById = getIntegrationAPIDetailsById;
module.exports.getIntegrationAPIDetailsByRef = getIntegrationAPIDetailsByRef;
