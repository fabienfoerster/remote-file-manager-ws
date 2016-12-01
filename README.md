# remote-file-manager-ws

#Installation

Clone the repo and run npm install 

You should *REALLY* specify an env var for the secret use by JWT. The var name is JWT_SECRET

Then you should create a file named *users.json* like the following

```json
{
    "users" : {
        "username": "sha1(password)"
    }
}
```

Then you can run it

```
#you can specify $PORT if you want
node app.js
```

##Testing

To test the authentification you can use 
```
curl -X POST --data "username=xxx&password=xxx" http://localhost:8088/auth
```

Then you get the token, and can use it to connect to the secure endpoint
```
curl -H "Authorization: Bearer token" http://localhost:8088/files
```