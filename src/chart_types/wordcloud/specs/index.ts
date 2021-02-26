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

import React from 'react';

import { ChartTypes } from '../..';
import { Spec } from '../../../specs';
import { SpecTypes } from '../../../specs/constants';
import { getConnect, specComponentFactory } from '../../../state/spec_factory';
import { Color, RecursivePartial } from '../../../utils/common';
import { config } from '../layout/config/config';
import { Config } from '../layout/types/config_types';
import { defaultWordcloudSpec } from '../layout/types/viewmodel_types';
import { GoalSubtype } from './constants';

/** @alpha */
export interface WordcloudBandFillColorAccessorInput {
  value: number;
  index: number;
  base: number;
  startAngle: number;
  endAngle: number;
  angleCount: number;
  padding: number;
  fontWeight: number;
  fontFamily: string;
  fontStyle: string;
  target: number;
  highestValue: number;
  lowestValue: number;
  aboveBaseCount: number;
  belowBaseCount: number;
}

/** @alpha */
export type WordcloudBandFillColorAccessor = (input: WordcloudBandFillColorAccessorInput) => Color;

const defaultProps = {
  chartType: ChartTypes.Wordcloud,
  ...defaultWordcloudSpec,
  config,
};

/** @alpha */
export interface WordcloudSpec extends Spec {
  specType: typeof SpecTypes.Series;
  chartType: typeof ChartTypes.Wordcloud;
  subtype: GoalSubtype;
  base: number;
  startAngle: number;
  endAngle: number;
  angleCount: number;
  padding: number;
  fontWeight: number;
  fontFamily: string;
  fontStyle: string;
  minFontSize: number;
  maxFontSize: number;
  target: number;
  actual: number;
  bands: number[];
  ticks: number[];
  bandFillColor: WordcloudBandFillColorAccessor;
  tickValueFormatter: WordcloudBandFillColorAccessor;
  labelMajor: string | WordcloudBandFillColorAccessor;
  labelMinor: string | WordcloudBandFillColorAccessor;
  centralMajor: string | WordcloudBandFillColorAccessor;
  centralMinor: string | WordcloudBandFillColorAccessor;
  config: RecursivePartial<Config>;
}

type SpecRequiredProps = Pick<WordcloudSpec, 'id' | 'actual'>;
type SpecOptionalProps = Partial<Omit<WordcloudSpec, 'chartType' | 'specType' | 'id' | 'data'>>;

/** @alpha */
export const Wordcloud: React.FunctionComponent<SpecRequiredProps & SpecOptionalProps> = getConnect()(
  specComponentFactory<
    WordcloudSpec,
    | 'config'
    | 'chartType'
    | 'startAngle'
    | 'endAngle'
    | 'angleCount'
    | 'padding'
    | 'fontWeight'
    | 'fontFamily'
    | 'fontStyle'
    | 'subtype'
    | 'base'
    | 'target'
    | 'actual'
    | 'bands'
    | 'ticks'
    | 'bandFillColor'
    | 'tickValueFormatter'
    | 'labelMajor'
    | 'labelMinor'
    | 'centralMajor'
    | 'centralMinor'
  >(defaultProps),
);
