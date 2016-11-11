app.controller("registerctrl",function($scope,$resource,$state,$http,$location){
   
       
    $scope.redirect=function()
    {
        var user = $scope.faculty;
        //$scope.user = { "username" : "bjscdb", "password" : "25"};
        var a=$resource("https://shielded-tor-32602.herokuapp.com/users/register");

        a.save($scope.user,function(res){
         //   console.log(res.Status);
        
            $location.path('/registration/registration.html');
        });

    }
    });