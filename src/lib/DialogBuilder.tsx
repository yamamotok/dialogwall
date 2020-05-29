import React from 'react';

import { ResultCallback } from './ResultCallback';
import { DefaultDialog, DefaultDialogProps } from './DefaultDialog';
import { DialogService } from './DialogService';
import { DialogSpec } from './DialogSpec';

/**
 * Builder utility for showing built-in default dialog.
 *
 * As you can obtain a new DialogBuilder instance through DialogService,
 * please do not instantiate this class by `new`.
 */
export class DialogBuilder {
  private callback?: ResultCallback;
  private dialogProps: DefaultDialogProps = {
    message: '(No message)',
  };

  constructor(private service: DialogService) {}

  setMessage(message: string): DialogBuilder {
    this.dialogProps.message = message;
    return this;
  }

  setPositiveButtonLabel(label: string): DialogBuilder {
    this.dialogProps.positiveButtonLabel = label;
    return this;
  }

  setNegativeButtonLabel(label: string): DialogBuilder {
    this.dialogProps.negativeButtonLabel = label;
    return this;
  }

  setCallback(callback: ResultCallback): DialogBuilder {
    this.callback = callback;
    return this;
  }

  /**
   * Build and show the dialog.
   */
  build(): void {
    const spec: DialogSpec = {
      component: (props) => <DefaultDialog {...this.dialogProps} {...props} />,
      onClose: this.callback,
    };
    this.service.show(spec);
  }
}
