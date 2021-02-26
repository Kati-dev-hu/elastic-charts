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

const firstAlpha = [{ startAngle: -45 }];
const chosen = 0;

const startConfig = firstAlpha[chosen];
export const Example = () => {
  const base = number('base', 0, { range: true, min: 0, max: 300, step: 1 });
  const target = number('target', 260, { range: true, min: 0, max: 300, step: 1 });
  const actual = number('actual', 170, { range: true, min: 0, max: 300, step: 1 });
  const spiral = select('shape', { oval: 'archimedean', rectangular: 'rectangular' }, 'archimedean');
  const startAngle = number('startAngle', startConfig.startAngle, { range: true, min: -360, max: 360, step: 1 });
  const endAngle = number('endAngle', 45, { range: true, min: -360, max: 360, step: 1 });
  const angleCount = number('angleCount', 2, { range: true, min: 2, max: 360, step: 1 });
  const padding = number('padding', 2, { range: true, min: 0, max: 10, step: 1 });
  const exponent = number('exponent', 3, { range: true, min: 0, max: 15, step: 1 });
  const fontWeight = number('fontWeight', 300, { range: true, min: 100, max: 900, step: 100 });
  const minFontSize = number('minFontSize', 10, { range: true, min: 6, max: 85, step: 1 });
  const maxFontSize = number('maxFontSize', 90, { range: true, min: 15, max: 150, step: 1 });
  const fontFamily = select(
    'fontFamily',
    { Arial: 'Arial', Arial_Narrow: 'Arial Narrow', Courier: 'Courier', Impact: 'Impact', Luminari: 'Luminari' },
    'Arial Narrow',
  );
  const fontStyle = select('fontStyle', { normal: 'normal', italic: 'italic' }, 'normal');

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
