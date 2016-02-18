'use strict';

angular.module('myApp.cabynTwo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cabyn-2', {
        templateUrl: 'views/cabynTwo/cabynTwo.html',
        controller: 'CabynTwoCtrl',
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



.controller('CabynTwoCtrl', ['$rootScope', '$scope', 'Auth', 'furl', '$location', 'profile', 'auth', 'Users', '$firebaseObject', '$firebaseArray', '$compile', function($rootScope, $scope, Auth, furl, $location, profile, auth, Users, $firebaseObject, $firebaseArray, $compile) {

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
    var inCabyn;
    var geoRef = new Firebase(furl + "/geoFire/");
    var geoFire = new GeoFire(geoRef);
    var ref = new Firebase(furl + "/cabyns/");
    $scope.cabyns = $firebaseArray(ref);

    //see if user is in a cabyn
    profile.cabynTwo == null ? inCabyn = false : inCabyn = true;
  //  console.log("In Cabyn: " + inCabyn);
    $scope.inCabyn = inCabyn;


//get the average age
    var totalMemberRef = new Firebase(furl + "/cabyns/" + profile.cabynTwo);
      totalMemberRef.on("value", function(querySnapshot) {
          var AllMembers = querySnapshot.child("/members").numChildren();
            var AllAges = querySnapshot.child("/ages").val();
          var AverageAge = (AllAges / AllMembers);
          $scope.averageAge = AverageAge.toFixed(0);
      });

    //if In cabyn, reference user cabyn
    if (inCabyn == true) {
        var k = profile.cabynTwo;
        var ref = new Firebase(furl + "/cabyns/" + k);
        $scope.userCabyn = $firebaseObject(ref);

        if (profile.aged2 !== true) {
            var refer = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/ages");
            refer.transaction(function(current_value) {
                return (current_value || 0) + profile.age;
            });
            var refer2 = new Firebase(furl + "/users/" + auth.uid);
            refer2.update({
                "aged2": true
            });
        };


    } else {
        $location.path("/cabyn-2-pre");
    };





    var eventsRef = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/events/");
    var Events = $firebaseArray(eventsRef);
    $scope.events = Events;



    $scope.addEvent = function(event) {
        eventsRef.push({
            text: event.text
            });
        event.text = '';
    };

   $scope.deleteEvent = function(value) {
      var ref3 = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/events/" + value);
      ref3.remove();
      };


    function removePresenceOperation(path, value) {
        var ref = new Firebase(path);
        ref.onDisconnect().cancel();
        ref.set(value);
    };


 


//for deleting empty cabyns
var usersUniqRef2 = new Firebase(furl + "/cabyns/" + profile.cabynTwo);
//for deleting geoFire ref of empty cabyns
var geoUniqRef = new Firebase(furl + "/geoFire/" + profile.cabynTwo);
//for deleting messages of empty cabyns
var messagesUniqRef = new Firebase(furl + "/messages/" + profile.cabynTwo);
//for deleting undefined cabyns
var undefinedRef = new Firebase(furl + "/cabyns/undefined")


    $scope.leaveCabyn = function() {
        inCabyn = false;

        removePresenceOperation(myUserRef.toString(), null);

        var refer = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/ages");
        refer.transaction(function(current_value) {
            return (current_value || 0) - profile.age;
        });
        var refer2 = new Firebase(furl + "/users/" + auth.uid);
        refer2.update({
            "aged2": false
        });
        var ref = new Firebase(furl + "/users/" + auth.uid + "/cabynTwo/");
        ref.remove();
        var ref2 = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/members/" + auth.uid);
        ref2.remove();

        usersUniqRef2.on("value", function(querySnapshot) {
          if (!(querySnapshot.child("/members").numChildren() > 0)) {
             usersUniqRef2.remove();
            geoUniqRef.remove();
            messagesUniqRef.remove();
               undefinedRef.remove();
          };
        });

        //window.location.replace("#/cabyn-2-pre");
        $location.path("/cabyn-2-pre");
    };






    var usersRef1 = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/members/" + auth.uid);
    var usersRef = new Firebase(furl + "/cabyns/" + profile.cabynTwo + "/members/");
    var connectedRef = new Firebase("https://mwymi.firebaseio.com//.info/connected");
    //var connectedRef = new Firebase(furl + "/info/connected/" + auth.uid + "/online/");

    var connected = $firebaseObject(connectedRef);
    var online = $firebaseArray(usersRef);
    $scope.members = online;
    var currentStatus = "on";
    var blurp = $firebaseObject(usersRef1);
    var myUserRef = usersRef1;

    var updateCount = 0;
    var title = document.title;

    // CREATE A REFERENCE TO FIREBASE
    var messagesRef = new Firebase(furl + "/messages/" + profile.cabynTwo);


    // REGISTER DOM ELEMENTS
    var messageField = $('#messageInput');

    var messageList = $('#example-messages');

    var eventsList = $('#event-messages');

  //  var userid = false;
    // LISTEN FOR KEYPRESS EVENT
    messageField.keypress(function(e) {
        if (e.keyCode == 13) {
       //     userid = true;
            //FIELD VALUES
            var username = profile.displayName;
            var message = messageField.val();
            //Anchor JS looks for any links and adds html tags to them (https://github.com/ali-saleem/anchorme.js)
            var messageLinked = anchorme.js(message, {
                "id": "messageText",
                "target": "_blank"
            });

            //SAVE DATA TO FIREBASE AND EMPTY FIELD
            messagesRef.push({
                name: username,
                text: messageLinked
            });
            messageField.val('');
        }
    });

// //add events to the DOM
// eventsRef.on('child_added', function(snapshot){
// var data = snapshot.val();
// var key = snapshot.key();
// var href= $();
// var eventstuff = data.text;
// var eventid = data.$id;

// var eventElement = $("<div class='well well-sm eventsWells'>");

// var deleteButton = $("<div class='panel'><a style='float:right; color:#348CD9; margin-top:3px;' href='' ng-click='deleteEvent(\""+key+"\")'>DELETE</a></div>");


// //var deleteButton = $("<div class='panel'><a style='float:right; color:#348CD9; margin-top:3px;' href='' ng-click=\"deleteEvent("+key+")\">DELETE</a></div>");

// $compile(deleteButton)($scope);  //here
// $compile(eventElement)($scope);  //here
// eventElement.html(eventstuff).append(deleteButton);
// eventsList.append(eventElement);
// });

    // Add a callback that is triggered for each chat message.
    messagesRef.limitToLast(20).on('child_added', function(snapshot) {
        //GET DATA
        var data = snapshot.val();
        var username = data.name;
        var message = data.text;

        //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        // if (userid == true) {
        //     var messageElement = $("<li class='me'>"); // Same id means it's me
        //     var nameElement = $("<strong class='example-chat-username'></strong>")
        //     nameElement.text("You:");
        //     messageElement.html(message).prepend(nameElement);
        // } else {
            var messageElement = $("<li>");
            var nameElement = $("<strong class='example-chat-username'></strong>")
            nameElement.text(username + ":");
            messageElement.html(message).prepend(nameElement);
    //    };

        //ADD MESSAGE
        messageList.append(messageElement)

        if (blurp.s == 'away') {
            updateCount++;
            var newTitle = '(' + updateCount + ') ' + title;
            document.title = newTitle;
        };

        //SCROLL TO BOTTOM OF MESSAGE LIST
        messageList[0].scrollTop = messageList[0].scrollHeight;
    });

      if (inCabyn == true) {
    connectedRef.on("value", function(isOnline) {


        console.log(inCabyn + "RIGHT");
        if (isOnline.val()) {

            // If we lose our internet connection, we want ourselves removed from the list.
            myUserRef.onDisconnect().update({
                d: profile.displayName,
                s: "offline"
            });
            // Set our initial online status.
            setUserStatus("on");
        } else {
            // We need to catch anytime we are marked as offline and then set the correct status. We
            // could be marked as offline 1) on page load or 2) when we lose our internet connection
            // temporarily.
            setUserStatus(currentStatus);
        }


    });
};

    // A helper function to let us set our own state.
    function setUserStatus(status) {
        // Set our status in the list of online users.
        if (inCabyn == true) {
            currentStatus = status;
            myUserRef.update({
                d: profile.displayName,
                s: status
            });
        };
    };


    $(function() {
        function setMessage(msg) {
            $('#ActivityList').append("<li>" + new Date().toTimeString() + ": " + msg + "</li>");
        };
        var awayCallback = function() {
            if (currentStatus !== "offline") {
                setUserStatus("away");
            };

        };
        var awayBackCallback = function() {

            setUserStatus("on");
            updateCount = 0;
            var newTitle = title;
            document.title = newTitle;
        };
        var hiddenCallback = function() {

            setUserStatus("away");
        };
        var visibleCallback = function() {

            setUserStatus("on");
            updateCount = 0;
            var newTitle = title;
            document.title = newTitle;
        };

        var idle = new Idle({
            onHidden: hiddenCallback,
            onVisible: visibleCallback,
            onAway: awayCallback,
            onAwayBack: awayBackCallback,
            awayTimeout: 10000 //away with default value of the textbox
        }).start();

    });







}]);
