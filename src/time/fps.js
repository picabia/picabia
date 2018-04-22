import { createHtml } from '@picabia/util';

import style from './fps.css'; // eslint-disable-line no-unused-vars

const PADDING = 3;
const FONT_SIZE = 15;
const MIN_FONT_PIXELS = 10;

class Fps {
  constructor (layer, container) {
    if (layer) {
      this._layer = layer.newLayer('fps', { w: 90, h: 35 }, {x: 10, y: layer.max.y - 35}, 9000);
      this._ctx = this._layer.ctx;

      this._rect = null;
      this._fontSize = null;
    } else {
      this._dom = createHtml(`
        <div id="picabia-fps">
          <span class="label"></span>
        </div>`);
      this._label = this._dom.querySelector('.label');
      container.append(this._dom);
    }

    this._fps = 0;
    this._frameTs = null;
    this._frameCount = 0;

    this.resize();
  }

  // -- AppObject API

  _renderCanvas () {
    const ctx = this._ctx;

    const text = '' + this._fps.toFixed(1);

    const dim = this._ctx.measureText(text);
    const rect = [0, 0, 2 * PADDING + dim.width, this._fontSize + 2 * PADDING];

    ctx.clearRect(...(this._lastRect || rect));

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'white';
    ctx.fillText(text, PADDING - 2, PADDING + 2);

    this._lastRect = rect;
    this._lastRect[2] += 2;
    this._lastRect[3] += 2;
  }

  _renderDom () {
    this._label.innerText = this._fps.toFixed(1);
  }

  render (delta, timestamp) {
    this._frameTs = this._frameTs || timestamp;

    this._frameCount++;
    const seconds = Math.floor((timestamp - this._frameTs) / 1000);
    if (seconds > 0) {
      this._frameTs = timestamp;
      this._fps = this._frameCount / seconds;
      this._frameCount = 0;
    }

    if (this._layer) {
      this._renderCanvas();
    } else {
      this._renderDom();
    }
  }

  resize () {
    if (this._layer) {
      this._fontSize = this._layer.scaleText(FONT_SIZE, MIN_FONT_PIXELS);

      const ctx = this._ctx;

      ctx.font = this._fontSize + 'px pixel';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
    }
  }

  destroy () {
    this._layer && this._layer.destroy();
    this._dom && this._dom.remove();
  }
}

export {
  Fps
};
