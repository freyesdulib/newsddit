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
                    <div class="card-body">
                            <p class="card-text"><a onclick="newsdditModule.set_sub('${posts[i].sub}');" href="#"><small>${posts[i].sub}</small></a></p>
                            <p class="card-text"><a class="btn btn-primary" href="${posts[i].url}" target="_blank">${posts[i].title}&nbsp;</a></p>
                            <p class="card-text">${media}</p>
                            <p class="card-text">${thumbnail}</p>
                            <p class="card-text"><small>by <em>${posts[i].author}</em></small></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary"><small>Up votes: ${posts[i].ups}</small></button>
                                    ${link_text}
                                    <a class="btn btn-warning" href="https://reddit.com/${posts[i].comments}" target="_blank"><small>Comments: ${posts[i].num_comments}</small></a></small>
                                </div>
                                <!--
                                <small class="text-body-secondary"><a class="btn btn-warning" href="https://reddit.com/${posts[i].comments}" target="_blank"><small>Comments: ${posts[i].num_comments}</small></a></small>

                                -->
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