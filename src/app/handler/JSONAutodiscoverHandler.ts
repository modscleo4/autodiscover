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

import { Application } from 'midori/app';
import { HTTPError } from 'midori/errors';
import { EStatusCode, Handler, Request, Response } from 'midori/http';

import { AutodiscoverConfig, AutodiscoverConfigProvider } from '@app/providers/AutodiscoverConfigProvider.js';

export default class AutodiscoverHandler extends Handler {
    #config?: AutodiscoverConfig;

    constructor(app: Application) {
        super(app);

        this.#config = app.config.get(AutodiscoverConfigProvider);
    }

    async handle(req: Request<{ Autodiscover: { Request: { EMailAddress: string, AcceptableResponseSchema: string; }; }; }>): Promise<Response> {
        if (!this.#config) {
            throw new HTTPError('Autodiscover not configured', EStatusCode.INTERNAL_SERVER_ERROR);
        }

        const email = req.query.get('Email');
        const protocol = req.query.get('Protocol');

        switch (protocol) {
            case 'ActiveSync':
                return Response.json({
                    Protocol: 'ActiveSync',
                    Url: this.#config.activeSync.url,
                });

            case 'AutodiscoverV1':
                return Response.json({
                    Protocol: 'AutodiscoverV1',
                    Url: `${req.headers.host}/autodiscover/autodiscover.xml`
                });
        }

        return Response.json({
            ErrorCode: 'InvalidProtocol',
            ErrorMessage: `The given protocol value '${protocol}' is invalid. Supported values are 'ActiveSync,AutodiscoverV1'`
        }).withStatus(EStatusCode.BAD_REQUEST);
    }
}
