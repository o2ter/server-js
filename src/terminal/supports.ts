//
//  supports.ts
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
import os from 'os';

const CI_LEVEL = {
  'GITHUB_ACTIONS': 3,
  'GITEA_ACTIONS': 3,
  'TRAVIS': 1,
  'CIRCLECI': 1,
  'APPVEYOR': 1,
  'GITLAB_CI': 1,
  'BUILDKITE': 1,
  'DRONE': 1,
};

export const supports = () => {

  const env = process.env;

  const FORCE_COLOR = env.FORCE_COLOR;
  if (!_.isEmpty(FORCE_COLOR)) return Math.max(0, Math.min(3, Number(FORCE_COLOR) || 0));

  // Azure DevOps pipelines
  if ('TF_BUILD' in env && 'AGENT_NAME' in env) return 1;

  if (env.TERM === 'dumb') return 0;

  if (process.platform === 'win32') {
    const osRelease = os.release().split('.');
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10_586) {
      return Number(osRelease[2]) >= 14_931 ? 3 : 2;
    }
    return 1;
  }

  if ('CI' in env) {
    if (env.CI_NAME === 'codeship') return 1;
    return _.find(CI_LEVEL, (level, sign) => sign in env) ?? 0;
  }

  if ('TEAMCITY_VERSION' in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION || '') ? 1 : 0;
  }

  if (env.COLORTERM === 'truecolor') return 3;
  if (env.TERM === 'xterm-kitty') return 3;

  if ('TERM_PROGRAM' in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
    switch (env.TERM_PROGRAM) {
      case 'iTerm.app': return version >= 3 ? 3 : 2;
      case 'Apple_Terminal': return 2;
    }
  }

  if (/-256(color)?$/i.test(env.TERM || '')) return 2;
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM || '')) return 1;
  if ('COLORTERM' in env) return 1;

  return 0;
};
