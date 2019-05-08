/**
 * Created by Nimeshka on 6/5/2019
 */
const mongoose = require('mongoose');
const Webhook = require('dvp-mongomodels/model/Webhook');
const config = require('config');
const request = require('request');
const validator = require('validator');
const util = require('util');

mongoose.Promise = Promise;

let eventServiceURL = "http://%s:%s/DVP/API/%s/EventTrigger";

if (validator.isIP(config.Services.eventtriggerservicehost)) {
    eventServiceURL = util.format(eventServiceURL, config.Services.eventtriggerservicehost, config.Services.eventtriggerserviceport, config.Services.eventtriggerserviceversion);
}else{
    eventServiceURL = util.format(eventServiceURL,  config.Services.eventtriggerservicehost, config.Services.eventtriggerserviceversion);
}

const webhookHandler = {
    
    getWebhooks: function (companyId, tenantId) {
        return Webhook.find({
                            company: companyId, 
                            tenant: tenantId
                        });
    },

    createWebhook: function (data, companyId, tenantId) {
        let webhook = Webhook(data);

        webhook.company = companyId;
        webhook.tenant = tenantId;

        return webhook.save();
    },

    updateWebhook: function (id, data, companyId, tenantId) {
        return Webhook.findOneAndUpdate({ 
                                        company: companyId, 
                                        tenant: tenantId, 
                                        _id: id 
                                    }, 
                                        data
                                    );
    },

    updateWebhookStatus: async function (id, enabledStatus, companyId, tenantId) {

        let webhook = await Webhook.findOne({
                                    _id: id,
                                    company: companyId, 
                                    tenant: tenantId
                                });

        if(!webhook) return false;

        if(enabledStatus === true){
            //subscribe
            let subscription = await this.subscribeWebhook(webhook.event_type);
            console.log(subscription);

            if(subscription.hasOwnProperty("id")){
                webhook.uuid = subscription.id;
                webhook.is_enabled = true;
                webhook.save();
                return true;
            }else{
                throw(new Error("Invalid response from Event Trigger service!"));
            }
        } else {
            //unsubscribe
            let subscription = await this.unsubscribeWebhook(webhook.uuid, webhook.event_type);
            
            if(subscription.hasOwnProperty("subscribeData")){
                webhook.uuid = undefined;
                webhook.is_enabled = false;
                webhook.save();
                return true;
            }else{
                throw(new Error("Invalid response from Event Trigger service!"));
            }
        }
    },

    subscribeWebhook: function(event_type){
        
        let options = {
            url: eventServiceURL + "/Subscribe",
            headers: {
                'authorization': 'Bearer ' + config.Services.accessToken
            },
            body: {
                eventType: event_type.toUpperCase()
            },
            json:true
        };

        return new Promise(
            function (resolve, reject) {
                request.post(options, function (error, response, body) {
                    if(error)
                        return reject(error);
                    return resolve(response.body);
                });

            }
        );
    },

    unsubscribeWebhook: function(id, event_type){
        
        let options = {
            url: eventServiceURL + "/UnSubscribe/" + id,
            headers: {
                'authorization': 'Bearer ' + config.Services.accessToken
            },
            qs: {
                eventType: event_type.toUpperCase()
            },
            json:true
        };

        return new Promise(
            function (resolve, reject) {
                request.delete(options, function (error, response, body) {
                    if(error)
                        return reject(error);
                    return resolve(response.body);
                });

            }
        );
    },
    
    deleteWebhook: function (id, companyId, tenantId) {
        return Webhook.findOneAndRemove({
                                        _id: id, 
                                        company: companyId, 
                                        tenant: tenantId
                                    });
    }

}

module.exports = webhookHandler;
