/**
 * Created by ravi on 9/18/15.
 */

"use strict"; ///

// load application modules
var myApp = angular.module('myApp', [
    'ui.router',    // for routing purpose angular ui module
    'ui.bootstrap',   // all bootstrap modules with theri inbuild templating
    'LayoutModule',
    'homeModule',
    'userModule'
]);

// config angular app
myApp.config(['$provide', '$httpProvider', '$stateProvider','$urlRouterProvider','$tooltipProvider', function($provide, $httpProvider, $stateProvider, $urlRouteProvider) {

    console.log('in app.js');

    //$urlRouteProvider.otherwise('/scrollbar');

    $urlRouteProvider.otherwise('/');
    $stateProvider
        .state('veg', {
            url: '/',
            templateUrl: 'app/appModules/LayoutModule/Layout_1.html',
            abstract: true,
            controller:'LayoutCtrl'
        })
        .state('veg.home', {
            url: '',
            templateUrl: 'app/appModules/homeModule/home.html',
            controller: 'HomeController'
        })
        .state('user',{
            url : '',
            templateUrl: 'app/appModules/LayoutModule/UserLayout.html',
            abstract: true
        })
        .state('user.registration',{
            url: '/userregistration',
            templateUrl: 'app/appModules/userModule/userRegistration.html',
            controller: 'RegistrationController'
        });


    ///////////////////////////////////////////////////////////////////
    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function ($q, $window, appConfig) {
        return {

            // On request success
            request: function (config) {
                if (!(config.url.toLowerCase().indexOf('.html') >= 0)) {
                    var userInfo = angular.fromJson($window.sessionStorage["activeUserInfo"]);
                    config.url = appConfig.apiUrl + config.url;
                    if (userInfo) {
                        //config.headers['token'] = userInfo.accessToken;
                        //config.headers['x-secret'] = userInfo.accessSecret;
                        //config.headers['email'] = userInfo.email;
                    } else {
                        //return $q.reject({authenticated: false});
                    }

                    // enable cors in angular
                    $httpProvider.defaults.useXDomain = true;
                    //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

                    delete $httpProvider.defaults.headers.common['X-Requested-With'];
                }
                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                // loader hide
                //document.getElementById('loadingSpinner').style.display='none';
                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                // loader hide
                //$("#loadingSpinner").hide();
                //document.getElementById('loadingSpinner').style.display='none';

                //console.log("in response SUCCESS config of http");
                //console.log(response); // Contains the data from the response.
                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failture
            responseError: function (rejection) {
                // loader hide
                //$("#loadingSpinner").hide();
                //document.getElementById('loadingSpinner').style.display='none';

                //console.log("in response ERROR config of http");
                //console.log(rejection); // Contains the data about the error.
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');
    ///////////////////////////////////////////////////////////////////

}]);


// application config for run time
myApp.run(["$rootScope", "$state", "$templateCache", function ($rootScope, $state, $templateCache) {


    //$rootScope.$on('$viewContentLoaded', function() {
    //    $templateCache.removeAll();
    //});


    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
        // We can prevent this state from completing
        //evt.preventDefault();
    });

    $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
        // We can prevent this state from completing
        //evt.preventDefault();
    });

    $rootScope.$on('$stateChangeError', function(evt, toState, toParams, fromState, fromParams, eventObj) {
        evt.preventDefault();
        console.log("inside state change Error");
        // if authenticated is true in error mode then go to home state
        // means user verified.
        //console.log(eventObj);
        if (eventObj.authenticated === true){
            $state.go('rejoyos.home');
        }else if(eventObj.authenticated === false){
            $state.go('login')
        }else if(eventObj.authAdmin === false){
            $state.go('error', {'code': 401})
        }
    });


    // view rendering events
    // on start dom rendering
    $rootScope.$on('$viewContentLoading',
        function(event, viewConfig){
            //console.log("start loading ---- ");
            //console.log(event);
            //console.log(viewConfig);
            //console.log("end loading ---- ");
            // Access to all the view config properties.
            // and one special property 'targetView'
            // viewConfig.targetView
        });


    // on start dom rendering
    $rootScope.$on('$viewContentLoaded',
        function(event, viewConfig){
            //console.log("done loading ---- ");
            //console.log(event);
            //console.log(viewConfig);
            //console.log("end loading ---- ");
            // Access to all the view config properties.
            // and one special property 'targetView'
            // viewConfig.targetView
        });

}]);


//////////////// declaration of app level constants /////////////////////////
myApp.constant("appConfig", {
    appName: "Rejoyos Desktop",
    appVersion: 1.0,
    searchTimeout: 700,
    apiUrl: "http://localhost:8181/"
    //apiUrl: "http://wowmedals.com/app/api/v1/"
    //apiUrl: "http://wowmedals.com:3000/api/sv1/"
    //apiUrl: "http://192.168.0.110:3000/api/]v1/"
});
