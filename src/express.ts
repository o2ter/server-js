//
//  express.ts
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
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { defaultLogger, logHandler } from './logger';
import { csrfHandler, CsrfOptions } from './csrf';

export type ExpressOptions = {
  trustProxy?: string;
  compression?: compression.CompressionOptions;
  cookie?: cookieParser.CookieParseOptions & {
    secret?: string | string[];
  };
  cors?: cors.CorsOptions;
  csrf?: CsrfOptions;
  rateLimit?: Parameters<typeof rateLimit>[0];
}

const defaultTrustProxy = () => {
  const TRUST_PROXY = process.env.TRUST_PROXY;
  if (TRUST_PROXY?.toLowerCase() === 'true') return true;
  const num = Number(TRUST_PROXY);
  return _.isSafeInteger(num) ? num : TRUST_PROXY;
}

export const createExpress = (
  options: ExpressOptions,
  logger: typeof defaultLogger,
) => {
  const {
    trustProxy = defaultTrustProxy(),
    compression: compressionOpts,
    cookie: {
      secret: cookieSecret,
      ...cookieOtps
    } = {},
    cors: corsOpts,
    csrf: csrfOpts,
    rateLimit: rateLimitOpts,
  } = options;
  const app = express();
  if (trustProxy) app.set('trust proxy', trustProxy);
  app.use(logHandler(logger));
  app.use(rateLimit(rateLimitOpts ?? {}));
  if (corsOpts) app.use(cors(corsOpts));
  if (csrfOpts) app.use(csrfHandler(csrfOpts));
  app.use(compression(compressionOpts));
  app.use(cookieParser(cookieSecret, cookieOtps));
  return app;
};
