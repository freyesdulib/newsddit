/**
 Copyright 2023 fernando.reyes@du.edu

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const httpModule = (function () {

    'use strict';

    const HTTP = axios;
    let obj = {};

    obj.req = async function (request) {

        try {
            return await HTTP(request);
        } catch (error) {

            let error_message_html = '';
            let error_message = `<div class="alert alert-danger" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation" viewBox="0 0 16 16">
                                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"/>
                                    </svg>
                                    <small>${error.message}</small></div>`;

            error_message_html += `<div class="col">
                    <div class="card shadow-sm">  
                    <div class="card-body">
                        <p class="card-text">${error_message}</p>   
                    </div>
                    </div>
                    </div>`;

            document.querySelector('#posts').innerHTML = error_message_html;
        }
    };

    return obj;

}());