var mongodb = require('mongodb');
var db;
exports.db= function() {
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame';
        var db1;

        return MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
                //return;
            } else {
                console.log("hello");
                return db;

            } //else
        });
         //MongoClient.connect


   //Connection
}; //constructor
