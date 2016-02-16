'use strict';

angular.module('myApp.cabynOnePre', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cabyn-1-pre', {
        templateUrl: 'views/cabynOne/cabynOnePre.html',
        controller: 'CabynOPCtrl',
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



.controller('CabynOPCtrl', ['$rootScope', '$scope', 'Auth', 'furl', '$location', 'profile', 'auth', 'Users', '$firebaseObject', '$firebaseArray', function($rootScope, $scope, Auth, furl, $location, profile, auth, Users, $firebaseObject, $firebaseArray) {
 
    // $scope.profile = profile;
    // var inCabyn;
    // var geoRef = new Firebase(furl + "/geoFire/");
    // var geoFire = new GeoFire(geoRef);
    // var ref = new Firebase(furl + "/cabyns/");
    // $scope.cabyns = $firebaseArray(ref);
    // //see if user is in a cabyn
    // profile.cabyn == null ? inCabyn = false : inCabyn = true;
    // console.log("In Cabyn: " + inCabyn);
    // $scope.inCabyn = inCabyn;


    $scope.profile = profile;
    var inCabyn;
    var geoRef = new Firebase(furl + "/geoFire/");
    var geoFire = new GeoFire(geoRef);
    var ref = new Firebase(furl + "/cabyns/");
    $scope.cabyns = $firebaseArray(ref);

    //see if user is in a cabyn
    profile.cabynOne == null ? inCabyn = false : inCabyn = true;
    console.log("In Cabyn: " + inCabyn);
    $scope.inCabyn = inCabyn;

    //if In cabyn, reference user cabyn
    if (inCabyn == true) {
        $location.path("/cabyn-1");
    };
    //if In cabyn, reference user cabyn
    // if (inCabyn == true) {
    //     var k = profile.cabyn;
    //     var ref = new Firebase(furl + "/cabyns/" + k);
    //     $scope.userCabyn = $firebaseObject(ref);
    // } else {
    //     $location.path("/cabyn-1-pre");
    // };

    var usersRef1 = new Firebase(furl + "/cabyns/");
    var MemberNumber = []
    $scope.memberNumber = MemberNumber;
    usersRef1.once("value", function(allCabyns) {
        allCabyns.forEach(function(cabynSnapshot) {
            var members = cabynSnapshot.child("/members").numChildren();
            MemberNumber.push(members);
            //  console.log(childData);
        });
    });




    var geoQuery;
    var car = [];
    $scope.balls = car;
    var total = [];
    var sum = 0;


 

    geoQuery = geoFire.query({
        center: [profile.lat, profile.lon],
        radius: 24.1402
    });


    geoQuery.on("key_entered", function(key, location, distance) {
        console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
        var newRef = new Firebase(furl + "/cabyns/" + key);
        $scope.cabynArray = $firebaseObject(newRef);


        newRef.once("value", function(snapshot) {
            var members = snapshot.child("/members").numChildren();
 
            car.push({
                "cabyn": $scope.cabynArray,
                "members": members
            });
        });
 
    });

    geoQuery.on("key_exited", function(key, location, distance) {
        console.log(key, location, distance);
      //  console.log(key + " is located at [" + location + "] which is no longer within the query (" + distance.toFixed(2) + " km from center)");
    });


var tots = 0;
for (var i = 0; i < total.length; i++) {
    tots += total[i] << 0;
}





    $scope.join = function(value) {
        //update user CabynOne value
        var ref = new Firebase(furl + "/users/" + auth.uid);
        ref.update({
            cabynOne: value
        });

        $location.path("/cabyn-1");
    };

    $scope.leaveCabyn = function() {
        var ref = new Firebase(furl + "/users/" + auth.uid + "/cabyn/");
        ref.remove();
        location.reload();
    };

    var x = document.getElementById("demo");




    $scope.makeCabyn = function(cabyn) {
        //     var ref = new Firebase(furl + "/cabyns/");
        //     ref.push({
        //    name: cabyn.name,
        //     description: cabyn.description
        // });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function showPosition(position) {
            var ref = new Firebase(furl + "/cabyns/");
            var blarg = ref.push({
                name: cabyn.name,
                description: cabyn.description
            });
            var cabID = blarg.key();
            geoFire.set(cabID, [position.coords.latitude, position.coords.longitude]);

            var ref = new Firebase(furl + "/users/" + auth.uid);
            ref.update({
                cabynOne: cabID
            });
            location.reload();
        };
    };


    // process the form



    $scope.getLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showError);
            ref.update({
                "Latitude": position.coords.latitude,
                "Longitude": position.coords.longitude

            });


        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }

    };



    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    };






}]);
