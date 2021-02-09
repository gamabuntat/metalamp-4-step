import View from './View';

export default class ButtonView extends View {
  constructor(button: HTMLElement) {
    super(button);
    this.component.addEventListener(
      'pointerdown',
      (e) => {
        this.toggleTrigger();
        this.fixPointer(e);
        this.emit('pointerPressed', [e, this.getRect()]);
      }
    );
    this.component.addEventListener(
      'pointerup',
      () => this.toggleTrigger(),
    );
    this.component.addEventListener(
      'pointermove',
      (e) => View.isTriggerd && this.emit('pointerMoved', e),
    );
  }

  fixPointer(e: PointerEvent): void {
    console.log(e.pointerId);
    this.component.setPointerCapture(e.pointerId);
  }

  moveButton(
    x: number,
    scaleX: number,
    scaleW: number,
    shiftX: number,
    btnW: number,
  ): void {
    const btnPosition = Math.min(
      scaleW - btnW,
      Math.max((x - scaleX - shiftX), 0)
    );
    this.component.style.left = `${btnPosition}px`;
  }
}

