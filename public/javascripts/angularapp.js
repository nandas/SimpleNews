var myApp = angular.module('news',['ui.router']);

myApp.config([
    '$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {


    $stateProvider.state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'Main',
        resolve: {
            postPromise: ['posts', function(posts){
                return posts.getAll();
            }]
        }
    });

    $stateProvider.state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts) {
                return posts.get($stateParams.id);
            }]
        }
    });

  $urlRouterProvider.otherwise('home');
}])


myApp.factory('posts',['$http',function($http){
    var o = {
        posts: []
    };

    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };

    o.create = function(post) {
        return $http.post('/posts', post).success(function(data){
            o.posts.push(data);
        });
    };

    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upVote')
            .success(function(data){
                post.upvotes += 1;
            });
    };

    o.downvote = function(post) {
        return $http.put('/posts/' + post._id + '/downVote')
            .success(function(data){
                post.downvote -= 1;
            });
    };

    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    return o;
}])

myApp.controller('Main',['$scope','posts',function($scope, posts){
    $scope.test='My first angular project';
    
    $scope.posts = posts.posts;

    $scope.addVote = function(post) {
        posts.upvote(post);
    };

    $scope.downVote = function(post) {
        posts.downvote(post);
    };

    
    $scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
        posts.create({
        // $scope.posts.push({
    title: $scope.title,
    downvote: 0,
    upvotes: 0
  });
  $scope.title = '';
  
};
}])

myApp.controller('PostsCtrl', ['$scope','posts','post',function($scope, posts, post){
        $scope.post = post;

        $scope.addComment = function(){
            if($scope.body === '') { return; }
            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user',
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };
    }]);