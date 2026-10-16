const babel = require('@babel/core');

// Transforma JSX e instrumenta el código real sin cambiar los archivos de Go Live.
function prepararReact(logger) {
    const log = logger.create('preprocessor:react-coverage');
    return function (content, file, done) {
        try {
            const result = babel.transformSync(content, {
                filename: file.originalPath,
                babelrc: false,
                configFile: false,
                presets: [['@babel/preset-react', {runtime: 'classic'}]],
                plugins: /[\\/]js[\\/]/.test(file.originalPath)
                    ? [['babel-plugin-istanbul', {exclude: []}]]
                    : []
            });
            done(null, result.code);
        } catch (error) {
            log.error(error.message);
            done(error);
        }
    };
}
prepararReact.$inject = ['logger'];

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'node_modules/react/umd/react.development.js',
            'node_modules/react-dom/umd/react-dom.development.js',
            'js/componentes.js',
            'js/app.js',
            'tests/portafolio.spec.js',
            {pattern: 'img/**/*', included: false, served: true}
        ],
        proxies: {'/img/': '/base/img/'},
        preprocessors: {
            'js/**/*.js': ['react-coverage'],
            'tests/**/*.js': ['react-coverage']
        },
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage',
            {'preprocessor:react-coverage': ['factory', prepararReact]}
        ],
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'text', subdir: '.', file: 'informe.txt'},
                {type: 'text-summary'}
            ],
            check: {
                global: {statements: 80, branches: 75, functions: 80, lines: 80}
            }
        },
        browsers: [process.env.KARMA_CI === '1' ? 'ChromeHeadlessCI' : 'ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-dev-shm-usage']
            }
        },
        client: {jasmine: {random: false}},
        singleRun: false,
        browserNoActivityTimeout: 30000
    });
};
