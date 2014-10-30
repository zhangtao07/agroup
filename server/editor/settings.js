var config = require('../config/environment');

var constants = {};
constants.MAIN_URL = 'http://' + config.hostname + "/editor/";

exports.settings = {
  template: [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<title><%= documentTitle %></title>',
    '<link rel="stylesheet" href="' + constants.MAIN_URL + 'res-min/themes/default.css" />',
    '<script type="text/javascript" src="' + constants.MAIN_URL + 'libs/MathJax/MathJax.js?config=TeX-AMS_HTML"></script>',
    '</head>',
    '<body><div class="container"><%= documentHTML %></div></body>',
    '</html>'
  ].join('\n'),
  pdfTemplate: [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<title><%= documentTitle %></title>',
    '<link rel="stylesheet" href="'+ constants.MAIN_URL +'res-min/themes/base.css" />',
    '<script type="text/x-mathjax-config">',
    'MathJax.Hub.Config({ messageStyle: "none" });',
    '</script>',
    '<script type="text/javascript" src="'+ constants.MAIN_URL + 'libs/MathJax/MathJax.js?config=TeX-AMS_HTML"></script>',
    '</head>',
    '<body><%= documentHTML %></body>',
    '</html>'
  ].join('\n'),
  pdfOptions: {
    "marginTop": 25,
    "marginRight": 25,
    "marginBottom": 25,
    "marginLeft": 25,
    "pageSize": "A4",
  },
  extensionSettings: {}
}

var authorizedPageSizes = [
  'A3',
  'A4',
  'Legal',
  'Letter'
];

exports.getParams = getParams;
function getParams(options) {
  var params = [];
  // Margins
  var marginTop = parseInt(options.marginTop);
  params.push('-T', isNaN(marginTop) ? 25 : marginTop);
  var marginRight = parseInt(options.marginRight);
  params.push('-R', isNaN(marginRight) ? 25 : marginRight);
  var marginBottom = parseInt(options.marginBottom);
  params.push('-B', isNaN(marginBottom) ? 25 : marginBottom);
  var marginLeft = parseInt(options.marginLeft);
  params.push('-L', isNaN(marginLeft) ? 25 : marginLeft);

  // Header
  options.headerCenter && params.push('--header-center', options.headerCenter);
  options.headerLeft && params.push('--header-left', options.headerLeft);
  options.headerRight && params.push('--header-left', options.headerRight);
  options.headerFontName && params.push('--header-font-name ', options.headerFontName);
  options.headerFontSize && params.push('--header-font-size ', options.headerFontSize);

  // Footer
  options.footerCenter && params.push('--footer-center', options.footerCenter);
  options.footerLeft && params.push('--footer-left', options.footerLeft);
  options.footerRight && params.push('--footer-left', options.footerRight);
  options.footerFontName && params.push('--footer-font-name ', options.footerFontName);
  options.footerFontSize && params.push('--footer-font-size ', options.footerFontSize);

  // Page size
  params.push('--page-size', authorizedPageSizes.indexOf(options.pageSize) === -1 ? 'A4' : options.pageSize);

  params.push('--run-script', waitForJavaScript.toString() + 'waitForJavaScript()');
  params.push('--window-status', 'done');

  return params;
}


function waitForJavaScript() {
  if (window.MathJax) {
    // Amazon EC2: fix TeX font detection
    MathJax.Hub.Register.StartupHook("HTML-CSS Jax Startup", function() {
      var HTMLCSS = MathJax.OutputJax["HTML-CSS"];
      HTMLCSS.Font.checkWebFont = function(check, font, callback) {
        if (check.time(callback)) {
          return;
        }
        if (check.total === 0) {
          HTMLCSS.Font.testFont(font);
          setTimeout(check, 200);
        } else {
          callback(check.STATUS.OK);
        }
      };
    });
    MathJax.Hub.Queue(function() {
      window.status = 'done';
    });
  } else {
    setTimeout(function() {
      window.status = 'done';
    }, 2000);
  }
}


