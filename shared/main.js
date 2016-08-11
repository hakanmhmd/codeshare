import '../lib/collections.js';
Meteor.methods({
    addEditingUser: function (id) {
        if (!this.userId) return; //not logged in
        var user = Meteor.user().profile;
        var e_users = EditingUsers.findOne({ docid: id });
        if (!e_users) {
            e_users = {
                docid: id,
                users: {}
            };
        }
        user.email = Meteor.user().emails[0].address;
        user.lastEdited = new Date();
        e_users.users[this.userId] = user;


        EditingUsers.upsert({ _id: e_users._id }, e_users); // insert only if the user is not in the collection
    },

    addDoc: function () {
        var doc;
        if (!this.userId) {
            return;
        } else {
            doc = {
                owner: Meteor.users.findOne(this.userId).emails[0].address,
                createdAt: new Date(),
                title: "MY TITLE",
                private: false,
            };

            var id = Docs.insert(doc);
            return id;
            //console.log(id);
        }
    },

    updateDocPrivacy: function (doc, author) {
        //console.log(doc);
        var dbDoc = Docs.findOne({ _id: doc._id, owner: author });
        if (dbDoc) {
            dbDoc.private = doc.private;
            Docs.update({ _id: doc._id }, dbDoc);
        }
    },

    addComment: function(comment){
        if(this.userId){
            return Comments.insert(comment);
        }
        return;
    }
});//Meteor methods