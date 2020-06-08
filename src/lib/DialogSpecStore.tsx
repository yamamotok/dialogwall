import { DialogSpec } from './DialogSpec';

type DialogSpecStoreListener = (newSpec: DialogSpec | undefined) => void;

/**
 * Store for DialogSpec.
 * When a DialogSpec is put into this store, it will be shown on screen.
 * <p>
 * Note: Using mobx or rxjs will make things easier.
 */
export class DialogSpecStore {
  private _spec?: DialogSpec;
  private listener?: DialogSpecStoreListener;

  get spec(): DialogSpec | undefined {
    return this._spec;
  }

  set spec(spec: DialogSpec | undefined) {
    this._spec = spec;
    if (this.listener) {
      this.listener(spec);
    }
  }

  /**
   * Set a listener, be aware that only one listener can be set.
   */
  setListener(listener: DialogSpecStoreListener): void {
    listener(this._spec);
    this.listener = listener;
  }

  clearListener(): void {
    this.listener = undefined;
  }
}
