var app = angular.module('challenger', ['btford.modal']);

// // challenge schema:

// //allowed [String]
// //disallowed [String]
// //required [{parent: String, child: String}]

app.factory('Challenge', function() {
  
  var currChallenge;

  return {
    create: function(params) {
      console.log("params: ", params)
      currChallenge = params;
    },
    get: function(){
      return currChallenge;
    }
  }

});

app.factory('CreateModal', function (btfModal) {
  return btfModal({
    controller: 'CreateCtrl',
    templateUrl: 'challenge-framework/js/views/create.html'
  });
});

app.controller('CreateCtrl', function($scope, CreateModal, Challenge) {
  
  // parse user input into a list of items
  function parseList(str) {
    return str.split(/[,\s]+/);
  }

  // parse user input into a list of parent/child objects
  function parseNested(str) {
    var list = parseList(str);
    return list.map(function(item) {
      var items = item.split(/[\s>\s]+/);
      return { parent: items[0], child: items[1] }
    });
  }

  $scope.create = function() {
    console.log($scope.allowed, $scope.notallowed, $scope.nested)
    // create a new challenge object
    Challenge.create({
      allowed: parseList($scope.allowed),
      notallowed: parseList($scope.notallowed),
      nested: parseNested($scope.nested)
    });
    // close the modal
    CreateModal.deactivate();
  }

});

app.controller('ChallengeCtrl', function($scope, CreateModal, Challenge) {
  
  $scope.createNew = function() {
    var confirm = window.confirm('Are you sure? Previous challenge will be lost!');
    if (confirm) CreateModal.activate();
  }
  console.log(Challenge.get())

});