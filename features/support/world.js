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

// features/support/world.js
const { setWorldConstructor, setDefaultTimeout, Before } = require('cucumber')
var electron = require("electron")
var app = require('electron').app

class World {

  constructor(){
    this.app = app;
    this.BrowserWindow = electron.BrowserWindow;
  }


  typeText (window, id, text) {
    return new Promise(function(resolve, reject) {
      var code = `var input = document.getElementById('${id}');
      if (!input) {
        'FAIL: An input element with identifier ${id} was not found';
      } else {
        input.value = '${text}';
      }`
      window.webContents.executeJavaScript(code, true, function(result) {
        console.log(`result = ${result}`);
        if (result instanceof Error) {
          reject(result);
        }

        resolve(result);
      });
    });
  };

  clickButton (window, id) {
    return new Promise(function(resolve, reject) {
      var code = `var button = document.getElementById('${id}');
      if (!button) {
        'FAIL: A button with identifier ${id} was not found';
      } else {
        button.click();
      }`;
      window.webContents.executeJavaScript(code, true, function(result) {
        console.log(result);
        if (result.startsWith('FAIL:')) {
          reject(new Error(result.substring(5).trim()));
        }

        resolve(result);
      });
    });
  };
}

setWorldConstructor(World)
