var app = angular.module('challenger', ['btford.modal']);

// challenge schema:
//
// {
//    instructions: String
//    allowed: [String]
//    disallowed: [String]
//    nested: [{parent: String, child: String}]
// }
//

app.factory('Challenge', function() {
  
  var currChallenge;

  return {
    create: function(params) {
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

app.controller('CreateCtrl', function($scope, CreateModal, Challenge, $rootScope) {
  
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

    // create a new challenge object
    Challenge.create({
      instructions: $scope.instructions,
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

  $scope.challenge = Challenge.get();

  $scope.submitCode = function() {
    var syntax = esprima.parse($scope.code);
    console.log(syntax);
  }

  console.log("CURRENT CHALLENGE:", $scope.challenge );

});