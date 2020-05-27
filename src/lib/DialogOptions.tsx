import React from 'react';
import { DialogComponentProps } from './DialogComponentProps';
import { HideFunction } from './HideFunction';

/**
 * Options which defines the dialog, will be passed to dialog service when showing the dialog.
 */
export interface DialogOptions {
  component: React.ComponentType<DialogComponentProps>;
  onHide?: HideFunction;
}
