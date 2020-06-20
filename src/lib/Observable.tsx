type Observer<T> = (newValue: T | undefined) => void;

/**
 * Very cheap Observable.
 */
export class Observable<T> {
  private _store?: T;
  private _observer?: Observer<T>;

  set(value: T | undefined): void {
    this._store = value;
    this.notify();
  }

  get(): T | undefined {
    return this._store;
  }

  /**
   * Only one observer can be set.
   */
  observe(observer: Observer<T>): void {
    this._observer = observer;
  }

  stopObserving(): void {
    this._observer = undefined;
  }

  private notify(): void {
    if (this._observer) {
      this._observer(this._store);
    }
  }
}
