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
import { supports } from './supports';
import { ansi256ToAnsi16, rgbToAnsi256 } from './colors';

type Colors = keyof typeof styles.colors;

const _ansi16Styler = (open: number, close: number, str: string) => `${styles.ansi16(open)}${str}${styles.ansi16(close)}`;
const _ansi256Styler = (code: number, offset: number, str: string) => `${styles.ansi256(code, offset)}${str}${styles.ansi16(styles.COLOR_RESET)}`;

const ansi16Styler = (open: number, close: number) => (str: string) => supports() < 1 ? str : _ansi16Styler(open, close, str);

const ansi256Styler = (code: number, offset: number) => (str: string) => {
  switch (supports()) {
    case 0: return str;
    case 1: return _ansi16Styler(ansi256ToAnsi16(code), styles.COLOR_RESET, str);
    default: return _ansi256Styler(code, offset, str);
  }
};

const ansiRGBStyler = (red: number, green: number, blue: number, offset: number) => (str: string) => {
  switch (supports()) {
    case 0: return str;
    case 1: return _ansi16Styler(ansi256ToAnsi16(rgbToAnsi256(red, green, blue)), styles.COLOR_RESET, str);
    case 2: return _ansi256Styler(rgbToAnsi256(red, green, blue), offset, str);
    default: return `${styles.ansiRGB(red, green, blue, offset)}${str}${styles.ansi16(styles.COLOR_RESET)}`;
  }
};

export const Terminal = {
  ..._.mapValues(styles.modifiers, ([open, close]) => ansi16Styler(open, close)),
  ..._.mapValues(styles.colors, (code) => ansi16Styler(code, styles.COLOR_RESET)),
  ..._.mapValues(
    _.mapKeys(styles.colors, k => `${k}Bg`) as { [C in Colors as `${C}Bg`]: number },
    (code) => ansi16Styler(code + styles.ANSI_BACKGROUND_OFFSET, styles.COLOR_RESET)
  ),
  ansi256: (code: number) => (str: string) => ansi256Styler(code, 0),
  ansi256Bg: (code: number) => (str: string) => ansi256Styler(code, styles.ANSI_BACKGROUND_OFFSET),
  rgb: (red: number, green: number, blue: number) => (str: string) => ansiRGBStyler(red, green, blue, 0),
  rgbBg: (red: number, green: number, blue: number) => (str: string) => ansiRGBStyler(red, green, blue, styles.ANSI_BACKGROUND_OFFSET),
};
