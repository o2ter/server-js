//
//  logger.ts
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
import morgan from 'morgan';
import chalk from 'chalk';

export const logger = morgan(
  (tokens, req, res) => {

    const date = tokens.date(req, res, 'iso');
    const remoteAddr = tokens['remote-addr'](req, res);
    const httpVersion = tokens['http-version'](req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res) || '-';
    const responseTime = tokens['response-time'](req, res);
    const totalTime = tokens['total-time'](req, res);
    const contentLength = tokens.res(req, res, 'content-length') || '-';

    const _status = Number(status);
    const color = _status >= 500 ? chalk.red
      : _status >= 400 ? chalk.yellow
        : _status >= 300 ? chalk.cyan
          : _status >= 200 ? chalk.green
            : chalk.visible;

    return [
      chalk.magenta(`[${date}]`),
      remoteAddr,
      `HTTP/${httpVersion}`,
      method,
      url,
      color(status),
      `${contentLength} bytes`,
      chalk.bold(`${totalTime}ms`),
      `${responseTime}ms`,
    ].join(' ');
  },
  { stream: { write: (str) => console.info(str.trim()) } }
);
