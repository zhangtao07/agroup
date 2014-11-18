'use strict';

var app = angular.module('agroupApp', [
    'RootModule',
    'ngError',
    'ngLoad',
    'ngStorage',
    'pascalprecht.translate',
    'ngCookies',
    'infinite-scroll',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'ui.router',
    'ui.bootstrap',
    'app.directives',
    'ngAnimate',
    'ngImgCrop'
  ]).config(["$provide",
    function($provide) {
      $provide.value("apiRoot", "");
    }
  ]).run(['$rootScope', 'userAPI', '$q',
    function($rootScope, userAPI, $q) {

      $q.when(userAPI.getMe()).then(function(obj) {
        $rootScope.__user = obj.data.data;
      });

      $q.when(userAPI.getMockGroups()).then(function(res){
        $rootScope.collections = res.data;
      });

      $q.when(userAPI.getGroups()).then(function(obj) {
        $rootScope.groups = obj.data.data;
      });
    }
  ]).run(
    ['$rootScope', '$state', '$stateParams', '$window', '$localStorage', '$translate',
      function($rootScope, $state, $stateParams, $window, $localStorage, $translate) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

        // config
        $rootScope.app = {
          name: 'Agroup',
          version: '0.1',
          // for chart colors
          color: {
            primary: '#7266ba',
            info: '#23b7e5',
            success: '#27c24c',
            warning: '#fad733',
            danger: '#f05050',
            light: '#e8eff0',
            dark: '#3a3f51',
            black: '#1c2b36'
          },
          settings: {
            themeID: 1,
            navbarHeaderColor: 'bg-black',
            navbarCollapseColor: 'bg-white-only',
            asideColor: 'bg-black',
            headerFixed: true,
            asideFixed: false,
            asideFolded: false
          }
        };

        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
          $rootScope.app.settings = $localStorage.settings;
        } else {
          $localStorage.settings = $rootScope.app.settings;
        }
        $rootScope.$watch('app.settings', function() {
          $localStorage.settings = $rootScope.app.settings;
        }, true);

        // angular translate
        $rootScope.lang = {
          isopen: false
        };
        $rootScope.langs = {
          zh_CN: '中文',
          en: 'English'
        };
        $translate.use('zh_CN');
        $rootScope.selectLang = $rootScope.langs[$translate.proposedLanguage()] || "中文";
        $rootScope.setLang = function(langKey, $event) {
          // set the current lang
          $rootScope.selectLang = $rootScope.langs[langKey];
          // You can change the language during runtime
          $translate.use(langKey);
          $rootScope.lang.isopen = !$rootScope.lang.isopen;
        };

        function isSmartDevice($window) {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }
      }
  ]
  )
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    //$urlRouterProvider.otherwise('/fex/comments');
    $urlRouterProvider.otherwise('/groups');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }).config(['$translateProvider',
    function($translateProvider) {
      // Register a loader for the static files
      // So, the module will search missing translation tables under the specified urls.
      // Those urls are [prefix][langKey][suffix].
      $translateProvider.useStaticFilesLoader({
        prefix: 'assets/l10n/',
        suffix: '.json'
      });

      // Tell the module what language to use by default
      $translateProvider.preferredLanguage('en');

      // Tell the module to store the language in the local storage
      $translateProvider.useLocalStorage();

    }
  ])


/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
.constant('JQ_CONFIG', {
  easyPieChart: ['js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
  sparkline: ['js/jquery/charts/sparkline/jquery.sparkline.min.js'],
  plot: ['js/jquery/charts/flot/jquery.flot.min.js',
    'js/jquery/charts/flot/jquery.flot.resize.js',
    'js/jquery/charts/flot/jquery.flot.tooltip.min.js',
    'js/jquery/charts/flot/jquery.flot.spline.js',
    'js/jquery/charts/flot/jquery.flot.orderBars.js',
    'js/jquery/charts/flot/jquery.flot.pie.min.js'
  ],
  slimScroll: ['js/jquery/slimscroll/jquery.slimscroll.min.js'],
  sortable: ['js/jquery/sortable/jquery.sortable.js'],
  nestable: ['js/jquery/nestable/jquery.nestable.js',
    'js/jquery/nestable/nestable.css'
  ],
  filestyle: ['js/jquery/file/bootstrap-filestyle.min.js'],
  slider: ['js/jquery/slider/bootstrap-slider.js',
    'js/jquery/slider/slider.css'
  ],
  chosen: ['js/jquery/chosen/chosen.jquery.min.js',
    'js/jquery/chosen/chosen.css'
  ],
  TouchSpin: ['js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
    'js/jquery/spinner/jquery.bootstrap-touchspin.css'
  ],
  wysiwyg: ['js/jquery/wysiwyg/bootstrap-wysiwyg.js',
    'js/jquery/wysiwyg/jquery.hotkeys.js'
  ],
  dataTable: ['js/jquery/datatables/jquery.dataTables.min.js',
    'js/jquery/datatables/dataTables.bootstrap.js',
    'js/jquery/datatables/dataTables.bootstrap.css'
  ],
  vectorMap: ['js/jquery/jvectormap/jquery-jvectormap.min.js',
    'js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
    'js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
    'js/jquery/jvectormap/jquery-jvectormap.css'
  ],
  footable: ['js/jquery/footable/footable.all.min.js',
    'js/jquery/footable/footable.core.css'
  ]
})


.constant('MODULE_CONFIG', {
  select2: ['js/jquery/select2/select2.css',
    'js/jquery/select2/select2-bootstrap.css',
    'js/jquery/select2/select2.min.js',
    'js/modules/ui-select2.js'
  ]
});
