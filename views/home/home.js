'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl',
          resolve: {
            auth: ["Auth", function(Auth) {
                return Auth.$waitForAuth()
            }]
        }
    });
}])



.controller('HomeCtrl', ['$rootScope', '$scope', 'Auth', 'auth', '$location', function($rootScope, $scope, Auth, auth, $location) {
  
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


}]);