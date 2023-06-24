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

'use strict';

const HTTP = require('axios');
const CONFIG = require('../config/app_config');

exports.get_app = function (req, res) {
    res.render('index');
};

exports.get_posts = function (req, res) {

    (async () => {

        try {

            const API = CONFIG.api;
            let sub = 'popular';
            let listing_type = 'hot';
            let timeframe = 'week';

            if (req.query.sub !== undefined) {
                sub = req.query.sub;
            }

            if (req.query.listing_type !== undefined) {
                listing_type = req.query.listing_type;
            }

            if (req.query.timeframe !== undefined) {
                timeframe = req.query.timeframe;
            }

            let limit = 100;
            let url = `${API}/r/${sub}/${listing_type}.json?limit=${limit}&t=${timeframe}`;
            const response = await HTTP.get(url);

            if (response.status === 200) {

                let posts = [];

                if (response.data.data.children.length === 0) {
                    res.status(200).send(posts);
                    return false;
                }

                let data = response.data.data.children;

                for (let i=0; i<data.length;i++) {

                    if (data[i].kind === 't5') {
                        res.status(200).send(posts);
                        return false;
                    }

                    posts.push({
                        sub: data[i].data.subreddit_name_prefixed,
                        title: data[i].data.title,
                        comments: data[i].data.permalink,
                        url: data[i].data.url,
                        thumbnail: data[i].data.thumbnail,
                        media_embed: data[i].data.media_embed,
                        media: data[i].data.media,
                        author: data[i].data.author,
                        num_comments: data[i].data.num_comments,
                        preview: data[i].data.preview,
                        link_text: data[i].data.link_flair_text,
                        ups: data[i].data.ups,
                        is_video: data[i].data.is_video,
                        created: data[i].data.created_utc
                    });
                }

                res.status(200).send(posts);
            }

        } catch (error) {
            console.error(error.message);
            res.status(error.response.status).send(error.response.data);
        }

    })();
};
