'use strict';

angular.module('myApp.users', ['ngRoute', 'firebase'])
    .factory('Users', function($firebaseArray, $firebaseObject, furl) {

        var usersRef = new Firebase(furl + '/users');
        var users = $firebaseArray(usersRef);
        var Users = {
            getProfile: function(uid) {
                return $firebaseObject(usersRef.child(uid));
            },
 
            all: users
        };

        return Users;

    });
