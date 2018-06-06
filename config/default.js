module.exports = {
    "Security": {
        "ip": "",
        "port": 6389,
        "user": "",
        "password": "",
        "mode": "sentinel",//instance, cluster, sentinel
        "sentinels": {
            "hosts": "",
            "port": 16389,
            "name": "redis-cluster"
        }
    },
    "Host": {
        "ip": "0.0.0.0",
        "port": "4334",
        "version": "1.0.0.0",
        "token": ""
    },
    "Mongo": {
        "ip": "",
        "port": "27017",
        "dbname": "",
        "password": "",
        "user": "",
        "replicaset": ""
    },
    "Services": {
        "userserviceurl": "SYS_USERSERVICE_HOST",
        "userserviceport": 'SYS_USERSERVICE_PORT',
        "userserviceversion": "SYS_USERSERVICE_VERSION"
    }
};
