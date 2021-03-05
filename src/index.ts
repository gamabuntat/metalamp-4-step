import Service from './Service/Service';
import Model from './Model/Model';
import TrackView from './View/TrackView';
import ButtonView from './View/ButtonView';
import DisplayView from './View/DisplayView';
import ProgressBarView from './View/ProgressBarView';
import ScaleView from './View/ScaleView';
import PresenterStorage from './Presenter/PresenterStorage';
import Presenter from './Presenter/Presenter';

interface Storage {
  [id: string]: Presenter
}

interface Options {
  interval?: boolean
  vertical?: boolean
  min?: number
  max?: number
  step?: number
}

(function ($) {
  const storage: Storage = {} as Storage;
  (function () {
    $.fn.slider = function (o: Options | string = {}, ...args): JQuery {
      const id = this.attr('id');
      if (!id) {
        return this;
      }
      if (typeof o == 'object') {
        const isInterval = o?.interval === true;
        const components = [
          ['div', 'ui-slider__container'],
          ['div', 'ui-slider__scale'],
          ['div', 'ui-slider__track'],
          ['button', 'ui-slider__button_start'],
          ['div', 'ui-slider__display_start'],
          ['div', 'ui-slider__progress-bar_start'],
          isInterval && ['button', 'ui-slider__button_end'],
          isInterval && ['div', 'ui-slider__display_end'],
          isInterval && ['div', 'ui-slider__progress-bar_end'],
        ]
          .filter((args) => args)
          .map((args) => createComponent(args as string[]));
        components.reduce((place, e, idx) => {
          [...e.classList].find((c) => c.includes('progress')) 
            && (place = components[2]);
          place.append(e);
          return idx ? components[0] : this[0];
        }, this[0]);
        const [
          container,
          scale,
          track,
          buttonS,
          displayS,
          progressBarS,
          buttonE = false,
          displayE = false,
          progressBarE = false,
        ] = components;
        const buttonW = buttonS.getBoundingClientRect().width;
        const displaySW = displayS.getBoundingClientRect().width;
        container.style.margin = 
          `${displaySW / 8}px ${buttonW * (isInterval ? 1 : 0.5)}px`
        ;
        storage[id] = new Presenter(
          new Service(new Model(track, buttonS, buttonE, displayS, o)),
          new TrackView(track, buttonW * (isInterval ? 1 : 0)),
          new ScaleView(scale, buttonW),
          new PresenterStorage(
            new ButtonView(buttonS, -buttonW * (isInterval ? 1 : 0.5)),
            new DisplayView(
              displayS,
              -buttonW * (isInterval ? 1 : 0.5),
              buttonW
            ),
            new ProgressBarView(
              progressBarS, 0, (isInterval ? 1 : 0)
            ),
          ),
          (buttonE && displayE && progressBarE)
            && new PresenterStorage(
              new ButtonView(buttonE, 0),
              new DisplayView(displayE, 0, buttonW),
              new ProgressBarView( progressBarE, 1, (isInterval ? 1 : 0))
            )
        ).init();
        function createComponent([elem, elemClass]: string[]) {
          const component = document.createElement(elem);
          component.classList.add(elemClass);
          return component;
        }
      } else {
        console.log('no options :(', args, storage);
      }
      return this;
    };
  })();
})(jQuery);

export {Options};

