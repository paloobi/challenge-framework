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
  
  var currChallenge;

  // search function looks within a syntax node to find an item
  function search(syntax, keyword) {
    // create type from keyword given
    var type = keyword[0].toUpperCase() + keyword.slice(1) + "Statement";

    var q = [syntax];
    console.log('entered');
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
      var syntax = esprima.parse(code, {tokens: true});

      var allowedIncluded = currChallenge.allowed.every(function(keyword) {
        return search(syntax, keyword);
      });

      var notAllowedNotIncluded = currChallenge.notallowed.every(function(keyword) {
        return !search(syntax, keyword);
      });

      var nestingsIncluded = currChallenge.nested.every(function(nested) {
        return search( search(syntax, nested.parent), nested.child);
      });

      return ( allowedIncluded && notAllowedNotIncluded && nestingsIncluded );
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

// challenge controller for the main page
app.controller('ChallengeCtrl', function($scope, CreateModal, Challenge, Editor) {
  
  $scope.createNew = function() {
    var confirm = window.confirm('Are you sure? Previous challenge will be lost!');
    if (confirm) CreateModal.activate();
  }

  $scope.submitCode = function() {
    console.log("submitting code");
    var code = Editor.get();
    console.log('contents are: ' + code);
    console.log('runnning check');
    Challenge.check(code)
  }

});