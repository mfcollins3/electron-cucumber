/*
 Copyright 2016 Michael F. Collins, III

 Liensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

module.exports = function() {
  this.Given(/^the application is running$/, function(callback) {
    this.signInWindow = new this.BrowserWindow({width: 800, height: 600});
    this.signInWindow.loadURL('file://' + __dirname + '/signin.html');
    callback();
  });

  this.When(/^I enter my credentials into the sign in form$/, function() {
    return this.typeText(this.signInWindow, 'username', 'Michael')
        .then(() => this.typeText(this.signInWindow, 'password', 'password'))
        .then(() => this.clickButton(this.signInWindow, 'signin'));
  });

  this.Then(/^I will be granted access to the application$/, function(callback) {
    callback(null, 'pending');
  });
};