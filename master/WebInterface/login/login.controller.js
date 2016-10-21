app.controller("loginctrl",function($scope,$resource,$state){
   
   
    $scope.submit=function()
    {
        

        // var uname = $scope.user.username;
        // var password = $scope.user.password;
     
        
        // if (uname == 'hardik' && password == '123') 
        // {
        //         alert('match');
        // }
        // else
        // {
        //     alert('not match');
        // }
        

a=$resource("https://jsonplaceholder.typicode.com/users");
        a.save($scope.user,function(res)
        {
            if(res.value == "s")
            {
                    $state.go("home");
                }
            else
                {
                    
                }

    }
});