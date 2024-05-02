//
//  server.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import _ from 'lodash';
import express, { Express } from 'express';
import { createExpress, ExpressOptions } from './express';
import { ServerOptions, createHttpServer } from './http';
import { Server as IOServer, ServerOptions as IOServerOptions } from 'socket.io';
import { defaultLogger } from './logger';

type Options = ServerOptions & {
  express?: ExpressOptions;
  socket?: Partial<IOServerOptions>;
  logger?: typeof defaultLogger;
};

export {
  Router,
  Request,
  Response,
  RequestHandler,
  CookieOptions,
} from 'express';

export class Server {

  static json = express.json;
  static raw = express.raw;
  static Router = express.Router;
  static static = express.static;
  static text = express.text;
  static urlencoded = express.urlencoded;

  private _express?: Express;
  private _server?: ReturnType<typeof createHttpServer>;
  private _socket?: IOServer;

  private options?: Options;

  constructor(options?: Options) {
    this.options = options;
  }

  logger() {
    return this.options?.logger ?? defaultLogger;
  }

  express() {
    return this._express = this._express ?? createExpress(this.options?.express ?? {}, { write: (str) => this.logger().write(str) });
  }

  server() {
    const { socket, express, logger, ...options } = this.options ?? {};
    return this._server = this._server ?? createHttpServer(options, this.express());
  }

  socket() {
    return this._socket = this._socket ?? new IOServer(this.server(), this.options?.socket);
  }

  get use() {
    const express = this.express();
    return express.use.bind(express);
  }

  get render() {
    const express = this.express();
    return express.render.bind(express);
  }

  address() {
    return this.server().address();
  }

  get listen() {
    const server = this.server();
    return server.listen.bind(server);
  }

  close() {
    return new Promise<void>((res, rej) => {
      this.server().close((err) => _.isNil(err) ? res() : rej(err));
    });
  }
}
