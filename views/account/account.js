'use strict';

angular.module('myApp.account', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/account', {
        templateUrl: 'views/account/account.html',
        controller: 'AccountCtrl',
        resolve: {
            auth: ["Auth", function(Auth) {
                return Auth.$requireAuth();
            }],
            profile: ["Users", "Auth", function(Users, Auth) {
                return Auth.$requireAuth().then(function(auth) {
                    return Users.getProfile(auth.uid).$loaded();
                });
            }]
        }
    });
}])



.controller('AccountCtrl', ['$rootScope', '$scope', 'Auth', 'furl', '$location', 'profile', 'auth', 'Users', '$firebaseObject', '$http', function($rootScope, $scope, Auth, furl, $location, profile, auth, Users, $firebaseObject, $http) {
   
//Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-73905053-1', 'auto');
  ga('require', 'linkid');
  ga('send', 'pageview', { page: $location.url() });
  ga('set', 'userId', auth.uid); // Set the user ID using signed-in user_id.


    $scope.profile = profile;
    // $scope.users = Users.all;

    if (profile.cabynOne) {
        var ref2 = new Firebase(furl + "/cabyns/" + profile.cabynOne);
        $scope.cabynOne = $firebaseObject(ref2);
    };

    // setTimeout(
    //     function() {
    //         if (profile.lat) {
    //             var latLon = {
    //                 lat: profile.lat.toFixed(4),
    //                 lon: profile.lon.toFixed(4)
    //             };
    //             $scope.latLon = latLon.lat + "    " + latLon.lon;
    //         };

    //     }, 5000);


    // $scope.formData = {email: "hi@you.com", status: "pending"};
 var inCabyn;
    var FormData = [];
    var nuts = $scope.profile.email;
    // var FormData = [
    //   { name: "email", value: profile.email },
    //   { name: "status", value: "subscribed" },
    //   { name: "fname", value: profile.displayName }
    // ];
    $scope.formData = FormData;

 var y = document.getElementById("profileAsk");

 if ((!profile.displayName) || (!profile.email) || (!profile.age)) {
      y.innerHTML = "- Please Fill Out Your Profile -";
  };



    //Saves any changes on Profile Page to Firebase
    $scope.updateProfile = function() {
        FormData.push({
            name: "email",
            value: profile.email
        }, {
            name: "status",
            value: "subscribed"
        }, {
            name: "fname",
            value: profile.displayName
        });

        $http({
            method: 'POST',
            dataType: "json",
            url: '../../assets/php/addemail.php',
            data: $.param($scope.formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            } // set the headers so angular passing info as form data (not request payload)
        });

    };

   var connectionStatusRef = new Firebase(furl + "/cabyns/" + profile.cabynOne + "/members/" + auth.uid);
    //Logs user out and returns them to login screen
    $scope.logout = function() {
       connectionStatusRef.update({
        s: "offline"
       })
        Auth.$unauth();
        $location.path('/login');
    };

    //Get location each time page is loaded
    var x = document.getElementById("demo");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    };

    $scope.getLocation = function() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);

        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    };


    var ref = new Firebase(furl + "/users/" + auth.uid);
    var userData = $firebaseObject(ref);


    function showPosition(position) {
        ref.update({
            "lat": position.coords.latitude,
            "lon": position.coords.longitude
        }, onComplete);

    };

    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
                var latLon = {
                lat: profile.lat.toFixed(4),
                lon: profile.lon.toFixed(4)
            }
            $scope.$apply(function () {
                $scope.latLon = latLon.lat + "    " + latLon.lon;
         })
        }
    };



    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "-Cabyn Needs Access To Your Location-"
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown location error occurred."
                break;
        }
    };



    // //for deleting empty cabyns
    // var usersUniqRef2 = new Firebase(furl + "/cabyns/" + profile.cabynOne);
    // //for deleting geoFire ref of empty cabyns
    // var geoUniqRef = new Firebase(furl + "/geoFire/" + profile.cabynOne);
    // //for deleting messages of empty cabyns
    // var messagesUniqRef = new Firebase(furl + "/messages/" + profile.cabynOne);
    // //for deleting Presence
    // var myUserRef = new Firebase(furl + "/cabyns/" + profile.cabynOne + "/members/" + auth.uid);


    // function removePresenceOperation(path, value) {
    //     var ref = new Firebase(path);
    //     ref.onDisconnect().cancel();
    //     ref.set(value);
     
    // };


    // //Leave Cabyn One
    // $scope.leaveCabynOne = function() {
    //      inCabyn = false;

    //     removePresenceOperation(myUserRef.toString(), null);

    //     var refer = new Firebase(furl + "/cabyns/" + profile.cabynOne + "/ages");
    //     refer.transaction(function(current_value) {
    //         return (current_value || 0) - profile.age;
    //     });
    //     var refer2 = new Firebase(furl + "/users/" + auth.uid);
    //     refer2.update({
    //         "aged1": false
    //     });
    //     var ref = new Firebase(furl + "/users/" + auth.uid + "/cabynOne/");
    //     ref.remove();
    //     var ref2 = new Firebase(furl + "/cabyns/" + profile.cabynOne + "/members/" + auth.uid);
    //     ref2.remove();

    //     usersUniqRef2.on("value", function(querySnapshot) {
    //         if (!(querySnapshot.child("/members").numChildren() > 0)) {
    //             usersUniqRef2.remove();
    //             geoUniqRef.remove();
    //             messagesUniqRef.remove();
    //         };
    //     });

    //     //window.location.replace("#/cabyn-1-pre");
    //     $location.path("/account");
    // };






}]);
