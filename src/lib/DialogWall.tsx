import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import './DialogWall.css';
import { HighWall } from 'highwall';
import { DefaultDialog, DefaultDialogProps } from './DefaultDialog';
import { DialogComponentProps } from './DialogComponentProps';
import { DialogOptions } from './DialogOptions';
import { HideFunction } from './HideFunction';

/**
 * Builder for built-in dialog.
 */
class DialogBuilder {
  private callback?: HideFunction;

  private dialogProps: DefaultDialogProps = {
    message: '(No message)',
  };

  constructor(private service: DialogService) {}

  setMessage(message: string): DialogBuilder {
    this.dialogProps.message = message;
    return this;
  }

  setButtonLabel(positive: string, negative?: string): DialogBuilder {
    this.dialogProps.positiveButtonLabel = positive;
    this.dialogProps.negativeButtonLabel = negative;
    return this;
  }

  setCallback(callback: HideFunction): DialogBuilder {
    this.callback = callback;
    return this;
  }

  build(): void {
    this.service.show((props) => <DefaultDialog {...this.dialogProps} {...props} />, this.callback);
  }
}

/**
 * Service which provides functionality for controlling dialog.
 */
export class DialogService {
  constructor(private setOptions: (newOpts: DialogOptions | undefined) => void) {}

  /**
   * Show a dialog.
   * @param component - dialog component
   * @param onHide - callback which will be called when the dialog is being hidden.
   */
  show(component: React.ComponentType<DialogComponentProps>, onHide?: HideFunction): void {
    this.setOptions({ component, onHide });
  }

  /**
   * Hide a currently visible dialog.
   */
  hide(): void {
    this.setOptions(undefined);
  }

  /**
   * Get dialog builder for showing a built-in dialog.
   */
  builder(): DialogBuilder {
    return new DialogBuilder(this);
  }
}

/**
 * Context.
 */
const DialogContext = React.createContext<DialogService | undefined>(undefined);

/**
 * Utility which provides the context (dialog service).
 */
export function useDialog(): DialogService {
  const service = useContext(DialogContext);
  if (!service) {
    throw Error('The context is undefined, probably implementation error.');
  }
  return service;
}

/**
 * Main component which is responsible for dialog rendering and providing dialog service.
 */
export const DialogWall: React.FC = (props) => {
  const [options, setOptions] = useState<DialogOptions>();
  const [phase, setPhase] = useState<string>('initial');

  const service = new DialogService(setOptions);

  // Just for animation, change css class
  useEffect(() => {
    if (!options) {
      setPhase('initial');
      return;
    }
    const timer = setTimeout(() => {
      setPhase('ready');
    }, 10);
    return (): void => clearTimeout(timer);
  }, [options]);

  // No dialog should be shown
  if (!options) {
    return <DialogContext.Provider value={service}>{props.children}</DialogContext.Provider>;
  }

  // Hide dialog
  const hide: HideFunction = (reason) => {
    service.hide();
    setTimeout(() => {
      if (options.onHide) options.onHide(reason);
    }, 0);
  };

  // Render a dialog
  return (
    <DialogContext.Provider value={service}>
      {props.children}
      <HighWall className="DialogWall">
        <div className={classNames('backdrop', phase)}>
          <div className={classNames('content', phase)}>
            {React.createElement<DialogComponentProps>(options.component, { hide })}
          </div>
        </div>
      </HighWall>
    </DialogContext.Provider>
  );
};
