var gauriTodo = angular.module('gauriTodo',[]);

//Controller to handle routes
function mainController($scope, $http) {
  $scope.formData = {};

  // when landing on the page, get all todos and show them
  $http.get('/api/todos')
  .success(function(data){
      $scope.todos = data;
      console.log(data);
  })
  .error(function(data){
      console.log('Error ' + data);
  });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function() {
      $http.post('/api/todos', $scope.formData)
          .success(function(data) {
              $scope.formData = {}; // clear the form so our user is ready to enter another
              $scope.todos = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });

       var stockdata = $scope.formData;
       console.log(stockdata.text);

       console.log("Angular is going to hit Node");
       $http({
          url: "/api/v1/stocks/info",
          method: "GET",
          params: {"symbol": stockdata.text}
        })
        // $http.get('/api/v1?symbol=TSLA')
        .success(function(data){
            console.log("Angular GET successful");
            // $scope.todos = data;
            console.log(data);
        })
        .error(function(data){
            console.log('Error ' + data);
        });

        console.log("Angular is going to hit Node with POST request");
        $http({
           url: "/api/v1/users",
           method: "POST",
           data : {"username" : "unclesam", "password": "unclesam", "email": "us@unclesam.com"},
           headers: {'Content-Type' :'application/json'}
           // params: {"symbol": stockdata.text}
         })
         // $http.get('/api/v1?symbol=TSLA')
         .success(function(data){
             console.log("Angular POST successful");
             // $scope.todos = data;
             console.log(data);
         })
         .error(function(data){
             console.log('Error ' + data);
         });

  };

  // delete a todo after checking it
  $scope.deleteTodo = function(id) {
      $http.delete('/api/todos/' + id)
          .success(function(data) {
              $scope.todos = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
  };

}
