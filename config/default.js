module.exports = {
    "Security": {
        "ip" : "",
        "port": 6389,
        "user": "",
        "password": "",
        "mode":"instance",//instance, cluster, sentinel
        "sentinels":{
            "hosts": "",
            "port":16389,
            "name":"redis-cluster"
        }
    },
    "Host": {
        "ip": "0.0.0.0",
        "port": "2622",
        "version": "1.0.0.0",
        "token": ""
    },
    "Mongo": {
        "ip":"",
        "port":"27017",
        "dbname":"",
        "password":"",
        "user":"",
        "type": "mongodb+srv"
    },
    "Services": {
        "userserviceurl": "SYS_USERSERVICE_HOST",
        "userserviceport": 'SYS_USERSERVICE_PORT',
        "userserviceversion": "SYS_USERSERVICE_VERSION",
        "accessToken": "HOST_TOKEN",
        "eventtriggerservicehost": "SYS_EVENTTRIGGERSERVICE_HOST",
        "eventtriggerserviceport": "SYS_EVENTTRIGGERSERVICE_PORT",
        "eventtriggerserviceversion": "SYS_EVENTTRIGGERSERVICE_VERSION"
    }
};
