var app=angular.module("myApp",['ui.router','ngResource']);
app.config(function($stateProvider, $urlRouterProvider,$resourceProvider) {
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login/login.html',
            controller:'loginctrl'
        })
        .state('register',{
        url: '/registration',
        templateUrl: 'registration.html',
        controller: 'registerctrl'
    })
        
        $urlRouterProvider.otherwise('/login');

        $resourceProvider.defaults.stripTrailingSlashes = false;
        
});

app.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
