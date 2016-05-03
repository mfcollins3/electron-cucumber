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

function World() {
  console.log(process.env.NODE_PATH);
  const {app, BrowserWindow} = require('electron');

  this.app = app;
  this.BrowserWindow = BrowserWindow;

  this.typeText = function(window, id, text) {
    return new Promise(function(resolve) {
      window.webContents.executeJavaScript('document.getElementById("' + id + '").value = "' + text + '";', function(result) {
        resolve(result);
      });
    });
  };

  this.clickButton = function(window, id) {
    return new Promise(function(resolve) {
      window.webContents.executeJavaScript('document.getElementById("' + id + '").click();', function(result) {
        resolve(result);
      });
    });
  };
}

module.exports = function() {
  this.World = World;
};