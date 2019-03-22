/**
 * Created on 18/03/2019.
 */
var Promise = require('bluebird');
var AppData = require('dvp-mongomodels/model/AppData').AppData;
var Integration = require('dvp-mongomodels/model/AppData').Integration;
var FormMaster = require('dvp-mongomodels/model/FormMaster').FormMaster;

var getAppDetails = function (companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        var conditions = {company: companyId, tenant: tenantId};
        
        AppData.find(conditions, {}, function (err, resp) {
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

var getAppListForAgent = function (companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        var conditions = {company: companyId, tenant: tenantId};

        var project = {
                    name:1,
                    description:1,
                    default_integration:1,
                    actions:1
                };
        
        AppData.find(conditions, project)
        .populate({
            path: 'actions.dynamic_form_id',
            model: 'FormMaster',
            select: 'name fields'
        }).exec(function (err, resp) {
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
        AppData.findOne({_id: id, company: companyId, tenant: tenantId})
        .populate('default_integration')
        .populate({
            path: 'actions.integration',
            model: 'Integration'
        })
        .exec(function (err, resp) {
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

var addDefaultIntegration = async function (appId, integrationData, companyId, tenantId) {

    var IntegrationObj = Integration(integrationData);

    return await IntegrationObj.save(function (err, resp) {
            if (err) {
                return Promise.reject(new Error('error'));
            } else {
                return new Promise(function (fulfill, reject) {
                    AppData.findOneAndUpdate({
                        _id: appId
                    }, { "default_integration": resp._id }, function (error, resp_int) {
                        if (error) {
                            reject(error);
                        } else {
                            fulfill(resp_int);
                        }
                });
            });
        }    
    });
};

var createAction = async function(appId, actionData){
    try {
        let IntegrationObj = await Integration(actionData.integration).save();

        actionData.integration = IntegrationObj._id;

        return AppData.findOneAndUpdate(
                            {  _id: appId },
                            { $push: { actions: actionData  } },
                            { new: true }
            );
    } catch(err) {
        return Promise.reject(new Error(err));
    }
};

var updateAction = async function (appId, actionId, actionData) {
    try{
        integrationData = actionData.integration;
        await updateIntegration(integrationData._id, integrationData);

        actionData.integration = integrationData._id;

        return AppData.findOneAndUpdate({ "_id": appId, 'actions._id': actionId },
                {
                    "$set": {
                        "actions.$": actionData
                    }
                })
        .exec();
        
    } catch(err) {
        return Promise.reject(new Error(err));
    }
};

var updateIntegration = function (integrationId, integrationData, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        Integration.findOneAndUpdate({_id: integrationId}, integrationData, function (err, resp) {
                if (err) {
                    reject(err);
                }
                else {
                    if (!resp) {
                        reject(new Error('No integrations found for id'));
                    }
                    else {
                        fulfill(resp);
                    }
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

var deleteAppDetails = function (reqId, id, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        AppData.findOneAndRemove({_id: id, company: companyId, tenant: tenantId}, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                resp.remove();
                fulfill(true);
            }
        });
    })
};

var deleteAppAction = function (appId, actionId, companyId, tenantId) {
    return new Promise(function (fulfill, reject) {
        return AppData.findOne(
            { _id: appId, company: companyId, tenant: tenantId }, {},
            function(err, app){
                if(err){
                    reject(err);
                    }else{                    
                        app.actions.id(actionId).remove();
                        app.save();
                        fulfill(true);
                    }     
            });
    });
};

var getIntegrationById = function (reqId, id, companyId, tenantId) {

    // var conditions = {_id: id, company: companyId, tenant: tenantId};
    var conditions = { _id: id };
    return new Promise(function (fulfill, reject) {
        Integration.findOne(conditions, function (err, resp) {
            if (err) {
                reject(err);
            }
            else {
                if (!resp) {
                    reject(new Error('No integration data found!'));
                }
                else {
                    fulfill(resp);
                }
            }
        });

    })
};

module.exports.getAppDetails = getAppDetails;
module.exports.getAppListForAgent = getAppListForAgent;
module.exports.getAppDetailsById = getAppDetailsById;
module.exports.saveAppDetails = saveAppDetails;
module.exports.addDefaultIntegration = addDefaultIntegration;
module.exports.createAction = createAction;
module.exports.updateAction = updateAction;
module.exports.deleteAppAction = deleteAppAction;
module.exports.updateIntegration = updateIntegration;
module.exports.getIntegrationById = getIntegrationById;
module.exports.updateAppDetails = updateAppDetails;
module.exports.deleteAppDetails = deleteAppDetails;
