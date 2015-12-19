(function () {
    'use strict';

    angular.module('angularTable', [])
        .directive('angularTable', ['$timeout', '$compile', function ($timeout, $compile) {
            return {
                restrict: 'A',
                scope: {angularTable: '=', options: '='},
                link: function ($scope, element, attrs) {
                    $scope.angularTable = $scope.options || {field: null, reverse: false};

                    if ($scope.options.size > 0) {
                        var el = angular.element($scope.options.nav ? '#' + $scope.options.nav : '<nav class="angular-pager" ng-show="options.size > 0 && options.total > 0"></nav>');
                        el.html('<ul class="pagination"><li ng-repeat="page in pages" ng-class="{active:page.begin==(angularTable.begin||0)}"><a href="" ng-click="angularTable.begin=page.begin">{{page.page}}</a></li></ul>');
                        $compile(el)($scope);

                        if (!$scope.options.nav) {
                            element.after(el);
                        }
                    }

                    element.find('th').each(function () {
                        var e = angular.element(this);
                        var sortBy = e.data('sort');
                        if (sortBy) {
                            e.html('<a href="" ng-click="sort(\'' + sortBy + '\')">' + e.text() + '</a> ' +
                                '<i class="fa fa-sort fa-xs text-muted" ng-show="angularTable.field !== \'' + sortBy + '\'"></i>' +
                                '<span ng-show="angularTable.field == \'' + sortBy + '\'">' +
                                '<i class="fa fa-sort-asc text-muted" ng-show="reversed[\'' + sortBy + '\']"></i>' +
                                '<i class="fa fa-sort-desc text-muted" ng-show="!reversed[\'' + sortBy + '\']"></i>' +
                                '</span>');
                            $compile(e)($scope);
                        }
                    });
                },
                controller: function ($scope, $element) {
                    $scope.reversed = {};

                    $scope.sort = function (f) {
                        angular.extend($scope.angularTable, {field: f, reverse: !!$scope.reversed[f]});
                        $scope.reversed[f] = !$scope.reversed[f];
                        $timeout(function () {});
                    };

                    $scope.nav = function () {
                        $scope.pages = [];

                        if ($scope.options.size > 0) {
                            var curPage = ($scope.angularTable.begin || 0) / ($scope.options.size || 1);
                            var totalPages = ($scope.options.total || 0) / ($scope.options.size || 1);
                            var numPages = $scope.options.pages || 6;

                            for (var page = Math.max(0, curPage - Math.round(numPages / 2)), count = 0; page < totalPages && count <= numPages; page++, count++) {
                                if (count == 0 && page > 0) {
                                    $scope.pages.push({begin: 0, page: 'First'});
                                }

                                $scope.pages.push({begin: page * $scope.options.size, page: page + 1});
                            }

                            if (totalPages > curPage + Math.round(numPages / 2) + 1) {
                                $scope.pages.push({begin: ((totalPages - 1) * $scope.options.size), page: 'Last'});
                            }
                        } else {
                            $scope.angularTable.begin = $scope.angularTable.size = null;
                        }
                    };

                    $scope.$watch('options', $scope.nav, true);
                    $scope.$watch('angularTable.begin', $scope.nav);
                }
            };
        }])
})();
