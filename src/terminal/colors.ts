//
//  colors.ts
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

export const rgbToAnsi256 = (red: number, green: number, blue: number) => { 
  if (red === green && green === blue) {
    if (red < 8) return 16;
    if (red > 248) return 231;
    return Math.round(((red - 8) / 247) * 24) + 232;
  }
  return 16
    + (36 * Math.round(red / 255 * 5))
    + (6 * Math.round(green / 255 * 5))
    + Math.round(blue / 255 * 5);
}

export const ansi256ToAnsi16 = (code: number) => {
  if (code < 8) return 30 + code;
  if (code < 16) return 90 + (code - 8);

  let red;
  let green;
  let blue;

  if (code >= 232) {
    red = (((code - 232) * 10) + 8) / 255;
    green = red;
    blue = red;
  } else {
    code -= 16;
    const remainder = code % 36;
    red = Math.floor(code / 36) / 5;
    green = Math.floor(remainder / 6) / 5;
    blue = (remainder % 6) / 5;
  }

  const value = Math.max(red, green, blue) * 2;
  if (value === 0) return 30;

  const result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));
  return value === 2 ? result + 60 : result;
}