var app = angular.module("gamerApp", []);

app.controller("gamerCtrl", function ($scope, $http, $window) {
    $scope.dialog = document.querySelector('dialog');
    $scope.showDialogButton = document.querySelector('#show-dialog');
    $scope.results = [];
    $scope.age = "";
    $scope.max_players = "";
    $scope.avg_time = "";
    $scope.category = "";
    $scope.catoptions = [
        "Abstract Strategy",
        "Action / Dexterity",
        "Adventure",
        "Age of Reason",
        "American Civil War",
        "American Indian Wars",
        "American Revolutionary War",
        "American West",
        "Ancient",
        "Animals",
        "Arabian",
        "Aviation / Flight",
        "Bluffing",
        "Book",
        "Card Game",
        "Children's Game",
        "City Building",
        "Civil War",
        "Civilization",
        "Collectible Components",
        "Comic Book / Strip",
        "Deduction",
        "Dice",
        "Economic",
        "Educational",
        "Electronic",
        "Environmental",
        "Expansion for Base-game",
        "Exploration",
        "Fan Expansion",
        "Fantasy",
        "Farming",
        "Fighting",
        "Game System",
        "Horror",
        "Humor",
        "Industry / Manufacturing",
        "Korean War",
        "Mafia",
        "Math",
        "Mature / Adult",
        "Maze",
        "Medical",
        "Medieval",
        "Memory",
        "Miniatures",
        "Modern Warfare",
        "Movies / TV / Radio theme",
        "Murder/Mystery",
        "Music",
        "Mythology",
        "Napoleonic",
        "Nautical",
        "Negotiation",
        "Novel-based",
        "Number",
        "Party Game",
        "Pike and Shot",
        "Pirates",
        "Political",
        "Post-Napoleonic",
        "Prehistoric",
        "Print & Play",
        "Puzzle",
        "Racing",
        "Real-time",
        "Religious",
        "Renaissance",
        "Science Fiction",
        "Space Exploration",
        "Spies/Secret Agents",
        "Sports",
        "Territory Building",
        "Trains",
        "Transportation",
        "Travel",
        "Trivia",
        "Video Game Theme",
        "Vietnam War",
        "Wargame",
        "Word Game",
        "World War I",
        "World War II",
        "Zombies"
    ]
    $scope.init = function () {
        $http.get("http://localhost:3002/getTop")
            .then(function (response) {
                $scope.results = response.data;
            });
        if (!$scope.dialog.showModal) {
            dialogPolyfill.registerDialog($scope.dialog);
        }
    }

    $scope.openSearch = function () {
        $scope.dialog.showModal();
    }

    $scope.search = function () {
        if ($scope.age === "" && $scope.max_players === "" && $scope.avg_time === "" && $scope.category === "") {
            $scope.dialog.close();
        }
        else {
            $http.get("http://localhost:3002/search?category=" + $scope.category + "&max_players=" + $scope.max_players + "&avg_time=" + $scope.avg_time + "&age=" + $scope.age)
                .then(function (response) {
                    console.log(response.data);
                    $scope.results = response.data;
                    $scope.age = "";
                    $scope.max_players = "";
                    $scope.avg_time = "";
                    $scope.category = "";
                    $scope.dialog.close();
                });
        }
    }

    $scope.cancel = function () {
        $scope.dialog.close();
    }
    angular.element($window).bind('resize', function () {
        location.reload();
    });
    $scope.init();
});
app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});