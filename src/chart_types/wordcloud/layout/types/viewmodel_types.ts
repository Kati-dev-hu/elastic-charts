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

import { Pixels, PointObject } from '../../../../common/geometry';
import { SpecTypes } from '../../../../specs/constants';
import { WordcloudBandFillColorAccessorInput } from '../../specs';
import { GoalSubtype } from '../../specs/constants';
import { config } from '../config/config';
import { Config } from './config_types';
import { Color } from '../../../../utils/common';

interface BandViewModel {
  value: number;
  fillColor: string;
}

interface TickViewModel {
  value: number;
  text: string;
}

/** @internal */
export interface DataModel {
  text: string;
  weight: number;
  color: Color;
}

/** @internal */
export interface BulletViewModel {
  subtype: string;
  base: number;
  target: number;
  startAngle: number;
  endAngle: number;
  angleCount: number;
  padding: number;
  fontWeight: number;
  fontFamily: string;
  fontStyle: string;
  minFontSize: number;
  maxFontSize: number;
  spiral: string;
  exponent: number;
  data: DataModel[];
  actual: number;
  bands: Array<BandViewModel>;
  ticks: Array<TickViewModel>;
  labelMajor: string;
  labelMinor: string;
  centralMajor: string;
  centralMinor: string;
  highestValue: number;
  lowestValue: number;
  aboveBaseCount: number;
  belowBaseCount: number;
}

/** @internal */
export type PickFunction = (x: Pixels, y: Pixels) => Array<BulletViewModel>;

/** @internal */
export type ShapeViewModel = {
  config: Config;
  bulletViewModel: BulletViewModel;
  chartCenter: PointObject;
  pickQuads: PickFunction;
};

const commonDefaults = {
  specType: SpecTypes.Series,
  subtype: GoalSubtype.Goal,
  base: 0,
  startAngle: -20,
  endAngle: 20,
  angleCount: 5,
  padding: 2,
  fontWeight: 300,
  fontFamily: 'Impact',
  fontStyle: 'italic',
  minFontSize: 10,
  maxFontSize: 50,
  spiral: 'archimedean',
  exponent: 3,
  data: [],
  target: 100,
  actual: 50,
  ticks: [0, 25, 50, 75, 100],
};

/** @internal */
export const defaultWordcloudSpec = {
  ...commonDefaults,
  bands: [50, 75, 100],
  bandFillColor: ({ value, base, highestValue, lowestValue }: WordcloudBandFillColorAccessorInput) => {
    const aboveBase = value > base;
    const ratio = aboveBase
      ? (value - base) / (Math.max(base, highestValue) - base)
      : (value - base) / (Math.min(base, lowestValue) - base);
    const level = Math.round(255 * ratio);
    return aboveBase ? `rgb(0, ${level}, 0)` : `rgb( ${level}, 0, 0)`;
  },
  tickValueFormatter: ({ value }: WordcloudBandFillColorAccessorInput) => String(value),
  labelMajor: ({ base }: WordcloudBandFillColorAccessorInput) => String(base),
  // eslint-disable-next-line no-empty-pattern
  labelMinor: ({}: WordcloudBandFillColorAccessorInput) => 'unit',
  centralMajor: ({ base }: WordcloudBandFillColorAccessorInput) => String(base),
  centralMinor: ({ target }: WordcloudBandFillColorAccessorInput) => String(target),
};

/** @internal */
export const nullGoalViewModel = {
  ...commonDefaults,
  bands: [],
  ticks: [],
  data: [],
  labelMajor: '',
  labelMinor: '',
  centralMajor: '',
  centralMinor: '',
  highestValue: 100,
  lowestValue: 0,
  aboveBaseCount: 0,
  belowBaseCount: 0,
};

/** @internal */
export const nullShapeViewModel = (specifiedConfig?: Config, chartCenter?: PointObject): ShapeViewModel => ({
  config: specifiedConfig || config,
  bulletViewModel: nullGoalViewModel,
  chartCenter: chartCenter || { x: 0, y: 0 },
  pickQuads: () => [],
});
