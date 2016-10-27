

app.controller("loginctrl",function($scope,$resource,$state,$http){
   
   





       
    $scope.submit=function()
    {
        var user = $scope.user;
        console.log($scope.user);

        //$scope.user = { "username" : "bjscdb", "password" : "25"};
        var a=$resource("https://shielded-tor-32602.herokuapp.com/users/login");

        a.save($scope.user,function(res){
            console.log(res.Status);

            if(res.Status == false){
                alert("Please check username and password");
            }else{
                alert("Successful");
            }
        });

        // var a=$resource("https://blooming-springs-95211.herokuapp.com/users");
        // a.get(function(res){
        //     console.log(res);
        // });
    }
  // $http.get("https://blooming-springs-95211.herokuapp.com/users/login").then(function (response) {
  //     $scope.myData = response.data;
      
  // });
    
//   $http.post("https://blooming-springs-95211.herokuapp.com/users/login", $scope.user, config)
//    .then(
//        function(response){
//          console.log(response.Status);
//        }, 
//        function(response){
//          console.log(response.Status);
//        } 
//     );
// }

        

    //     var uname = $scope.user.username;
    //     var password = $scope.user.password;
     
        
    //     if (uname == 'hardik' && password == '123') 
    //     {
    //             alert('match');
    //     }
    //     else
    //     {
    //         alert('not match');
    //     }
        
    
    //     alert(JSON.stringfy($scope.user));
    //     a=$resource("https://blooming-springs-95211.herokuapp.com/");
    //     a.query($scope.user,function(res)
        
    //     {











    //         // if(res.value == "s")
    //         // {
    //         //         $state.go("home");
    //         //     }
    //         // else
    //         //     {
                    
    //         //     }

    // })
//}
});