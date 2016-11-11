app.controller("registerctrl",function($scope,$resource,$state,$http,$location){
   
       
    $scope.submit=function()
    {
        console.log("hbkdj");
        var user = $scope.faculty;

        var a=$resource("localhost:3000/users");
        a.get(function(res){
            console.log(res);
        });
        //$scope.user = { "username" : "bjscdb", "password" : "25"};
        // var a=$resource("localhost:3000/users/register");

        // a.save($scope.user,function(res){
        //     console.log(res.Status);
        
        //     //$location.path('/registration/registration.html');
        // });

    }
    });