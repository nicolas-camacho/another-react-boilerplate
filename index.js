#!/usr/bin/env node
"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/web.dom-collections.for-each");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fs = _interopRequireDefault(require("fs"));

var _child_process = require("child_process");

var _process = require("process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CURR_DIR = process.cwd();

var CHOICES = _fs["default"].readdirSync("".concat(__dirname, "/templates"));

var QUESTIONS = [{
  name: 'project-choice',
  type: 'list',
  message: 'What project template would you like to generate?',
  choices: CHOICES
}, {
  name: 'project-name',
  type: 'input',
  message: 'Project name:',
  validate: function validate(input) {
    if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;else return 'Project name may only include letters, numbers, underscores and hashes.';
  }
}];

_inquirer["default"].prompt(QUESTIONS).then(function (answers) {
  var projectTemplate = answers['project-choice'];
  var projectName = answers['project-name'];
  var projectTemplatePath = "".concat(__dirname, "/templates/").concat(projectTemplate);

  _fs["default"].mkdirSync("".concat(CURR_DIR, "/").concat(projectName));

  createDirectoryStructure(projectTemplatePath, projectName);
  (0, _child_process.exec)('yarn install', {
    cwd: "./".concat(projectName)
  }, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      return;
    }

    console.log(stdout);
    console.log(stderr);
    console.log('--------------------------');
    console.log('Porject created!!');
    console.log('--------------------------');
    console.log("Type cd ".concat(projectName, " and yarn start"));
    console.log('to initializate the project');
  });
});

var createDirectoryStructure = function createDirectoryStructure(templatePath, projectPath) {
  var directoryStructure = _fs["default"].readdirSync(templatePath);

  directoryStructure.forEach(function (element) {
    var elementPath = "".concat(templatePath, "/").concat(element);

    var stats = _fs["default"].statSync(elementPath);

    if (stats.isFile()) {
      var content = _fs["default"].readFileSync(elementPath, 'utf-8');

      if (element === '.npmignore') file = '.gitignore';
      var writePath = "".concat(CURR_DIR, "/").concat(projectPath, "/").concat(element);

      _fs["default"].writeFileSync(writePath, content, 'utf-8');
    } else if (stats.isDirectory()) {
      _fs["default"].mkdirSync("".concat(CURR_DIR, "/").concat(projectPath, "/").concat(element));

      createDirectoryStructure("".concat(templatePath, "/").concat(element), "".concat(projectPath, "/").concat(element));
    }
  });
};
