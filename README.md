Cucumber for Electron
=====================
Cucumber for Electron allows [Electron](http://electron.atom.io)
application developers to build
[Cucumber.js](https://github.com/cucumber/cucumber-js)-based feature
tests to test their applications. Cucumber has developed into a valuable
tool for building automated acceptance tests for many applications and
this package hopes to extend this success to Electron applications.

Installing Cucumber for Electron
--------------------------------
Cucumber for Electron is available as an [NPM](https://npmjs.com)
module. To install Cucumber for Electron, add it as a development
dependency to your application:

    $ npm install --save-dev electron-cucumber

If you are using the [two package-json structure](https://github.com/electron-userland/electron-builder#two-packagejson-structure)
recommended by the [electron-builder](https://github.com/electron-userland/electron-builder)
project, you should add `electron-cucumber` to the `package.json` file
in the root directory of your project.

Usage
-----
Cucumber.js will look for your features specifications in the `features`
subdirectory of your project workspace. First, create that directory:

    $ mkdir features

Cucumber will look for step definitions and support files in
subdirectories of `features`. Create those directories next:

    $ mkdir features/step_definitions
    $ mkdir features/support

In your `package.json` file, add the `features` script to automate the
execution of your feature tests:

    ...
    "scripts": {
        "features": "electron-cucumber"
    },
    ...

You can now run your features by executing the `npm run features`
command on the command line.

During text execution, your features are executed within the main
process of the Electron application. It has access to all Electron APIs
within your step definitions and support code. You may find it helpful
to create helpers within your [World](https://github.com/cucumber/cucumber-js#world)
for use by the step definitions and other support code.

For example, given the following scenario:

    Given I launch the application
    When I enter my username and password into the form
    Then I will be given access to the application

You can create the following step definitions:

    this.Given(/^I launch the application$/, function(callback) {
      callback(null, 'pending');
    });

    this.When(/^I enter my username and password into the form$/, function(callback) {
      callback(null, 'pending');
    });

    this.Then(/^I will be given access to the application$/, function(callback) {
      callback(null, 'pending');
    });

For the `Given I launch the application` step, you may implement that by
creating and displaying a `BrowserWindow` with a sign-in form. In your
`World`, you will create a helper for creating the window:

    // features/support/world.js

    function World() {
      const {BrowserWindow} = require('electron');

      this.createWindow = function(options) {
        return new BrowserWindow(options);
      };
    }

    module.exports = function() {
      this.World = World;
    };

In my step definition, you can then use the helper to show the window:

    this.Given(/^I launch the application$/, function(callback) {
      this.signInWindow = this.createWindow({width: 800, height: 600});
      this.signInWindow.loadURL('file://' + __dirname + '/signin.html');
      callback();
    });

Now that the window is open and visible, you can automate the process of
filling in the form fields and submitting the form. Since the feature
and the step definitions are executing in the main process, you will
need to send JavaScript code to be executed in the renderer process for
the sign-in form.

The next helpers that you can add to the World will make use of
Cucumber's and [Node's](https://nodejs.org) support for
[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
The helper methods will execute JavaScript in the renderer and return a
promise:

    function succeedOrFail(result, resolve, reject) {
      if (result.startswith('FAIL:')) {
        reject(new Error(result.substring(5).trim()));
      } else {
        resolve(result);
      }
    }

    this.typeText = function(window, id, text) {
      return new Promise(function(resolve ,reject) {
        var code = `var input = document.getElementById('${id}');
          if (!input) {
            'FAIL: An input element with identifier ${id} was not found';
          } else {
            input.value = '${text}';
          }`
        window.webContents.executeJavaScript(code, true, function(result) {
          succeedOrFail(result, resolve, reject);
        });
      });
    };

    this.clickButton = function(window, id) {
      return new Promise(function(resolve, reject) {
        var code = `var button = document.getElementById('${id}');
          if (!button) {
            'FAIL: A button with identifier ${id} was not found';
          } else {
            button.click();
          };
        window.webContents.executeJavaScript(code, true, function(result) {
          succeedOrFail(result, resolve, reject);
        });
      });
    };

The second step definition can now be updated to usse the helpers:

    this.When(/^I enter my username and password into the form$/, function(callback) {
      return this.typeText(this.signInWindow, 'username', 'Bob')
          .then(() => this.typeText(this.signInWindow, 'password', 'password')
          .then(() => this.clickButton(this.signInWindow, 'signin'));
    });

For more information about using Cucumber.js, refer to that project's
[GitHub website](https://github.com/cucumber/cucumber-js).
