import React, { ReactElement } from 'react';

import { DialogSpec, DialogSpecNamed } from './DialogSpec';
import { DialogBuilder } from './DialogBuilder';
import { Observable } from './Observable';
import { DefaultSpinner } from './modules/DefaultSpinner';
import { DialogComponent } from './DialogComponent';

/**
 * DialogService.
 */
export interface DialogService {
  /**
   * Show dialog.
   * @param spec - specification
   * @param name - optional, auto-generated name will be given if omitted.
   */
  show(spec: DialogSpec, name?: string): string;

  /**
   * Hide dialog.
   * @param spec - specification, which must have name to identify the target dialog
   * @param reason - arbitrary value which shows why the dialog was closed.
   */
  hide(spec: { name: string }, reason?: unknown): void;

  /**
   * Get current (currently visible) dialog.
   * `undefined` will be returned if nothing is visible.
   */
  getCurrent(): undefined | DialogSpecNamed;

  /**
   * Build and show dialog by using built-in dialog.
   */
  builder(): DialogBuilder;

  /**
   * Show spinner.
   * @param spec - specification, built-in spinner will be used if omitted.
   */
  showSpinner(spec?: DialogSpec): void;

  /**
   * Hide spinner.
   */
  hideSpinner(): void;
}

/**
 * DialogService, which is is an internal class used inside library.
 * Interface {@link DialogService} will be exposed outside instead.
 */
export class DialogServiceInternal implements DialogService {
  private readonly _spinner: Observable<DialogSpec>;
  private readonly _dialog: Observable<DialogSpecNamed>;
  private serial = 0;

  constructor() {
    this._spinner = new Observable<DialogSpec>();
    this._dialog = new Observable<DialogSpecNamed>();
  }

  get dialog(): Observable<DialogSpecNamed> {
    return this._dialog;
  }

  get spinner(): Observable<DialogSpec> {
    return this._spinner;
  }

  show(spec: DialogSpec): string {
    this.serial++;
    const name = `${this.serial}`;
    this.dialog.set({ ...spec, name });
    return name;
  }

  hide(spec: { name: string }, reason?: unknown): void {
    const name = spec.name;
    const dialog = this.dialog.get();
    if (!dialog || dialog.name !== name) {
      return;
    }
    const onClose = dialog.onClose;
    if (onClose) {
      setTimeout(() => onClose(reason), 0);
    }
    this.dialog.set(undefined);
  }

  getCurrent(): undefined | DialogSpecNamed {
    return this.dialog.get();
  }

  builder(): DialogBuilder {
    return new DialogBuilder(this);
  }

  showSpinner(spec?: DialogSpec): void {
    const component: DialogComponent =
      spec?.component || ((props): ReactElement => <DefaultSpinner {...props} />);
    this.spinner.set({ component });
  }

  hideSpinner(): void {
    this.spinner.set(undefined);
  }
}

/**
 * Provide DialogService.
 */
export const dialogServiceFactory = (): DialogService => {
  return new DialogServiceInternal();
};
