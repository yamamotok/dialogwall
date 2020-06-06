import React from 'react';

import { DefaultDialog, DefaultDialogProps } from './modules/DefaultDialog';
import { DialogService } from './DialogService';
import { DialogSpec } from './DialogSpec';
import { ResultCallback } from './ResultCallback';

/**
 * Builder for showing built-in default dialog.
 * <p>
 * Do not instantiate this class by `new`,
 * instead you can obtain a new DialogBuilder instance by using {@link DialogService#builder()}.
 */
export class DialogBuilder {
  private spec: Partial<DialogSpec> = {
    useEscForCancel: true,
    useMarginClickForCancel: true,
  };
  private dialogProps: DefaultDialogProps = {
    message: '(No message)',
  };

  constructor(private service: DialogService) {}

  /**
   * Message appears on dialog, in simple text.
   */
  setMessage(message: string): DialogBuilder {
    this.dialogProps.message = message;
    return this;
  }

  /**
   * Positive button.
   * @param label - button label
   * @param value - will be returned as dialog result (default: true).
   */
  setPositiveButton(label: string, value?: unknown): DialogBuilder {
    if (value === undefined) value = true;
    this.dialogProps.positive = { label, value };
    return this;
  }

  /**
   * Negative button.
   * @param label - button label
   * @param value - will be returned as dialog result (default: false).
   */
  setNegativeButton(label: string, value?: unknown): DialogBuilder {
    if (value === undefined) value = false;
    this.dialogProps.negative = { label, value };
    return this;
  }

  /**
   * Set result callback.
   * @param callback - will be called immediately after dialog was closed.
   */
  setResultCallback(callback: ResultCallback): DialogBuilder {
    this.spec.onClose = callback;
    return this;
  }

  /**
   * Set other specs.
   */
  setSpec(spec: Partial<DialogSpec>): DialogBuilder {
    this.spec = { ...this.spec, ...spec };
    return this;
  }

  /**
   * Build and show the dialog.
   */
  show(): void {
    const spec: DialogSpec = {
      component: (props) => <DefaultDialog {...this.dialogProps} {...props} />,
      ...this.spec,
    };
    this.service.show(spec);
  }
}
