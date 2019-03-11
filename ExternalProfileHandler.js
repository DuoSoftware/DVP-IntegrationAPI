/**
 * Created by Waruna on 6/22/2017.
 */

var request = require("request");
var Q = require('q');
var config = require("config");
var logger = require("dvp-common/LogHandler/CommonLogHandler.js").logger;
var messageFormatter = require("dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js");
var integrationOpHandler = require('./IntegrationAPIOperations.js');

var ExternalUser = require('dvp-mongomodels/model/ExternalUser');

module.exports.getAdditionalProfileData = function (req, res) {

    var options = {
        method: "GET",
        uri: "http://"+config.Services.userserviceurl+":"+config.Services.userserviceport+"/DVP/API/"+config.Services.userserviceversion+"/Profile/External/"+ req.params.Reference,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "bearer " + config.token,
            "companyinfo": req.user.tenant + ":" + req.user.company
        },
        body: res.data
    };
    var jsonString;
    request(options, function (error, response, body) {
        if (error) {
            jsonString = messageFormatter.FormatMessage(error, "EXCEPTION", false, body);
            logger.error("getAdditionalProfileData - [%s] - [%s] - Error.", response, body, error);
            res.end(jsonString);
        } else {
            logger.info("getAdditionalProfileData - [%s]", response);
            jsonString = response.statusCode == 200 ? body : messageFormatter.FormatMessage(null, "EXCEPTION", false, null);
            res.end(jsonString);
        }
    });

};

module.exports.CreateProfileIsNotExist = function (tenant, company, user) {

    var deferred = Q.defer();
    if (user){
        ExternalUser.findOne({
            thirdpartyreference: user.thirdpartyreference,
            company: company,
            tenant: tenant
        }, function (err, profile) {
            if (err) {
                logger.error("CreateProfileIsNotExist - Get External User Failed.[%s] - [%s] - [%s] - [%s]", tenant, company, user.thirdpartyreference, err);
                deferred.reject(err);
            } else {
                if (profile){
                    deferred.resolve(profile);
                } else {
                    var extUser = ExternalUser({
                        thirdpartyreference: user.thirdpartyreference,
                        title: user.title,
                        name: user.name,
                        avatar: user.avatar,
                        birthday: user.birthday,
                        gender: user.gender,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        locale: user.locale,
                        ssn: user.ssn,
                        address: {
                            zipcode: "",
                            number: "",
                            street: "",
                            city: "",
                            province: "",
                            country: ""
                        },
                        phone: user.phone,
                        email: user.email,
                        company: company,
                        tenant: tenant,
                        created_at: Date.now(),
                        updated_at: Date.now(),
                        tags: user.tags
                    });
                    if (user.address) {
                        extUser.address = {
                            zipcode: user.address.zipcode,
                            number: user.address.number,
                            street: user.address.street,
                            city: user.address.city,
                            province: user.address.province,
                            country: user.address.country

                        }
                    }

                    extUser.save(function (err, newuser) {
                        if (err) {
                            logger.error("CreateProfileIsNotExist - User save failed.[%s] - [%s] - [%s] - [%s]", tenant, company, user.thirdpartyreference, err);
                            deferred.reject(err);
                        } else {
                            logger.info("CreateProfileIsNotExist -User saved successfully - [%s]", user.thirdpartyreference);
                            deferred.resolve(newuser);
                        }
                    });

                }
            }
        });
    }

    return deferred.promise;
};