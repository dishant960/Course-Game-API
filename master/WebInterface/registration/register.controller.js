app.controller("registerctrl",function($scope,$resource,$state){
   
  


   $scope.redirect = function(){
   window.location = "registration.html";
   }
   

    $scope.submit=function()
    {
        

         vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
        
    }
});