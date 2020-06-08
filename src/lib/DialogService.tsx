import { DialogSpec } from './DialogSpec';
import { DialogBuilder } from './DialogBuilder';
import { SpinnerBuilder } from './SpinnerBuilder';
import { DialogSpecStore } from './DialogSpecStore';

/**
 * Service which provides interface for dialog control.
 */
export interface DialogService {
  /**
   * Any dialog shown?
   */
  isShown(): boolean;

  /**
   * Specification for currently visible dialog.
   */
  current(): DialogSpec;

  /**
   * Show a dialog.
   * @param spec - Dialog specification
   */
  show(spec: DialogSpec): void;

  /**
   * Discard shown dialog.
   */
  discard(reason?: unknown): void;

  /**
   * Get builder for showing built-in dialog.
   */
  builder(): DialogBuilder;

  /**
   * Get builder for showing built-in spinner.
   */
  spinnerBuilder(): SpinnerBuilder;
}

/**
 * (Internal type for friends.)
 */
export type DialogServiceInternal = DialogService & { _store: () => DialogSpecStore };

/**
 * Provide DialogService implementation.
 */
export const dialogServiceFactory = (): DialogService => {
  const store = new DialogSpecStore();

  const service = {
    _store(): DialogSpecStore {
      return store;
    },
    isShown(): boolean {
      return store.spec !== undefined;
    },
    current(): DialogSpec {
      if (!store.spec) {
        throw new Error('No current spec. Maybe need to use `isShown()` beforehand.');
      }
      return store.spec;
    },
    show(spec: DialogSpec): void {
      store.spec = spec;
    },
    discard(reason?: unknown): void {
      const onClose = store.spec?.onClose;
      if (onClose) {
        setTimeout(() => onClose(reason), 0);
      }
      store.spec = undefined;
    },
    builder(): DialogBuilder {
      return new DialogBuilder(service);
    },
    spinnerBuilder(): SpinnerBuilder {
      return new SpinnerBuilder(service);
    },
  };
  return service;
};
