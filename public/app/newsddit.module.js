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

    obj.collapse_nav = function () {
        document
            .querySelector('.navbar-toggler')
            .dispatchEvent(new Event('click'));

        newsdditModule.get_posts();
    };

    obj.set_sub = function (sub) {
        document.querySelector('#sub').value = sub.replace('r/', '');
        newsdditModule.get_posts();
    };

    obj.get_posts = async function () {

        loading();

        try {

            let listing_type = document.querySelector('#listing-type').value;
            let timeframe = document.querySelector('#timeframe').value;
            let fav_sub = document.querySelector('#fav-sub').value;
            let sub = document.querySelector('#sub').value.trim().toLowerCase();
            let query_string = '?';
            query_string += `listing_type=${listing_type}`;
            query_string += `&timeframe=${timeframe}`;

            if (sub.length > 0) {
                query_string += `&sub=${sub}`;
            } else if (fav_sub !== 'none') {
                query_string += `&sub=${fav_sub}`;
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
            console.error('ERROR: ', error);
        }

        return false;
    };

    const display_posts = function (posts) {

        document.querySelector('#menu-form').reset();

        if (posts.length === 0) {

            let alert = '';
            let alert_message = `<div class="alert alert-danger" role="alert"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation" viewBox="0 0 16 16">
                                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"/>
                                </svg><small>${document.querySelector('#sub').value} subreddit does not exist.</small></div>`;

            alert += `<div class="col">
                    <div class="card shadow-sm">  
                    <div class="card-body">
                        <p class="card-text">${alert_message}</p>   
                    </div>
                    </div>
                    </div>`;

            document.querySelector('#sub').value = '';
            document.querySelector('#posts').innerHTML = alert;
            return false;
        }

        let html = '';

        for (let i = 0; i < posts.length; i++) {

            let link_text = '';
            let media = '';
            let thumbnail = '';
            let post_hint = '';
            let awardings = '';

            if (posts[i].thumbnail.length !== 0 && posts[i].thumbnail.length > 10) {

                if (posts[i].preview !== undefined && posts[i].preview.images[0].resolutions[5] !== undefined) {
                    thumbnail = `<a href="${posts[i].url}" title="${posts[i].title}" target="_blank"><img src="${posts[i].preview.images[0].resolutions[5].url}" width="100%" height="100%" alt="image"></a>`;
                } else if (posts[i].preview !== undefined && posts[i].preview.images[0].resolutions[4] !== undefined) {
                    thumbnail = `<a href="${posts[i].url}" title="${posts[i].title}" target="_blank"><img src="${posts[i].preview.images[0].resolutions[4].url}" width="100%" height="100%" alt="image"></a>`;
                } else if (posts[i].preview !== undefined && posts[i].preview.images[0].resolutions[3] !== undefined) {
                    thumbnail = `<a href="${posts[i].url}" title="${posts[i].title}" target="_blank"><img src="${posts[i].preview.images[0].resolutions[3].url}" width="100%" height="100%" alt="image"></a>`;
                } else if (posts[i].preview !== undefined && posts[i].preview.images[0].resolutions[2] !== undefined) {
                    thumbnail = `<a href="${posts[i].url}" title="${posts[i].title}" target="_blank"><img src="${posts[i].preview.images[0].resolutions[2].url}" width="100%" height="100%" alt="image"></a>`;
                } else if (posts[i].preview !== undefined && posts[i].preview.images[0].resolutions[1] !== undefined) {
                    thumbnail = `<a href="${posts[i].url}" title="${posts[i].title}" target="_blank"><img src="${posts[i].preview.images[0].resolutions[1].url}" width="100%" height="100%" alt="image"></a>`;
                } else {
                    thumbnail = `<a href="${posts[i].url}" title="${posts[i].title}" target="_blank"><img src="${posts[i].thumbnail}" width="140px" height="140px" alt="image"></a>`;
                }
            }

            if (posts[i].link_text !== null) {
                link_text = `<button type="button" class="btn btn-sm btn-outline-secondary"><small>${posts[i].link_text}</small></button>`;
            }

            if (posts[i].is_video === true && posts[i].media !== null) {
                thumbnail = '';
                media = `<video controls
                    poster="${posts[i].thumbnail}"
                    width="100%"
                    height="225px">
                    <source src="${posts[i].media.reddit_video.fallback_url}">
                    Sorry, your browser doesn't support embedded videos.
                </video>`;
            }

            if (posts[i].post_hint !== undefined) {
                post_hint = `<button type="button" class="btn btn-sm btn-outline-secondary">
                    <small>${posts[i].post_hint}</small>
                    </button>`;
            }

            if (posts[i].all_awardings !== undefined && posts[i].all_awardings.length > 0) {
                for (let j = 0; j < posts[i].all_awardings.length; j++) {
                    awardings += `<img src="${posts[i].all_awardings[j].resized_static_icons[0].url}" title="${posts[i].all_awardings[j].name}" alt="image">&nbsp;`;
                }
            }

            html += `<div class="col">
                    <div class="card shadow-sm">  
                    <div class="card-body">
                            <p class="card-text"><a class="btn sub" onclick="newsdditModule.set_sub('${posts[i].sub}');" href="#"><small>${posts[i].sub}</small></a></p>
                            <p class="card-text">
                                <a href="${posts[i].url}" title="${posts[i].title}" target="_blank">${posts[i].title}</a>
                            </p>
                            <p class="card-text">${media}</p>
                            <p class="card-text">${thumbnail}</p>
                            <p class="card-text"><small>by <em>${posts[i].author}</em> ${awardings}</small></p>
                            <p class="card-text">
                                <span class="posted-on">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                Posted on ${posts[i].posted_date}
                                </span></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                                        </svg>
                                        <small>${posts[i].ups}</small>
                                    </button>
                                    ${link_text}
                                    ${post_hint}
                                    <a class="btn btn-sm btn-outline-secondary" href="https://reddit.com/${posts[i].comments}" target="_blank">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                        </svg>
                                        <small>${posts[i].num_comments}</small></a>
                                </div>
                            </div>
                    </div>
                    </div>
                    </div>`;
        }

        document.querySelector('#posts').innerHTML = html;
    };

    const loading = function () {

        document.querySelector('#posts').innerHTML = '';

        let html = `<div class="col">
            <div class="card shadow-sm">
            <div class="card-body">
            <p class="card-text">
                <div class="alert alert-info" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning" viewBox="0 0 16 16">
                        <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1H6.374z"/>
                    </svg>
                    <small>Loading...</small></div>
            </p>
            </div>
            </div>
            </div>`;

        document.querySelector('#posts').innerHTML = html;

        return false;
    };

    obj.init = async function () {
        await newsdditModule.get_posts();
    };

    return obj;

}());