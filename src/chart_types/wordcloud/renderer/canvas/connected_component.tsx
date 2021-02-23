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

// @ts-ignore
import d3TagCloud from 'd3-cloud';
import React, { MouseEvent, RefObject } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { onChartRendered } from '../../../../state/actions/chart';
import { GlobalChartState } from '../../../../state/chart_state';
import { getInternalIsInitializedSelector, InitStatus } from '../../../../state/selectors/get_internal_is_intialized';
import { Dimensions } from '../../../../utils/dimensions';
import { nullShapeViewModel, ShapeViewModel } from '../../layout/types/viewmodel_types';
import { geometries } from '../../state/selectors/geometries';
import { renderCanvas2d } from './canvas_renderers';

const configs = {
  negyzet: {
    width: 1000,
    height: 1000,
  },
  teglalap: {
    width: 700,
    height: 400,
  },
  suru: {
    padding: 2,
  },
  kozepes: {
    padding: 3,
  },
  laza: {
    padding: 10,
  },
  courier: {
    botu: 'Courier',
  },
  arial: {
    botu: 'Arial',
  },
  kover: {
    vastag: 'bold',
  },
  dolt: {
    stil: 'italic',
  },
  szogek: {
    count: 6,
    ksz: -75,
    vsz: 75,
  },
};

const demo = ['kozepes', 'teglalap', 'szogek', 'kover'];

const conf = Object.assign({}, ...demo.map((d) => configs[d] || {}));
// const conf = Object.assign({}, configs['kozepes'],configs['teglalap'],configs['szogek'],configs['kover'], )

const getFont = function (d) {
  return d.betuTipus;
};

const getFontStyle = function (d) {
  return d.stilus;
};

const getFontWeight = function (d) {
  return d.vastagsag;
};

const kezdoSzog = function () {
  return Math.random() * 360;
};

const vegSzog = function (startingAngle) {
  const kor = 360;
  return startingAngle + Math.random() * kor; //akar itt is megadhatom a kezdoSzog inputot
};

const ksz = kezdoSzog();
const vsz = vegSzog(ksz);

const szoveg =
  'Truffaut lo-fi kinfolk, vegan roof party palo santo meggings brooklyn. Snackwave artisan man braid DIY retro truffaut tumeric helvetica. Ugh shabby chic PBR&B pork belly vegan pabst, food truck plaid direct trade franzen pour-over chillwave fingerstache. Blog pinterest intelligentsia humblebrag, farm-to-table hashtag umami williamsburg. Bushwick helvetica godard jianbing bicycle rights, salvia hashtag before they sold out lumbersexual. Waistcoat snackwave gentrify mumblecore farm-to-table banjo tbh post-ironic aesthetic. Bushwick selfies poutine kinfolk bicycle rights williamsburg, cray affogato iPhone sustainable. Shoreditch lo-fi tbh, palo santo affogato banh mi narwhal. Pickled pitchfork heirloom vice man bun normcore post-ironic ethical freegan blog. Chillwave readymade activated charcoal, shaman chia literally fixie stumptown jianbing yuccie lo-fi kinfolk coloring book small batch helvetica.';
// const szoveg = "Truffaut lo-fi kinfolk, vegan roof party palo santo meggings brooklyn.";

function getWidth(config) {
  return config.width || 500;
}

function getHeight(config) {
  return config.height || 500;
}

function getFontSize(d, extra) {
  return d.size + extra;
}

function getRotation(ksz, vsz, count) {
  const szogTartomany = vsz - ksz;
  const count = count || 360;
  const lepesVagyIntervallumSzam = count - 1;
  const szogLepes = szogTartomany / lepesVagyIntervallumSzam;
  const randomUpTo = function (upto) {
    return Math.random() * upto;
  };
  const randomUpToCount = randomUpTo(count);
  const index = Math.floor(randomUpToCount);
  return index * szogLepes + ksz;
}

function layoutMaker(bonyesz) {
  return (
    d3TagCloud()
      .size([getWidth(bonyesz), getHeight(bonyesz)])
      .words(
        szoveg
          //
          .replace(/[,.]/g, '')
          //
          .toLowerCase()
          //
          .split(' ')
          //
          .filter(function (d, index, a) {
            return a.indexOf(d) === index;
          })
          //
          .map(function (d) {
            const weight = Math.random() ** 5;
            return {
              //   text: d.concat("wow"),
              text: d,
              size: 10 + weight * 90,
              color: `rgb(${Math.round(255 * Math.random())},${Math.round(0 * Math.random())},${Math.round(
                255 * Math.random(),
              )})`,
              betuTipus: bonyesz.botu || 'Impact',
              stilus: bonyesz.stil || 'normal',
              vastagsag: bonyesz.vastag || 'normal',
              hovirag: true,
            };
          }),
      )

      .padding(bonyesz.padding || 5)
      /* .rotate(function () {
           return Math.random()*(vegSzog()-kezdoSzog())+kezdoSzog();
       // .rotate(function () {
           //   return Math.floor(Math.random() * 2) * 90;
       })
    */
      .rotate(() => getRotation(bonyesz.ksz, bonyesz.vsz, bonyesz.count))
      .font(getFont)
      .fontStyle(getFontStyle)
      .fontSize((d) => getFontSize(d, 0))
  );
}

const problema = (d) => {
  return d.size + 'px';
};

const View = ({ words, conf }) => (
  <svg width={getWidth(conf)} height={getHeight(conf)}>
    <g transform={`translate(${getWidth(conf) / 2}, ${getHeight(conf) / 2})`}>
      {words.map((d) => (
        <text
          style={{
            transform: `translate(${d.x}, ${d.y}) rotate(${d.rotate})`,
            fontSize: problema(d),
            fontStyle: getFontStyle(d),
            fontFamily: getFont(d),
            fontWeight: getFontWeight(d),
            fill: d.color,
          }}
          textAnchor={'middle'}
          transform={`translate(${d.x}, ${d.y}) rotate(${d.rotate})`}
        >
          {d.text}
        </text>
      ))}
    </g>
  </svg>
);

interface ReactiveChartStateProps {
  initialized: boolean;
  geometries: ShapeViewModel;
  chartContainerDimensions: Dimensions;
}

interface ReactiveChartDispatchProps {
  onChartRendered: typeof onChartRendered;
}

interface ReactiveChartOwnProps {
  forwardStageRef: RefObject<HTMLCanvasElement>;
}

type Props = ReactiveChartStateProps & ReactiveChartDispatchProps & ReactiveChartOwnProps;

class Component extends React.Component<Props> {
  static displayName = 'Wordcloud';

  // firstRender = true; // this'll be useful for stable resizing of treemaps
  private ctx: CanvasRenderingContext2D | null;

  // see example https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#Example
  private readonly devicePixelRatio: number; // fixme this be no constant: multi-monitor window drag may necessitate modifying the `<canvas>` dimensions

  constructor(props: Readonly<Props>) {
    super(props);
    this.ctx = null;
    this.devicePixelRatio = window.devicePixelRatio;
  }

  componentDidMount() {
    /*
     * the DOM element has just been appended, and getContext('2d') is always non-null,
     * so we could use a couple of ! non-null assertions but no big plus
     */
    this.tryCanvasContext();
    if (this.props.initialized) {
      this.drawCanvas();
      console.log('wordcloud componentDidMount');
      this.props.onChartRendered();
    }
  }

  componentDidUpdate() {
    if (!this.ctx) {
      this.tryCanvasContext();
    }
    if (this.props.initialized) {
      this.drawCanvas();
      console.log('wordcloud componentDidUpdate');

      this.props.onChartRendered();
    }
  }

  handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    const {
      initialized,
      chartContainerDimensions: { width, height },
      forwardStageRef,
      geometries,
    } = this.props;
    if (!forwardStageRef.current || !this.ctx || !initialized || width === 0 || height === 0) {
      return;
    }
    const picker = geometries.pickQuads;
    const box = forwardStageRef.current.getBoundingClientRect();
    const { chartCenter } = geometries;
    const x = e.clientX - box.left - chartCenter.x;
    const y = e.clientY - box.top - chartCenter.y;
    return picker(x, y);
  }

  render() {
    const {
      initialized,
      chartContainerDimensions: { width, height },
      forwardStageRef,
      geometries: { bulletViewModel },
    } = this.props;
    if (!initialized || width === 0 || height === 0) {
      return null;
    }
    const conf1 = {
      ...conf,
      width,
      height,
      ksz: bulletViewModel.startAngle,
      vsz: bulletViewModel.endAngle,
      count: bulletViewModel.angleCount,
    };
    const layout = layoutMaker(conf1);

    let ww;
    layout.on('end', (w) => (ww = w)).start();

    return (
      <>
        <canvas
          ref={forwardStageRef}
          className="echCanvasRenderer"
          width={width * this.devicePixelRatio}
          height={height * this.devicePixelRatio}
          onMouseMove={this.handleMouseMove.bind(this)}
          style={{
            width,
            height,
          }}
        />
        <View words={ww} conf={conf1} />
      </>
    );
  }

  private tryCanvasContext() {
    const canvas = this.props.forwardStageRef.current;
    this.ctx = canvas && canvas.getContext('2d');
  }

  private drawCanvas() {
    if (this.ctx) {
      console.log(this.props.geometries.bulletViewModel);
      const { width, height }: Dimensions = this.props.chartContainerDimensions;
      renderCanvas2d(this.ctx, this.devicePixelRatio, {
        ...this.props.geometries,
        config: { ...this.props.geometries.config, width, height },
      });
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ReactiveChartDispatchProps =>
  bindActionCreators(
    {
      onChartRendered,
    },
    dispatch,
  );

const DEFAULT_PROPS: ReactiveChartStateProps = {
  initialized: false,
  geometries: nullShapeViewModel(),
  chartContainerDimensions: {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  },
};

const mapStateToProps = (state: GlobalChartState): ReactiveChartStateProps => {
  if (getInternalIsInitializedSelector(state) !== InitStatus.Initialized) {
    return DEFAULT_PROPS;
  }
  return {
    initialized: true,
    geometries: geometries(state),
    chartContainerDimensions: state.parentDimensions,
  };
};

/** @internal */
export const Goal = connect(mapStateToProps, mapDispatchToProps)(Component);
