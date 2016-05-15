teamspeak-support-pokes
=======================

When a user joins a channel messages moderators

    {
      "address": "localhost",
      "queryport": 10011,
      "serverport": 9987,
      "username": "serveradmin",
      "botname": "BOT NAME",
      "password": "",
      "channelId": 1, // Channel to watch for
      "groupIds": [], // Group IDs that will receive messages
      "allowedGroupIds": [], // Group IDs allowed to use this, empty for al
      "noPermMessage": "You do not have permission to use this channel",
      "supportMessage": "{{username}} requires help", // message sent to moderators
      "acknowledgeMessage": "Support notified" // poke sent to client that joined
    }