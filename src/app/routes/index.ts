/**
 * Copyright 2023 Dhiego Cassiano Fogaça Barbosa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Router as RouterWrapper } from "midori/router";
import { Response } from "midori/http";

import AutodiscoverHandler from "@app/handler/AutodiscoverHandler.js";
import JSONAutodiscoverHandler from "@app/handler/JSONAutodiscoverHandler.js";

const Router = new RouterWrapper();

/**
 * Routing
 *
 * Define your routes here
 * Use the Router.get(), Router.post(), Router.put(), Router.patch(), Router.delete() methods to define your routes
 * Use the Router.group() method to group routes under a common prefix
 * Use the Router.route() method to define a route using a custom HTTP method
 */

Router.get('/', AutodiscoverHandler);
Router.post('/autodiscover/autodiscover.xml', AutodiscoverHandler);
Router.get('/autodiscover/autodiscover.json', JSONAutodiscoverHandler);
Router.get('/autodiscover/autodiscover.json/v1.0/{Email}', JSONAutodiscoverHandler);

export default Router;
