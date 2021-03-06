'use strict';

var _ = require('lodash')
  ;

var template = require('./template.html');

module.exports =
  function st2FormInput() {
    return {
      restrict: 'C',
      require: ['ngModel', '^?form'],
      scope: {
        'spec': '=',
        'options': '=',
        'ngModel': '=',
        'disabled': '='
      },
      templateUrl: template,
      link: function (scope, element, attrs, ctrls) {
        var ctrl = ctrls[0];
        var form = ctrls[1];

        scope.name = ctrl.$name;

        ctrl.$render = function () {
          scope.rawResult = ctrl.$viewValue;
        };

        scope.$watch('rawResult', function (rawResult) {
          var innerCtrl = form[ ctrl.$name + '__inner' ];

          ctrl.$setViewValue({
            number: function () {
              innerCtrl.$setValidity('number', true);

              if (_.isUndefined(rawResult)) {
                return rawResult;
              }

              if (_.isNaN(+rawResult)) {
                innerCtrl.$setValidity('number', false);
                return;
              }

              return parseFloat(rawResult);
            },
            integer: function () {
              innerCtrl.$setValidity('integer', true);

              if (_.isUndefined(rawResult)) {
                return rawResult;
              }

              if (_.isNaN(+rawResult) || ~(rawResult+'').indexOf('.')) { // eslint-disable-line no-bitwise
                innerCtrl.$setValidity('integer', false);
                return;
              }

              return parseInt(rawResult);
            },
            string: function () {
              return rawResult;
            }
          }[scope.spec && scope.spec.type || 'string']());
        });
      }
    };

  };
