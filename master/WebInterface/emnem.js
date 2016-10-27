var user = $scope.user;
        console.log($scope.user);
        
        $scope.user = { "username" : "bjscdb", "password" =}
        var a=$resource("localhost:3000/users/login");
        a.save($scope.user,function(res){
            console.log(JSON.stringfy(res));
        });