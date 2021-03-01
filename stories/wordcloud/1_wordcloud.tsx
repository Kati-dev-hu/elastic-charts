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

import { number, select } from '@storybook/addon-knobs';
import React from 'react';

import { Chart, Settings, Wordcloud } from '../../src';
import { WordModel } from '../../src/chart_types/wordcloud/layout/types/viewmodel_types';
import { getRandomNumberGenerator } from '../../src/mocks/utils';
import { palettes as euiPalettes } from '../../src/utils/themes/colors';

const text =
  'Webtwo ipsum sifteo twones chegg lijit meevee spotify, joukuu wakoopa greplin. Sclipo octopart wufoo, balihoo. Kiko groupon fleck revver blyve joyent dogster, zoodles zooomr scribd dogster mog. Zinch orkut jabber trulia, sclipo. Chumby imvu rovio ning zoho akismet napster, kippt zillow mzinga zoho. ' +
  'Zoho cotweet cloudera zinch spock divvyshot edmodo convore, geni palantir geni woopra divvyshot. Zoho imeem convore orkut oooj foodzie airbnb, jabber rovio klout spotify dropio. Insala octopart wikia xobni airbnb quora mzinga elgg, mog quora blekko boxbe plickers zlio. Sococo chumby trulia ebay sococo zoho lijit, spock nuvvo omgpop heekya koofers. Kazaa voki chegg napster mozy koofers, meebo heroku empressr foodzie. ' +
  // 'Meevee movity fleck waze palantir glogster ebay, scribd chegg zinch spotify. Zinch vimeo joukuu insala jaiku squidoo, kaboodle quora shopify. Imeem plickers zapier ning eskobo movity omgpop zillow, voxy knewton napster kippt quora gooru. Whrrl chegg klout hulu greplin, dogster balihoo yuntaa. Oovoo ebay kosmix eduvant meebo ning, akismet zapier meevee. Oooooc blekko cotweet nuvvo sclipo zinch movity kaboodle, zooomr insala sclipo loopt hojoki qeyno. Airbnb palantir skype, etsy. ' +
  // 'Joost cotweet knewton bubbli, unigo twones. Akismet skype scribd vimeo, skype omgpop kno imvu, shopify dropio. Jajah heroku xobni glogster twones jabber rovio, jaiku blippy wikia jumo oooooc. Jumo lijit tumblr jibjab zooomr sifteo hojoki mog reddit, jabber twitter zinch doostang wakoopa ebay. Yoono klout weebly geni blippy, twitter kno yoono edmodo, joyent joukuu mzinga. ' +
  'zappos. Ning babblely trulia zooomr vimeo, zimbra plaxo. Zooomr blyve stypi joukuu imvu chumby voxy, ideeli omgpop elgg geni qeyno joyent, loopt reddit eskobo flickr odeo. Heekya plickers wesabe lijit kno, hojoki convore.';

const getRandomNumber = getRandomNumberGenerator();

const palettes = {
  warm: (d, i) => ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'][i % 5],
  greenBlues: () => `rgb(${getRandomNumber(0, 10)}, ${getRandomNumber(50, 100)}, ${getRandomNumber(50, 100)})`,
  redBlue: () => `rgb(${getRandomNumber(0, 255)},${0},${getRandomNumber(0, 255)})`,
  greyScale: () => {
    const level = getRandomNumber(0, 200);
    return `rgb(${level},${level},${level})`;
  },
  weight: (d) => {
    const level = (1 - d.weight ** 15) * 200;
    return `rgb(${level},${level},${level})`;
  },
  euiLight: (d, i) => {
    return euiPalettes.echPaletteForLightBackground.colors[i % euiPalettes.echPaletteForLightBackground.colors.length];
  },
  euiColorBlind: (d, i) => {
    return euiPalettes.echPaletteColorBlind.colors[i % euiPalettes.echPaletteColorBlind.colors.length];
  },
};

const configs = {
  edit: {
    startAngle: -90,
    endAngle: 90,
    angleCount: 16,
    padding: 0.5,
    exponent: 15,
    fontWeight: 100,
    minFontSize: 15,
    maxFontSize: 120,
    fontFamily: 'Luminari',
    fontStyle: 'italic',
    shape: 'archimedean',
    palette: 'warm',
  },
  single: {
    startAngle: 0,
    endAngle: 0,
    angleCount: 1,
    padding: 1,
    exponent: 4,
    fontWeight: 900,
    minFontSize: 14,
    maxFontSize: 92,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    shape: 'rectangular',
    palette: 'greyScale',
  },
  rightAngled: {
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
    palette: 'euiLight',
  },
  multiple: {
    startAngle: -90,
    endAngle: 90,
    angleCount: 16,
    padding: 1,
    exponent: 15,
    fontWeight: 100,
    minFontSize: 16,
    maxFontSize: 50,
    fontFamily: 'Luminari',
    fontStyle: 'italic',
    shape: 'archimedean',
    palette: 'redBlue',
  },
  squareWords: {
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
    palette: 'weight',
  },
  smallWaves: {
    startAngle: -15,
    endAngle: 15,
    angleCount: 7,
    padding: 0.5,
    exponent: 5,
    fontWeight: 600,
    minFontSize: 17,
    maxFontSize: 79,
    fontFamily: 'Impact',
    fontStyle: 'normal',
    shape: 'rectangular',
    palette: 'euiColorBlind',
  },
  sparse: {
    startAngle: 0,
    endAngle: 0,
    angleCount: 1,
    padding: 10,
    exponent: 15,
    fontWeight: 600,
    minFontSize: 12,
    maxFontSize: 60,
    fontFamily: 'Courier',
    fontStyle: 'normal',
    shape: 'rectangular',
    palette: 'greyScale',
  },
};

const rawData = text
  .replace(/[,.]/g, '')
  .toLowerCase()
  .split(' ')
  .filter((d, index, a) => a.indexOf(d) === index)
  .map(function (d) {
    return {
      text: d,
      weight: getRandomNumber(0, 1, 20),
    };
  });

function data(text: string, paletteName: string): WordModel[] {
  return rawData.map(function (d, i) {
    return {
      ...d,
      color: palettes[paletteName](d, i),
    };
  });
}

export const Example = () => {
  const configName = select(
    'config',
    Object.keys(configs).reduce((p, k) => ({ ...p, [k]: k }), {}),
    'edit',
  );
  const startConfig = configs[configName];
  const template = configName !== 'edit';
  const spiral = template
    ? startConfig.shape
    : select('shape', { oval: 'archimedean', rectangular: 'rectangular' }, startConfig.shape);
  const startAngle = template
    ? startConfig.startAngle
    : number('startAngle', startConfig.startAngle, { range: true, min: -360, max: 360, step: 1 });
  const endAngle = template
    ? startConfig.endAngle
    : number('endAngle', startConfig.endAngle, { range: true, min: -360, max: 360, step: 1 });
  const angleCount = template
    ? startConfig.angleCount
    : number('angleCount', startConfig.angleCount, { range: true, min: 2, max: 360, step: 1 });
  const padding = template
    ? startConfig.padding
    : number('padding', startConfig.padding, { range: true, min: 0, max: 10, step: 0.5 });
  const exponent = template
    ? startConfig.exponent
    : number('exponent', startConfig.exponent, { range: true, min: 0, max: 15, step: 1 });
  const fontWeight = template
    ? startConfig.fontWeight
    : number('fontWeight', startConfig.fontWeight, { range: true, min: 100, max: 900, step: 100 });
  const minFontSize = template
    ? startConfig.minFontSize
    : number('minFontSize', startConfig.minFontSize, { range: true, min: 6, max: 85, step: 1 });
  const maxFontSize = template
    ? startConfig.maxFontSize
    : number('maxFontSize', startConfig.maxFontSize, { range: true, min: 15, max: 150, step: 1 });
  const fontFamily = template
    ? startConfig.fontFamily
    : select(
        'fontFamily',
        { Arial: 'Arial', 'Arial Narrow': 'Arial Narrow', Courier: 'Courier', Impact: 'Impact', Luminari: 'Luminari' },
        startConfig.fontFamily,
      );
  const fontStyle = template
    ? startConfig.fontStyle
    : select('fontStyle', { normal: 'normal', italic: 'italic' }, startConfig.fontStyle);
  const palette = template
    ? startConfig.palette
    : select(
        'palette',
        Object.keys(palettes).reduce((p, k) => ({ ...p, [k]: k }), {}),
        startConfig.palette,
      );

  return (
    <Chart className="story-chart">
      {/* eslint-disable-next-line no-console */}
      <Settings onElementClick={(d) => console.log('onElementClick', d)} />
      <Wordcloud
        id="spec_1"
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
        data={data(text, palette)}
      />
    </Chart>
  );
};
