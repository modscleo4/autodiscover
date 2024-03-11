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

import { readFileSync } from 'fs';

import { Application } from 'midori/app';
import { HTTPError } from 'midori/errors';
import { EStatusCode, Handler, Request, Response } from 'midori/http';

import { AutodiscoverConfig, AutodiscoverConfigProvider } from '@app/providers/AutodiscoverConfigProvider.js';
import { parser as xmlParser } from '@core/lib/xml.js';

export default class AutodiscoverHandler extends Handler {
    #defaultFile: string;
    #config?: AutodiscoverConfig;

    constructor(app: Application) {
        super(app);

        this.#defaultFile = readFileSync('autodiscover.default.xml', { encoding: 'utf-8' });
        this.#config = app.config.get(AutodiscoverConfigProvider);
    }

    override async handle(req: Request<{ Autodiscover: { Request: { EMailAddress: string, AcceptableResponseSchema: string; }; }; }>): Promise<Response> {
        if (!this.#config) {
            throw new HTTPError('Autodiscover not configured', EStatusCode.INTERNAL_SERVER_ERROR);
        }

        const xml = xmlParser.parse(this.#defaultFile);

        const user = req.parsedBody?.Autodiscover?.Request?.EMailAddress;
        if (user) {
            for (let i = 0; i < xml.Autodiscover.Response.Account.Protocol.length; i++) {
                xml.Autodiscover.Response.Account.Protocol[i].LoginName = user;
            }
        }

        xml.Autodiscover.Response.Account.Protocol[0].Server = this.#config.imap.host;
        if (this.#config.imap.port) {
            xml.Autodiscover.Response.Account.Protocol[0].Port = this.#config.imap.port;
        }

        xml.Autodiscover.Response.Account.Protocol[1].Server = this.#config.pop3.host;
        if (this.#config.pop3.port) {
            xml.Autodiscover.Response.Account.Protocol[1].Port = this.#config.pop3.port;
        }

        xml.Autodiscover.Response.Account.Protocol[2].Server = this.#config.smtp.host;
        if (this.#config.smtp.port) {
            xml.Autodiscover.Response.Account.Protocol[2].Port = this.#config.smtp.port;
        }

        return Response.auto(xml, req, ['text/xml', 'application/xml']);
    }
}
