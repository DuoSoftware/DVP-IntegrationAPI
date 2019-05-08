/**
 * Created by dinusha on 4/22/2015.
 */

module.exports = {

    "Host":
    {
        "vdomain": "LB_FRONTEND",
        "ip": "HOST_NAME",
        "port": "HOST_INTEGRATIONAPI_PORT",
        "version": "HOST_VERSION",
        "token": "HOST_TOKEN"
      
    },
    "Security":
    {

        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD",
        "mode":"SYS_REDIS_MODE",
        "sentinels":{
            "hosts": "SYS_REDIS_SENTINEL_HOSTS",
            "port":"SYS_REDIS_SENTINEL_PORT",
            "name":"SYS_REDIS_SENTINEL_NAME"
        }

    },
    "Mongo":
    {
        "ip":"SYS_MONGO_HOST",
        "port":"SYS_MONGO_PORT",
        "dbname":"SYS_MONGO_DB",
        "password":"SYS_MONGO_PASSWORD",
        "user":"SYS_MONGO_USER",
        "replicaset" :"SYS_MONGO_REPLICASETNAME"
    },
    
   "Services": {
        "userserviceurl": "SYS_USERSERVICE_HOST",
        "userserviceport": "SYS_USERSERVICE_PORT",
        "userserviceversion": "SYS_USERSERVICE_VERSION",
        "accessToken": "HOST_TOKEN",
        "eventtriggerservicehost": "SYS_EVENTTRIGGERSERVICE_HOST",
        "eventtriggerserviceport": "SYS_EVENTTRIGGERSERVICE_PORT",
        "eventtriggerserviceversion": "SYS_EVENTTRIGGERSERVICE_VERSION"
 }
};
