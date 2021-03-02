import View from './View';

export default class DisplayView extends View {
  private displayDeflexion: number
  constructor (display: HTMLElement, private offset: number, buttonW: number) {
    super(display);
    this.displayDeflexion = (this.getRect().width - buttonW) / 2;
    this.transform(this.displayDeflexion);
  }

  moveDisplay(
    relativeBtnPos: number,
    scaleW: number,
    maxExtreme: number,
    minExtreme: number
  ): void {
    const relDisplayDeflexion = this.displayDeflexion * 2 / scaleW;
    if (this.offset == 0) {
      maxExtreme = Infinity;
    } else {
      minExtreme = -Infinity;
    }
    const position = Math.min(
      maxExtreme - relDisplayDeflexion,
      Math.max(
        relativeBtnPos,
        minExtreme + relDisplayDeflexion
      )
    );
    this.component.style.left = `${position * 100}%`;
  }

  changeValue(
    relativeBtnPos: number,
    min: number,
    max: number,
    valueOfDivision: number,
    step: number
  ): void {
    const value = Math.min(
      Math.round(relativeBtnPos * valueOfDivision) * step + min,
      max
    );
    this.component.innerHTML = value.toFixed(this.defineDecimalPlaces(step));
  }

  defineDecimalPlaces(x: number): number {
    const dotPosition = x.toString().indexOf('.') + 1;
    return dotPosition == 0 ? 0 : x.toString().length - dotPosition;
  }

  transform(displayDeflexion: number): void {
    this.component.style.transform = (
      `translate(${this.offset - displayDeflexion}px, 0px)`
    );
  }
}

