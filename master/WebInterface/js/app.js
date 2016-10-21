var app=angular.module("myApp",['ui.router','ngResource']);
app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller:'loginctrl'
        })
        .state('register',{
        url: '/registration',
        templateUrl: 'registration.html',
        controller: 'registerctrl'
    })
        
        $urlRouterProvider.otherwise('/login');
        
});
