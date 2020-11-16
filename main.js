#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import { exec } from 'child_process';
import { stderr, stdout } from 'process';

const CURR_DIR = process.cwd();
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
    {
        name: 'project-choice',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: (input) => {
          if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
          else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];

inquirer.prompt(QUESTIONS).then( answers => {
    const projectTemplate = answers['project-choice'];
    const projectName = answers['project-name'];
    const projectTemplatePath = `${__dirname}/templates/${projectTemplate}`;

    fs.mkdirSync(`${CURR_DIR}/${projectName}`);
    createDirectoryStructure(projectTemplatePath, projectName);
    
    exec('yarn install', {
        cwd: `./${projectName}`
    }, (error, stdout, stderr) => {
        if(error) {
            console.log(error);
            return;
        }
        console.log(stdout);
        console.log(stderr);

        console.log('--------------------------');
        console.log('Porject created!!');
        console.log('--------------------------');
        console.log(`Type cd ${projectName} and yarn start`);
        console.log('to initializate the project');
    });
})

const createDirectoryStructure = (templatePath, projectPath) => {
    const directoryStructure = fs.readdirSync(templatePath);

    directoryStructure.forEach(element => {
        const elementPath = `${templatePath}/${element}`;

        const stats = fs.statSync(elementPath);

        if (stats.isFile()) {
            const content = fs.readFileSync(elementPath, 'utf-8');

            if (element === '.npmignore') file = '.gitignore';

            const writePath = `${CURR_DIR}/${projectPath}/${element}`;
            fs.writeFileSync(writePath, content, 'utf-8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURR_DIR}/${projectPath}/${element}`);

            createDirectoryStructure(`${templatePath}/${element}`, `${projectPath}/${element}`);
        }
    });
}

