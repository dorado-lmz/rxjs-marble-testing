var Jasmine = require('jasmine');
var jasmine = new Jasmine();
require('ts-node/register');

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: true
});
jasmine.execute();