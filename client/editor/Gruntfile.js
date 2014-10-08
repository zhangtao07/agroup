module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-bump');

    /***************************************************************************
     * Configuration
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true,
                ignores: [
                    'node_modules/**/*.js',
                    'libs/**/*.js',
                    'res/libs/**/*.js',
                    'res/bower-libs/**/*.js',
                    'res-min/**/*.js'
                ]
            },
            client: ['**/*.js']
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "res",
                    name: "main",
                    out: "res-min/main.js",
                    mainConfigFile: 'res/main.js',
                    optimize: "uglify2",
                    inlineText: true,
                    excludeShallow: [
                        'css/css-builder',
                        'less/lessc-server',
                        'less/lessc'
                    ]
                }
            }
        },
        jsbeautifier: {
            files: ['res-min/main.js'],
            options: {
                js: {
                    space_before_conditional: false,
                    keep_array_indentation: true,
                    indentWithTabs: true
                }
            }
        },
        less: {
            compile: {
                options: {
                    compress: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'res/themes',
                        src: [
                            '*.less'
                        ],
                        dest: 'res-min/themes',
                        ext: '.css'
                    },
                    {
                        src: 'res/styles/base.less',
                        dest: 'res-min/themes/base.css'
                    }
                ]
            }
        },
        'string-replace': {
            'constants': {
                files: {
                    'res/constants.js': 'res/constants.js'
                },
                options: {
                    replacements: [
                        {
                            pattern: /constants\.VERSION = .*/,
                            replacement: 'constants.VERSION = "<%= pkg.version %>";'
                        }
                    ]
                }
            },
            'cache-manifest': {
                files: {
                    'cache.manifest': 'cache.manifest'
                },
                options: {
                    replacements: [
                        {
                            pattern: /(#Date ).*/,
                            replacement: '$1<%= grunt.template.today() %>'
                        },
                        {
                            pattern: /(#DynamicResourcesBegin\n)[\s\S]*(\n#DynamicResourcesEnd)/,
                            replacement: '$1<%= resources %>$2'
                        }
                    ]
                }
            }
        },
        copy: {
            resources: {
                files: [
                    // Fonts
                    {
                        expand: true,
                        cwd: 'res/font',
                        src: [
                            '**'
                        ],
                        dest: 'res-min/font/'
                    },
                    // Images
                    {
                        expand: true,
                        cwd: 'res/img',
                        src: [
                            '**'
                        ],
                        dest: 'res-min/img/'
                    },
                    // Libraries
                    {
                        expand: true,
                        cwd: 'res/bower-libs/requirejs',
                        src: [
                            'require.js'
                        ],
                        dest: 'res-min/'
                    }
                ]
            }
        },
        // Inject bower dependencies into RequireJS configuration
        bower: {
            target: {
                rjsConfig: 'res/main.js'
            }
        },
        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json'
                ],
                updateConfigs: [
                    'pkg'
                ],
                commitFiles: [
                    '-a'
                ],
                pushTo: 'origin'
            }
        }
    });

    /***************************************************************************
     * Clean
     */
    grunt.registerTask('clean', function() {

        // Remove public/res-min folder
        grunt.file['delete']('res-min');

    });

    /***************************************************************************
     * Build JavaScript
     */
    grunt.registerTask('build-js', function() {

        // JSHint validation
        //grunt.task.run('jshint');

        // Run r.js optimization
        grunt.task.run('requirejs');

        // Beautify uglified JS for site error analysis
        grunt.task.run('jsbeautifier');

    });

    /***************************************************************************
     * Build CSS
     */
    grunt.registerTask('build-css', function() {

        // Compile less files
        grunt.task.run('less:compile');

    });

    /***************************************************************************
     * Resources
     */
    grunt.registerTask('build-res', function() {

        // Copy some resources (images, fonts...)
        grunt.task.run('copy:resources');

        // List resources and inject them in cache.manifest
        var resFolderList = [
            'res-min',
            'libs/MathJax/extensions',
            'libs/MathJax/fonts/HTML-CSS/TeX/woff',
            'libs/MathJax/jax/element',
            'libs/MathJax/jax/output/HTML-CSS/autoload',
            'libs/MathJax/jax/output/HTML-CSS/fonts/TeX',
            'libs/MathJax/jax/output/HTML-CSS/fonts/STIX'
        ];
        grunt.task.run('list-res:' + resFolderList.join(':'));
        grunt.task.run('string-replace:cache-manifest');

    });

    grunt.registerTask('list-res', function() {
        var resourceList = [];
        grunt.util.recurse(arguments, function(arg) {
            grunt.log.writeln('Listing resources: ' + arg);
            grunt.file.recurse(arg, function(abspath) {
                resourceList.push(abspath.replace(/^public\//, ''));
            });
        });
        grunt.config.set('resources', resourceList.join('\n'));
    });

    /***************************************************************************
     * Default task
     */
    grunt.registerTask('default', function() {
        grunt.task.run('clean');
        grunt.task.run('build-js');
        grunt.task.run('build-css');
        grunt.task.run('build-res');
    });

    /***************************************************************************
     * Tag task
     */
    grunt.registerTask('tag', function(versionType) {
        grunt.task.run('bump-only:' + (versionType || 'patch'));
        grunt.task.run('string-replace:constants');
        grunt.task.run('default');
        grunt.task.run('bump-commit');
    });
};
