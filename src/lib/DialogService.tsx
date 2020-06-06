import { useState } from 'react';

import { DialogSpec } from './DialogSpec';
import { DialogBuilder } from './DialogBuilder';
import { SpinnerBuilder } from './SpinnerBuilder';

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
 * Provide DialogService implementation.
 */
export const useDialogService = (): DialogService => {
  const [spec, setSpec] = useState<DialogSpec>();
  const service = {
    isShown(): boolean {
      return spec !== undefined;
    },
    current(): DialogSpec {
      if (!spec) {
        throw new Error('No current spec. Maybe need to use `isShown()` beforehand.');
      }
      return spec;
    },
    show(spec: DialogSpec): void {
      setSpec(spec);
    },
    discard(reason?: unknown): void {
      setTimeout(() => {
        if (spec?.onClose) spec.onClose(reason);
      }, 0);
      setSpec(undefined);
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
