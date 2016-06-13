/**
 * Created by kiran on 11/4/16.
 */

homeModule.factory('homeSvc',function($http,$q){
   var homeSvc={};

    //login
    homeSvc.login= function(data){
      var deferred=$q.defer();
        //var data={email:'kiran.pawar@gmail.com',password:'kiran123'};
        $http.post('login',{data:data})
            .then(function(result){
                deferred.resolve(result);
            },function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    };

    //register
    homeSvc.register= function(data){
        var deferred=$q.defer();
        $http.post('create',{data:data})
            .then(function(result){
                deferred.resolve(result);
            },function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    };

    return homeSvc;
});