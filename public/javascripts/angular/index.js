(function(angular) {
	var levelfourModule = angular.module('levelfour', []);
	var studentModule = angular.module('student', []);
	var ticketModule = angular.module('ticket', []);

	studentModule.controller('studentController', ['$scope', function($scope){
		$scope.account_id = local_data._id

		$scope.updateLocation = function(location){
			$.ajax({
				url: 'mongodb://localhost/level-four',
				type: 'post',
				dataType: 'json',
			})
		}
	}])

})(window.angular);
