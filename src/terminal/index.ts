//
//  index.ts
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
import * as styles from './styles';
import { supportColors } from './supportColors';

const createAnsi16Builder = (
  open: number,
  close: number,
) => (str: string) => {
  if (supportColors() < 1) return str;
  return `${styles.ansi16(open)}${str}${styles.ansi16(close)}`;
};

type Colors = keyof typeof styles.colors;

export const Terminal = {
  ..._.mapValues(styles.modifiers, ([open, close]) => createAnsi16Builder(open, close)),
  ..._.mapValues(styles.colors, (code) => createAnsi16Builder(code, styles.COLOR_RESET)),
  ..._.mapValues(
    _.mapKeys(styles.colors, k => `${k}Bg`) as { [C in Colors as `${C}Bg`]: number },
    (code) => createAnsi16Builder(code + styles.ANSI_BACKGROUND_OFFSET, styles.COLOR_RESET)
  ),
};
