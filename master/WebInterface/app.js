var app=angular.module("myApp",['ui.router','ngResource']);
app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller:'C1'
        })
        .state('register',{
        url: '/registration',
        templateUrl: 'registration.html',
        controller: 'C1'
    })
        
        $urlRouterProvider.otherwise('/login');
        
});

app.controller("C1",function($scope,$resource,$state){
   
    $scope.abc="def";
    $scope.submit=function()
    {
        
        alert(JSON.stringify($scope.user));
        a=$resource("https://jsonplaceholder.typicode.com/users");
        a.save($scope.username,function(res)
        {
            if(res.value == "s")
            {
                    $state.go("register");
                }
            else
                {
                    
                }
            
        })
        
    }
});