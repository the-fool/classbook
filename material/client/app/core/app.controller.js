(function () {
    'use strict';

    angular.module('app')
    .controller('AppCtrl', [ '$scope', '$rootScope', '$state', '$document', 'appConfig', 'AuthService', AppCtrl]) // overall control
    
    function AppCtrl($scope, $rootScope, $state, $document, appConfig, AuthService) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;

        $scope.$watch('main', function(newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
            $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
            if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                $scope.main.fixedHeader = true;
                $scope.main.fixedSidebar = true;
            }
            if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                $scope.main.fixedHeader = false;
                $scope.main.fixedSidebar = false;
            }
            }
            if (newVal.fixedSidebar === true) {
            $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
            $scope.main.fixedSidebar = false;
            }
        }, true);
    
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            AuthService.checkSession();
            
            if (toState.authenticate && !AuthService.isAuthenticated()){
      
                // User isn’t authenticated
                $state.transitionTo('page/signin');
                event.preventDefault(); 
            }
        });

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {

            if (currentRoute.authenticate && !AuthService.isAuthenticated()){
                $state.transitionTo('page/signin');
                event.preventDefault(); 
            }else{
                $document.scrollTo(0, 0);
            }
        });

        $rootScope.$on('$stateChangeError', function(event) {
            $state.transitionTo('page/404');
            event.preventDefault(); 
        });
    }

})(); 