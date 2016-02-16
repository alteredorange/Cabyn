'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.config',
    'myApp.users',
    'myApp.login',
    'myApp.cabynOne',
    'myApp.cabynOnePre',
    'myApp.account'
])

.factory("Auth", ["$firebaseAuth", "furl",
    function($firebaseAuth, furl) {
        var ref = new Firebase(furl);
        return $firebaseAuth(ref);
    }
])



.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
        redirectTo: '/login'
    });
        // use the HTML5 History API
      //  $locationProvider.html5Mode(true);
}])



.run(['$rootScope', 'Auth', '$location', 'furl', '$firebaseObject', function($rootScope, Auth, $location, furl, $firebaseObject) {

    // track status of authentication
    Auth.$onAuth(function(user) {
        $rootScope.loggedIn = !!user;
        console.log("Logged In: " + $rootScope.loggedIn);
    });

    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });

    $rootScope.$on("$routeChangeSuccess", function(event, next, previous, error) {
 
 // var userID = furl + "/users/" + Auth.uid;
      
 //        var ref = new Firebase(userID);
        // var authData = $firebaseObject(ref);

 // var path = $location.path();
 //  if (path == "/cabyn-1" && !authData.cabyn) {
 //                $location.path("/cabyn-1-pre");
 //            };
// setTimeout(function() {
// console.log(authData);
// }, 900);



    });
       
 // Load the Footer after other content
    //     setTimeout(function() {
    //         $(".footer").show();
    //     }, 900);
    // });

}]);
