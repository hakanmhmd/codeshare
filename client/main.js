import '../lib/collections.js';
Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
    this.render("navbar", {to: "navbar"});
    this.render("docList", {to: "main"});
});

Router.route('/documents/:_id', function(){
    Session.set("docid", this.params._id);
    this.render("navbar", {to: "navbar"});
    this.render("docItem", {to: "main"});
});

Meteor.setInterval(function () {
    Session.set("date", new Date());
}, 1000);

Template.editor.helpers({
    docid() {
        var doc;
        if (!Session.get("docid")) {
            doc = Docs.findOne();
            if (doc) {
                Session.set("docid", doc._id);
            }
        }
        return Session.get("docid");
    },

    config() {
        return function (editor) {
            editor.setOption("lineNumbers", true);
            editor.setSize(553, 498);
            editor.setOption("theme", "cobalt");
            editor.on("change", function (cm_editor, info) {
                $("#frame").contents().find("html").html(cm_editor.getValue());
                Meteor.call("addEditingUser", Session.get("docid"));
            });
        }
    }
});

Template.editableText.helpers({
    userCanEdit: function (doc, Collection) {
        doc = Docs.findOne({
            _id: Session.get("docid"),
            owner: Meteor.user().emails[0].address
        });
        if (doc) {
            return true;
        } else {
            return false;
        }
    }
});

Template.currentDoc.helpers({
    document() {
        return Docs.findOne({ _id: Session.get("docid") });
    },
    checkIt() {
        var doc = Docs.findOne({ _id: Session.get("docid") });
        if(doc.private)
            document.getElementsByClassName("js-toggle-private")[0].checked = true;
        else
            document.getElementsByClassName("js-toggle-private")[0].checked = false;
    },
    canTogglePrivacy() {
        var doc = Docs.findOne({ _id: Session.get("docid") });
        if (doc) {
            if (doc.owner == Meteor.user().emails[0].address) {
                return true;
            }
        }
        return false;
    }
});

Template.author.helpers({
    document() {
        return Docs.findOne({ _id: Session.get("docid") });
    }
});

Template.date.helpers({
    current_date() {
        return Session.get("date");
    }
});

Template.editingUsers.helpers({
    users() {
        var doc;
        if (!Session.get("docid")) {
            doc = Docs.findOne();
            if (doc) {
                Session.set("docid", doc._id);
            } else {
                return;
            }
        }
        var id = Session.get("docid");

        e_users = EditingUsers.findOne({ docid: id });
        if (!e_users) return;

        var users = new Array();
        for (var user in e_users.users) {
            users.push(e_users.users[user]);
        }
        //console.log(users);
        return users;
    }
});

Template.docList.helpers({
    documents() {
        return Docs.find({});
    }
});

Template.navbar.helpers({
    documents() {
        return Docs.find({});
    }
});

Template.insertCommentForm.helpers({
    docid() {
        return Session.get("docid");
    },
    getUser(){
        if(Meteor.user())
            return Meteor.user().emails[0].address;
        else return;
    },
    createdAt() {
        return new Date();
    }
});

Template.commentList.helpers({
    comments() {
        return Comments.find({docid: Session.get("docid")});
    },
    commentsCount(){
        return Comments.find({docid: Session.get("docid")}).count();
    }
});

Template.navbar.events({
    "click .js-add-doc": function (event) {
        event.preventDefault();
        if (!Meteor.user()) {
            alert("log in");
        } else {
            var id = Meteor.call("addDoc", function (err, res) { //asych methods
                if (!err) {
                    Session.set("docid", res);
                }
            });
        }
    },

    //"click .js-load-doc": function (event) {
        // console.log(this) -> prints a Doc object that has been clicked on
        //Session.set("docid", this._id);
    //},
});

Template.currentDoc.events({
    "click .js-toggle-private": function (event) {
        var doc = { _id: Session.get("docid"), private: event.target.checked };
        Meteor.call("updateDocPrivacy", doc, Meteor.user().emails[0].address);
    }
});
