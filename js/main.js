var app = angular.module('challenger', ['btford.modal']);

// challenge schema:
//
// {
//    instructions: String,
//    allowed: [String],
//    disallowed: [String],
//    nested: [{parent: String, child: String}]
// }
//

app.filter('printNestedReq', function() {
  return function(nestedReq) {
    return nestedReq.parent + " with a " + nestedReq.child + " statement inside of it";
  }
})

// Editor factory for managing the ACE editor
app.factory('Editor', function() {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/twilight");
  editor.session.setMode("ace/mode/javascript");
  return {
    get: function() {
      return editor.getValue();
    },
    set: function(code) {
      editor.setValue(code);
    }
  };
});

// Challenge factory for saving and updating the challenge contents
app.factory('Challenge', function() {
  
  var currChallenge = {
    instructions: "Create a while loop with an if statement inside of it.",
    allowed: ["while","if"],
    notallowed: ["for"],
    nested: [ { parent:"while", child: "if" } ]
  };

  // search function looks within a syntax node to find an item
  function search(syntax, keyword) {
    // create type from keyword given
    var type = keyword[0].toUpperCase() + keyword.slice(1) + "Statement";

    var q = [syntax];
    while (q.length) {
      var curr = q.pop();
      if (curr.type === type) return curr;
      if (curr.body) q = q.concat(curr.body);
    }
    return false;
  }

  return {
    create: function(params) {
      currChallenge = params;
    },
    get: function(){
      return currChallenge;
    },
    check: function(code) {
      var syntax = esprima.parse(code);

      var allowedIncluded = currChallenge.allowed ? currChallenge.allowed.every(function(keyword) {
        return search(syntax, keyword);
      }) : true;

      var notAllowedNotIncluded = currChallenge.notallowed ? currChallenge.notallowed.every(function(keyword) {
        return !search(syntax, keyword);
      }) : true;

      var nestingsIncluded = currChallenge.nested ? currChallenge.nested.every(function(nested) {
        return search( search(syntax, nested.parent), nested.child);
      }) : true;

      return [allowedIncluded, notAllowedNotIncluded, nestingsIncluded];
    }
  }

});

// Modal for creating a new challenge
app.factory('CreateModal', function (btfModal) {
  return btfModal({
    controller: 'CreateCtrl',
    templateUrl: 'challenge-framework/js/views/create.html'
  });
});

// controller for the modal - creates and saves new challenges
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

    // add parameters provided in form
    var newChallenge = {};
    if ($scope.instructions) newChallenge.instructions = $scope.instructions;
    if ($scope.allowed) newChallenge.allowed = parseList($scope.allowed);
    if ($scope.notallowed) newChallenge.notallowed = parseList($scope.notallowed);
    if ($scope.nested) newChallenge.nested = parseNested($scope.nested);

    // create a new challenge object
    Challenge.create(newChallenge);

    // close the modal
    CreateModal.deactivate();

  }

});

// challenge controller for the main page
app.controller('ChallengeCtrl', function($scope, CreateModal, Challenge, Editor) {
  
  $scope.getChallenge = Challenge.get;

  $scope.createNew = function() {
    if( window.confirm('Are you sure? Previous challenge will be lost!') ) { 
      CreateModal.activate();
    }
  }

  $scope.submitCode = function() {
    var code = Editor.get();
    var correct = Challenge.check(code);

    $scope.success = false;
    
    $scope.messages = [];
    if (!correct[0]) $scope.messages.push("You're missing one of the required arguments... ");
    if (!correct[1]) $scope.messages.push("You included something you're not supposed to... ");
    if (!correct[2]) $scope.messages.push("Hm, this problem requires some specific nesting. Check again.");
    if (!$scope.messages.length) $scope.success = true;
  }

});