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

const newsdditModule = (function () {

    'use strict';

    let obj = {};

    obj.set_sub = function (sub) {
        document.querySelector('#sub').value = sub.replace('r/', '');
        newsdditModule.get_posts();
    };

    obj.get_posts = function () {

        (async () => {

            try {

                let listing_type = document.querySelector('#listing-type').value;
                let timeframe = document.querySelector('#timeframe').value;
                let sub = document.querySelector('#sub').value.trim();
                let query_string = '?';
                    query_string += `listing_type=${listing_type}`;
                    query_string += `&timeframe=${timeframe}`;

                    if (sub.length > 0) {
                        query_string += `&sub=${sub}`;
                    }


                let url = `/api/posts${query_string}`;
                let response = await httpModule.req({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    display_posts(response.data);
                }

            } catch (error) {
                console.error(error);
            }

        })();

        return false;
    };

    const display_posts = function (posts) {

        document.querySelector('#posts').innerHTML = '';

        let html = '';

        for (let i=0;i<posts.length;i++) {

            let link_text = '';
            let media = '';
            let thumbnail = '';

            if (posts[i].thumbnail.length !== 0 && posts[i].thumbnail.length > 10) {
                thumbnail = `<img src="${posts[i].thumbnail}" width="100px" height="100px">`;
            }

            if (posts[i].link_text !== null) {
                link_text = `<button type="button" class="btn btn-sm btn-outline-secondary"><small>${posts[i].link_text}</small></button>`;
            }

            if (posts[i].is_video === true && posts[i].media !== null) {
                thumbnail = '';
                media = `<video controls 
                    src="${posts[i].media.reddit_video.fallback_url}"
                    poster="${posts[i].thumbnail}"
                    width="100%"
                    height="225">
                    Sorry, your browser doesn't support embedded videos, but don't worry, you can
                </video>`;
            }

            html += `<div class="col">
                    <div class="card shadow-sm">  
                    <div class="card-body"><!-- class="btn btn-primary" -->
                            <p class="card-text"><a onclick="newsdditModule.set_sub('${posts[i].sub}');" href="#"><small>${posts[i].sub}</small></a></p>
                            <p class="card-text"><a href="${posts[i].url}" target="_blank">${posts[i].title}&nb</a></p>
                            <p class="card-text">${media}</p>
                            <p class="card-text">${thumbnail}</p>
                            <p class="card-text"><small>by <em>${posts[i].author}</em></small></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                                        </svg>
                                        <small>${posts[i].ups}</small>
                                    </button>
                                    ${link_text}
                                    <a class="btn btn-sm btn-outline-secondary" href="https://reddit.com/${posts[i].comments}" target="_blank">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                        </svg>
                                        <small>${posts[i].num_comments}</small></a></small>
                                </div>
                            </div>
                    </div>
                    </div>
                    </div>`;
        }

        document.querySelector('#posts').innerHTML = html;
    };

    obj.init = function () {
        newsdditModule.get_posts();
    };

    return obj;

}());