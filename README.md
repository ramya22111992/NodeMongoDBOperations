This is the flow:

The router file receives the GET/PUT/POST/DELETE http request

The router file will forward the request to the appropriate controller.
The controller will perform any DB changes via the service. Controller will call the service method,
service will do the changes, return response to controller and controller will send the response to client.

The controller will return the success/error response back to the client.

service files ensure method reusability. Dont let the controllers interact with each other.
controllers must communicate with the service.

Make sure you have data/db directory in C drive.

To start the mongo server, we go to C:\Program Files\MongoDB\Server\4.0\bin and type mongod.exe.
This will start the mongo server on port 27017.

To start the mongo client, click mongo.exe in the bin folder. A tool will open and this will be the UI for you to enter
queries.

So the connection to the port will be complete once you open mongo.exe
To connect mongodb with Nodejs, you need to install the driver first via npm
npm install mongodb

------------------------------------------------------------------------
findById() will take only the value of the _id field. So you this method on the model if the _id value of the documents of the collection corresponding to this model is known

find() is used for querying any field in the collection and not just _id.

findByIdAndRemove() will also only take _id field value as argument to remove the document corresponding to the provided _id field value

remove() is used querying any field in the collection and then removing all documents that match the query.

updateMany() can be used to update all fields of the document. In some scenarios, you need to update a field which requires the document beforehand. In such cases updateMany() wont work. eg: removing a subdocument from an array of subdocuments. In that case go for save().

save() is a method used for updating a document too where updateMany() doesnt serve the purpose.

create() is used to create a new document in the collection. This method internally calls save().
