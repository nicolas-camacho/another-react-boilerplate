import inquirer from 'inquirer';
import fs from 'fs';

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

inquirer.prompt(QUESTIONS).then( answer => {
    console.log(answer)
})

