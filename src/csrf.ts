//
//  csrf.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
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
import { RequestHandler } from 'express';
import { XSRF_COOKIE_NAME, XSRF_HEADER_NAME } from './const';
import csrf from 'csrf';

const _csrf = new csrf();

export type CsrfOptions = {
  token: string;
  cookieName?: string,
  headerName?: string,
};

export const csrfHandler = (options: CsrfOptions): RequestHandler => (req, res, next) => {

  if (req.is('application/json')) return next();

  const xsrfToken = _csrf.create(options.token);
  res.locals.xsrfToken = xsrfToken;
  res.cookie(options.cookieName ?? XSRF_COOKIE_NAME, xsrfToken);

  const header_token = req.get(options.headerName ?? XSRF_HEADER_NAME);
  if (!_.isNil(header_token) && _csrf.verify(options.token, header_token)) return next();

  res.sendStatus(412);
};
