/**
 * Created by kiran on 11/4/16.
 */

homeModule=angular.module('homeModule',[]);

homeModule.controller('HomeController',function($scope,homeSvc){
   console.log('home controller');
    $scope.cards = [1,2,3,4,5,6,7];
    $scope.data={
        branches:['Hadpsar','Deccan','KP']
    }
    $scope.login = function(){
        var credentials = {email:'umar505@gmail.com',password:'umar123'}
        homeSvc.login(credentials).then(function(result){
            console.log("result : "+result);
        },function(error){
            console.log(error);
        });
    };

    $scope.signup = function(){
        var data={
            full_name:'Umar Memon',
            email:'umar505@gmail.com',
            password:'umar123',
            mobile:'9878676545',
            username:'umarmemon123'
        };
        homeSvc.register(data).then(function(result){
            console.log("result : "+result);
        },function(error){
            console.log(error);
        });
    };

});