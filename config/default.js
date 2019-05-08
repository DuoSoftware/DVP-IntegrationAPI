module.exports = {
    "Security": {
        "ip" : "45.55.142.207",
        "port": 6389,
        "user": "duo",
        "password": "DuoS123",
        "mode":"sentinel",//instance, cluster, sentinel
        "sentinels":{
            "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
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
        "ip":"104.236.231.11",
        "port":"27017",
        "dbname":"dvpdb",
        "password":"DuoS123",
        "user":"duo"
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
