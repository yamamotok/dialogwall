type Observer<T> = (newValue: T | undefined) => void;

/**
 * Very cheap Observable.
 */
export class Observable<T> {
  private _store?: T;
  private _observer?: Observer<T>;

  set(value: T | undefined): void {
    this._store = value;
    setTimeout(() => this.notifyObserver(), 0);
  }

  get(): T | undefined {
    return this._store;
  }

  /**
   * Only one observer can be set.
   */
  setObserver(observer: Observer<T>): void {
    this._observer = observer;
  }

  deleteObserver(): void {
    this._observer = undefined;
  }

  private notifyObserver(): void {
    if (this._observer) {
      this._observer(this._store);
    }
  }
}
