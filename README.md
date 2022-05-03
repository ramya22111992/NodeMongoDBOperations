This is the flow:

The router file receives the GET/PUT/POST/DELETE http request

The router file will forward the request to the appropriate controller for any post/update/create/delete changes to the DB. These changes will be done via the Models.

The controller will return the success/error response back to the client.

Make sure you have data/db directory in C drive.

To start the mongo server, we go to C:\Program Files\MongoDB\Server\4.0\bin and type mongod.exe.
This will start the mongo server on port 27017.

To start the mongo client, click mongo.exe in the bin folder. A tool will open and this will be the UI for you to enter
queries.

So the connection to the port will be complete once you open mongo.exe
To connect mongodb with Nodejs, you need to install the driver first via npm
npm install mongodb
