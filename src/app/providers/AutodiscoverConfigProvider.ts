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

import { Application, ConfigProvider } from "midori/app";
import { Constructor } from "midori/util/types.js";

export type AutodiscoverConfig = {
    imap: {
        host: string;
        port?: number;
    },
    pop3: {
        host: string;
        port?: number;
    },
    smtp: {
        host: string;
        port?: number;
    },
    activeSync: {
        url: string;
    }
};

export abstract class AutodiscoverConfigProvider extends ConfigProvider<AutodiscoverConfig> {
    static config: string = 'autodiscover::autodiscover';
}

export default function AutodiscoverConfigProviderFactory(config: AutodiscoverConfig): Constructor<AutodiscoverConfigProvider> & { [K in keyof typeof AutodiscoverConfigProvider]: typeof AutodiscoverConfigProvider[K] } {
    return class extends AutodiscoverConfigProvider {
        register(app: Application): AutodiscoverConfig {
            return config;
        }
    }
}
