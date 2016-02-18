'use strict';

angular.module('myApp.login', ['ngRoute', 'firebase'])


.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl'
    });
}])

.controller('LoginCtrl', ['$scope', 'Auth', 'furl', '$firebaseObject', '$location', function($scope, Auth, furl, $firebaseObject, $location) {

//Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-73905053-1', 'auto');
  ga('require', 'linkid');
  ga('send', 'pageview', { page: $location.url() });


    var ref = new Firebase(furl);

    ref.onAuth(function(authData) {
        if (authData) {
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            ref.child("users").child(authData.uid).update({
                provider: authData.provider,
                name: getName(authData)
            });
        }
    });

  // expose logout function to scope
    $scope.logout = function() {
        Auth.$unauth();
        $location.path('/login');
    };
    // find a suitable name based on the meta info given by each provider
    function getName(authData) {
        switch (authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
            case 'google':
                return authData.google.displayName;
        }
    };

    $scope.createUser = function() {
        $scope.message = null;
        $scope.error = null;

        Auth.$createUser({
            email: $scope.email,
            password: $scope.password
        }).then(function(userData) {

            //log in user after registering
            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.password
            });
            $location.path('/account');


        }).catch(function(error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    $scope.message = "This Email is Already In Use";
                    break;
                case "INVALID_PASSWORD":
                    $scope.message = "You're Using The Wrong Password";
                    break;
                case "INVALID_EMAIL":
                    $scope.message = "This Email Isn't In Our Database";
                    break;
            }
            $scope.error = error;
        });
    };


    $scope.removeUser = function() {
        $scope.message = null;
        $scope.error = null;

        Auth.$removeUser({
            email: $scope.email,
            password: $scope.password
        }).then(function() {
            $scope.message = "User removed";
        }).catch(function(error) {
            $scope.error = error;
        });
    };

    $scope.authWithPassword = function() {
        $scope.message2 = null;
        $scope.error2 = null;

        Auth.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        }).then(function(loginData) {

            $location.path('/account');

        }).catch(function(error2) {
            console.log("Login Failed!", error2);
            switch (error2.code) {
                case "EMAIL_TAKEN":
                    $scope.message2 = "This Email is Already In Use";
                    break;
                case "INVALID_PASSWORD":
                    $scope.message2 = "You're Using The Wrong Password";
                    break;
                case "INVALID_EMAIL":
                    $scope.message2 = "This Email Isn't In Our Database";
                    break;
                case "INVALID_USER":
                    $scope.message2 = "This Email Isn't In Our Database";
                    break;
            }

            $scope.error = error2;
        });
    };

    $scope.facebookAuth = function() {
        var ref = new Firebase(furl);
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {

              //  console.log("Authenticated successfully with payload:", authData);
                $location.path('/account');
            }
        });
    };

    $scope.twitterAuth = function() {
        var ref = new Firebase(furl);
        ref.authWithOAuthPopup("twitter", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {

               // console.log("Authenticated successfully with payload:", authData);
                $location.path('/account');
            }
        });
    };

    $scope.googleAuth = function() {
        var ref = new Firebase(furl);
        ref.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {

               // console.log("Authenticated successfully with payload:", authData);
                $location.path('/account');
            }
        });
    };

}]);
