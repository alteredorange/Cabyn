'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.config',
    'myApp.home',
    'myApp.users',
    'myApp.login',
    'myApp.cabynOne',
    'myApp.cabynOnePre',
    'myApp.cabynTwo',
    'myApp.cabynTwoPre',
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
        redirectTo: '/home'
    });
       // use the HTML5 History API
       $locationProvider.html5Mode(true);
}])


.directive('isActiveNav', [ '$location', function($location) {
return {
 restrict: 'A',
 link: function(scope, element) {
   scope.location = $location;
   scope.$watch('location.path()', function(currentPath) {
     if((currentPath === element[0].attributes['href'].nodeValue) || (currentPath === element[0].attributes['href'].nodeValue + '-pre')){

       element.parent().addClass('active');
     } else {

       element.parent().removeClass('active');
     }
   });
 }
 };
}])

.directive('isHome', [ '$location', function($location) {
return {
 restrict: 'A',
 link: function(scope, element) {
   scope.location = $location;
   scope.$watch('location.path()', function(currentPath) {
     if (currentPath === '/home') {

       element.addClass('bugaloooo');
     } else {
       element.removeClass('bugaloooo');
     }
   });
 }
 };
 }])

.directive('isAd', [ '$location', function($location) {
return {
 restrict: 'A',
 link: function(scope, element) {
   scope.location = $location;
   scope.$watch('location.path()', function(currentPath) {
     if ((currentPath === '/home') || (currentPath === '/login')) {

       element.addClass('adTime');
     } else {
       element.removeClass('adTime');
     }
   });
 }
 };
}])

.controller('MainCtrl', ['$rootScope', '$scope', 'Auth', function($rootScope, $scope, Auth) {
var billa = true;


}])

.run(['$rootScope', 'Auth', '$location', 'furl', '$firebaseObject', function($rootScope, Auth, $location, furl, $firebaseObject) {
var billa = true;


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
