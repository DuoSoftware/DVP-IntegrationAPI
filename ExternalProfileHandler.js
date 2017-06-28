/**
 * Created by Waruna on 6/22/2017.
 */

var request = require("request");
var config = require("config");
var logger = require("dvp-common/LogHandler/CommonLogHandler.js").logger;
var messageFormatter = require("dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js");

module.exports.getAdditionalProfileData = function (req, res) {

    var options = {
        method: "GET",
        uri: config.ExternalProfile.url + req.params.Reference,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "bearer " + config.Token,
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