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

  
  $scope.create = function() {
    Challenge.create($scope.params);
    CreateModal.deactivate();
  }

});

