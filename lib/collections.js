import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

this.Docs = new Mongo.Collection('documents');
EditingUsers = new Mongo.Collection('editingUsers');
Comments = new Mongo.Collection('comments');

Comments.attachSchema(new SimpleSchema({
    title:{
        type:String,
        label:"Title",
        max:200
    },
    body: {
        type:String,
        label: "Comment",
        max:1000
    },
    docid: {
        type: String,
    },
    user: {
        type: String,
    },
    createdAt: {
        type: String,
    }
}));

SimpleSchema.debug = true