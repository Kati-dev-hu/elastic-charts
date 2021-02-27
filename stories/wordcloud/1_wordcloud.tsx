/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { number, color, array, select } from '@storybook/addon-knobs';
import React from 'react';

import { Chart, PartitionLayout, Wordcloud } from '../../src';
import { BandFillColorAccessorInput } from '../../src/chart_types/goal_chart/specs';
import { GoalSubtype } from '../../src/chart_types/goal_chart/specs/constants';
import { Color } from '../../src/utils/common';

const subtype = GoalSubtype.Goal;

const configs = [
  {
    startAngle: -45,
    endAngle: 45,
    angleCount: 2,
    padding: 0,
    exponent: 3,
    fontWeight: 100,
    minFontSize: 10,
    maxFontSize: 90,
    fontFamily: 'Arial Narrow',
    fontStyle: 'normal',
    shape: 'archimedean',
  },
  {
    startAngle: -15,
    endAngle: 15,
    angleCount: 7,
    padding: 0,
    exponent: 5,
    fontWeight: 600,
    minFontSize: 17,
    maxFontSize: 79,
    fontFamily: 'Impact',
    fontStyle: 'normal',
    shape: 'rectangular',
  },
  {
    startAngle: 0,
    endAngle: 25,
    angleCount: 16,
    padding: 0,
    exponent: 7,
    fontWeight: 100,
    minFontSize: 17,
    maxFontSize: 79,
    fontFamily: 'Luminari',
    fontStyle: 'italic',
    shape: 'archimedean',
  },
  {
    startAngle: 0,
    endAngle: 90,
    angleCount: 2,
    padding: 1,
    exponent: 4,
    fontWeight: 600,
    minFontSize: 14,
    maxFontSize: 92,
    fontFamily: 'Arial Narrow',
    fontStyle: 'normal',
    shape: 'rectangular',
  },
];
const chosen = 0;

const startConfig = configs[chosen];
export const Example = () => {
  const base = number('base', 0, { range: true, min: 0, max: 300, step: 1 });
  const target = number('target', 260, { range: true, min: 0, max: 300, step: 1 });
  const actual = number('actual', 170, { range: true, min: 0, max: 300, step: 1 });
  const spiral = select('shape', { oval: 'archimedean', rectangular: 'rectangular' }, startConfig.shape);
  const startAngle = number('startAngle', startConfig.startAngle, { range: true, min: -360, max: 360, step: 1 });
  const endAngle = number('endAngle', startConfig.endAngle, { range: true, min: -360, max: 360, step: 1 });
  const angleCount = number('angleCount', startConfig.angleCount, { range: true, min: 2, max: 360, step: 1 });
  const padding = number('padding', startConfig.padding, { range: true, min: 0, max: 10, step: 1 });
  const exponent = number('exponent', startConfig.exponent, { range: true, min: 0, max: 15, step: 1 });
  const fontWeight = number('fontWeight', startConfig.fontWeight, { range: true, min: 100, max: 900, step: 100 });
  const minFontSize = number('minFontSize', startConfig.minFontSize, { range: true, min: 6, max: 85, step: 1 });
  const maxFontSize = number('maxFontSize', startConfig.maxFontSize, { range: true, min: 15, max: 150, step: 1 });
  const fontFamily = select(
    'fontFamily',
    { Arial: 'Arial', Arial_Narrow: 'Arial Narrow', Courier: 'Courier', Impact: 'Impact', Luminari: 'Luminari' },
    startConfig.fontFamily,
  );
  const fontStyle = select('fontStyle', { normal: 'normal', italic: 'italic' }, startConfig.fontStyle);

  const ticks = array('ticks', ['0', '50', '100', '150', '200', '250', '300']).map(Number);
  const bands = array('bands', ['200', '250', '300']).map(Number);

  const opacityMap: { [k: string]: number } = {
    '200': 0.2,
    '250': 0.12,
    '300': 0.05,
  };

  const colorMap: { [k: number]: Color } = bands.reduce<{ [k: number]: Color }>((acc, band) => {
    const defaultValue = opacityMap[band] ?? 0;
    acc[band] = color(`color at ${band}`, `rgba(0,0,0,${defaultValue.toFixed(2)})`, 'colors');
    return acc;
  }, {});

  const bandFillColor = (x: number): Color => colorMap[x];
  console.log('story', { minFontSize, maxFontSize });
  return (
    <Chart className="story-chart">
      <Wordcloud
        id="spec_1"
        subtype={subtype}
        startAngle={startAngle}
        endAngle={endAngle}
        angleCount={angleCount}
        padding={padding}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        fontStyle={fontStyle}
        minFontSize={minFontSize}
        maxFontSize={maxFontSize}
        spiral={spiral}
        exponent={exponent}
        base={base}
        target={target}
        actual={actual}
        bands={bands}
        ticks={ticks}
        tickValueFormatter={({ value }: BandFillColorAccessorInput) => String(value)}
        bandFillColor={({ value }: BandFillColorAccessorInput) => bandFillColor(value)}
        labelMajor="Revenue 2020 YTD  "
        labelMinor="(thousand USD)  "
        centralMajor={`${actual}`}
        centralMinor=""
        config={{ angleStart: Math.PI, angleEnd: 0 }}
      />
    </Chart>
  );
};
