'use strict';

angular.module('myApp.cabynTwoPre', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cabyn-2-pre', {
        templateUrl: 'views/cabynTwo/cabynTwoPre.html',
        controller: 'CabynTPCtrl',
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



.controller('CabynTPCtrl', ['$rootScope', '$scope', 'Auth', 'furl', '$location', 'profile', 'auth', 'Users', '$firebaseObject', '$firebaseArray', function($rootScope, $scope, Auth, furl, $location, profile, auth, Users, $firebaseObject, $firebaseArray) {

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

//Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-73905053-1', 'auto');
  ga('require', 'linkid');
  ga('send', 'pageview', { page: $location.url() });
  if ($rootScope.loggedIn == true) {
 ga('set', 'userId', auth.uid); // Set the user ID using signed-in user_id.
};

    $scope.profile = profile;
    var inCabyn;
    var geoRef = new Firebase(furl + "/geoFire/");
    var geoFire = new GeoFire(geoRef);
    var ref = new Firebase(furl + "/cabyns/");
    $scope.cabyns = $firebaseArray(ref);

    //see if user is in a cabyn
    profile.cabynTwo == null ? inCabyn = false : inCabyn = true;
 //   console.log("In Cabyn: " + inCabyn);
    $scope.inCabyn = inCabyn;

    //if In cabyn, reference user cabyn
    if (inCabyn == true) {
        $location.path("/cabyn-2");
    };
    //if In cabyn, reference user cabyn
    // if (inCabyn == true) {
    //     var k = profile.cabyn;
    //     var ref = new Firebase(furl + "/cabyns/" + k);
    //     $scope.userCabyn = $firebaseObject(ref);
    // } else {
    //     $location.path("/cabyn-2-pre");
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
            var AllAges = snapshot.child("/ages").val();
            var AverageAge = (AllAges / members);
            var averageAge = AverageAge.toFixed(0);
            car.push({
                "cabyn": $scope.cabynArray,
                "age": averageAge,
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
        //update user CabynTwo value
        var ref = new Firebase(furl + "/users/" + auth.uid);
        ref.update({
            cabynTwo: value
        });

        $location.path("/cabyn-2");
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
                cabynTwo: cabID
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
