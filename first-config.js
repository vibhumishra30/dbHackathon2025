const execSync = require('child_process').execSync;
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const REQUIRED_NODEJS_MAJOR_VERSION = 'v18';
const GA_REGEX = new RegExp(/G-[A-Z0-9]+/);

const executeCommandInTerminal = (command) => {
  console.log(`Executing ${command}...`);

  execSync(command, { stdio: 'inherit' });
};

const removeDir = (path) => {
  console.log(`Removing ${path}...`);

  fs.rmSync(path, { recursive: true, force: true });
};

const completeScript = () => {
  // Replace npm start script with ng serve
  const packageJson = fs.readFileSync('package.json', 'utf8');
  let packageJsonLines = packageJson.split('\n');
  packageJsonLines = packageJsonLines.map((line) => {
    if (line.includes('node first-config.js')) {
      return line.replace('node first-config.js', 'ng serve');
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('package.json', packageJsonLines.join(''));

  // Init new Git repo
  executeCommandInTerminal('git init && git add .');

  // Commit changes
  executeCommandInTerminal('git commit -m "Initial commit" --quiet');

  console.log('Configuration has been completed.');
  process.exit(0);
};

const replaceProjectName = (projectName) => {
  const packageJson = fs.readFileSync('package.json', 'utf8');
  let packageJsonLines = packageJson.split('\n');
  packageJsonLines = packageJsonLines.map((line) => {
    if (line.includes('ng-clarity-starter')) {
      return line.replace('ng-clarity-starter', projectName.toLowerCase().replace(/\s/g, '-'));
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('package.json', packageJsonLines.join(''));

  const angularJson = fs.readFileSync('angular.json', 'utf8');
  let angularJsonLines = angularJson.split('\n');
  angularJsonLines = angularJsonLines.map((line) => {
    if (line.includes('ng-clarity-starter')) {
      return line.replace('ng-clarity-starter', projectName.toLowerCase().replace(/\s/g, '-'));
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('angular.json', angularJsonLines.join(''));

  const shellTemplate = fs.readFileSync('src/app/feature/shell/shell.component.html', 'utf8');
  let shellTemplateLines = shellTemplate.split('\n');
  shellTemplateLines = shellTemplateLines.map((line) => {
    if (line.includes('Extrawest Angular Clarity Starter')) {
      return line.replace('Extrawest Angular Clarity Starter', projectName);
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('src/app/feature/shell/shell.component.html', shellTemplateLines.join(''));

  const loginTemplate = fs.readFileSync('src/app/feature/login/login.component.html', 'utf8');
  let loginTemplateLines = loginTemplate.split('\n');
  loginTemplateLines = loginTemplateLines.map((line) => {
    if (line.includes('Clarity Starter')) {
      return line.replace('Clarity Starter', projectName);
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('src/app/feature/login/login.component.html', loginTemplateLines.join(''));

  const indexHtml = fs.readFileSync('src/index.html', 'utf8');
  let indexHtmlLines = indexHtml.split('\n');
  indexHtmlLines = indexHtmlLines.map((line) => {
    if (line.includes('Extrawest Angular Clarity Starter')) {
      return line.replace('Extrawest Angular Clarity Starter', projectName);
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('src/index.html', indexHtmlLines.join(''));
};

const addGoogleAnalytics = (gaId) => {
  // Install GA package
  executeCommandInTerminal('npm install ngx-google-analytics --save');

  // Add GA to main.ts
  const mainTs = fs.readFileSync('src/main.ts', 'utf8');
  let mainTsLines = mainTs.split('\n');
  // console.log(mainTsLines);
  mainTsLines = mainTsLines.map((line) => {
    if (line.includes('import { appRoutes }')) {
      return `${line}\nimport { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';\n`;
    }

    if (line.includes('importProvidersFrom(BrowserModule)')) {
      // console.log('replacing line in main.ts...');
      return `${line}\n    importProvidersFrom(NgxGoogleAnalyticsModule.forRoot('${gaId}')),\n`;
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync(path.join(__dirname, 'src', 'main.ts'), mainTsLines.join(''), { flag: 'r+' });
};

const configureSignInMethods = (authMethods) => {
  let loginTemplate = fs.readFileSync('src/app/feature/login/login.component.html', 'utf8');
  let loginTemplateLines = loginTemplate.split('\n');
  loginTemplateLines = loginTemplateLines.map((line, index) => {
    if (line.includes('login-group') && !authMethods.includes('email')) {
      deleteNextFewLines(loginTemplateLines, index + 1, 26);
    }

    if (line.includes('loginWithGoogle()') && !authMethods.includes('google')) {
      deleteNextFewLines(loginTemplateLines, index, 4);
      return '';
    }

    if (line.includes('loginWithGithub()') && !authMethods.includes('github')) {
      deleteNextFewLines(loginTemplateLines, index, 4);
      return '';
    }

    if (line.includes('loginWithApple()') && !authMethods.includes('apple')) {
      deleteNextFewLines(loginTemplateLines, index, 4);
      return '';
    }

    return line ? line + '\n' : line;
  });
  fs.writeFileSync('src/app/feature/login/login.component.html', loginTemplateLines.join(''));
};

const deleteNextFewLines = (lines, lineIndex, numberOfLines) => {
  for (let i = lineIndex; i < lineIndex + numberOfLines; i++) {
    lines[i] = '';
  }
}

(function main() {
  if (process.version.split('.')[0] !== REQUIRED_NODEJS_MAJOR_VERSION) {
    console.log(`Error! Please install Node.js ${REQUIRED_NODEJS_MAJOR_VERSION}!`);
    process.exit(1);
  }

  // Remove config dirs
  removeDir('.vscode');
  removeDir('.idea');
  removeDir('.angular');

  // Install modules
  executeCommandInTerminal('npm install');

  // Remove current git dir
  removeDir('.git');

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Choose the fancy name for your project (ex.: My Awesome Project)',
      },
      {
        type: 'input',
        name: 'gaId',
        message:
          'Do you want to use Google Analytics for this project? If so, paste here your Google Analytics ID (ex.: G-12345678)',
        validate: (value) => {
          if (!value || !GA_REGEX.test(value)) {
            return 'Please enter a valid Google Analytics ID (ex.: G-12345678)';
          }

          return true;
        },
      },
      // {
      //   type: 'confirm',
      //   name: 'useFirebase',
      //   message: 'Do you want to use Firebase for this project?',
      // },
      {
        type: 'checkbox',
        name: 'authMethods',
        message: 'What authentication methods do you want to use?',
        choices: [
          {
            name: 'Email',
            value: 'email',
          },
          {
            name: 'Google',
            value: 'google',
          },
          {
            name: 'GitHub',
            value: 'github',
          },
          {
            name: 'Apple',
            value: 'apple',
          },
        ],
      },
    ])
    .then((answers) => {
      replaceProjectName(answers.projectName);

      if (answers.gaId) addGoogleAnalytics(answers.gaId);

      if (answers.authMethods.length > 0) configureSignInMethods(answers.authMethods);

      completeScript();
    });
})();
