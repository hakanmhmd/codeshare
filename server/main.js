import '../lib/collections.js';
Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.publish("documents", function () {
    var user;
    if (this.userId) {
        user = Meteor.users.findOne(this.userId);
    }
    return Docs.find({
        $or: [{ private: false }, { owner: user.emails[0].address }]
    });
});

Meteor.publish("editingUsers", function () {
    return EditingUsers.find();
});

Meteor.publish("comments", function() {
    return Comments.find();
});
