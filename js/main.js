var app = angular.module('challenger', ['btford.modal']);

// challenge schema:

//allowed commands
//disallowed commands
//required combinations

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
    templateUrl: 'views/create.html'
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

