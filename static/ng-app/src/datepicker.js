angular.module('wsReports').directive('wsDatePicker', function () {
    return {
        scope: {
            dates: '='
        },
        link: function (scope, elem, attr) {

            elem.daterangepicker({
                "startDate": scope.dates.start,
                "endDate": scope.dates.end,
                maxDate: new Date(),
                autoApply: true,
                startDay: 1,
                dateLimit: 30,
                buttonClasses: 'hide',
                locale: {
                    firstDay: 1,
                    format: 'DD MMM'
                }
                //parentEl: elem.parent()
            }, function (start, end, label) {
                console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
                scope.$apply(function () {
                    scope.dates.start = start;
                    scope.dates.end = end;

                });

            });
            $('.daterangepicker').find('.daterangepicker_input').remove();
        }
    }
});