(function () {

    'use strict';

    angular.module('wfmanagerControllers').controller('PendingCtrl', ['$scope', '$mdDialog', 'processService', 'CONFIG', 'auth',
        /**
         * @name PendingCtrl
         * @ngDoc controllers
         * @memberof wfmanagerControllers
         * 
         * @desc Controller used in Pending tasks view
         */
        function ($scope, $mdDialog, processService, config, auth) {

            $scope.imagePath = config.AVATARS_PATH;
            $scope.allTasks = null;
            $scope.tasksMappedByDefinition = null;
            $scope.filteredTasks = null;
            $scope.workflowNames = [];

            var pairs = {};
            var names = [];

            /**
             * @memberof PendingCtrl
             * @desc Returns the difference between due date and current date
             * 
             * @param {Task} task
             * @returns {Number} - The difference between dates
             */
            $scope.taskDelay = function (task) {
                var diff;

                if (task.dueDate === null)
                    return Infinity;

                if (task.endDate) {
                    diff = task.dueDate - task.endDate;

                } else {
                    var currentDate = new Date();
                    diff = task.dueDate - currentDate.getTime();
                }

                var diffInDays = diff / (1000 * 3600 * 24);
                return diffInDays;
            };

            /**
             * Get all process definitions
             */
            processService.getActiveTasks().then(
                // success callback
                function (response) {
                    // set default icon
                    $scope.allTasks = response.data;

                    $scope.tasksMappedById = ArrayUtil.mapByProperty2Property($scope.allTasks, "definitionName", "tasks");
                    $scope.taskIds = Object.keys($scope.tasksMappedById);
                    $scope.filteredTasks = response.data;
                    $scope.workflowNames = null;

                    $scope.taskIds.forEach(function (item) {
                        var task = $scope.tasksMappedById[item]["tasks"][0];
                        pairs[task.definitionName] = item;
                        names.push(task.definitionName);
                    });

                    //make unique list from definition names
                    var u = {}, a = [];
                    for (var i = 0, l = names.length; i < l; ++i) {
                        if (!u.hasOwnProperty(names[i])) {
                            a.push(names[i]);
                            u[names[i]] = 1;
                        }

                        $scope.workflowNames = a;
                    }
                }
            );

            /**
             * @memberof PendingCtrl
             * @desc Selects all available workflow definitions from the checkbox
             */
            $scope.selectAll = function () {
                $scope.filteredTasks = $scope.allTasks;
            };

            /**
             * @memberof PendingCtrl
             * @desc Filters the tasks by the given workflow definition name
             * 
             * @param {String} name
             */
            $scope.selectionChanged = function (name) {
                $scope.filteredTasks = null;
                $scope.filteredTasks = $scope.tasksMappedById[name]["tasks"];
            };

        }]);
})(angular);
