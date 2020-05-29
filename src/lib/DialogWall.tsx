import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import './DialogWall.css';
import { HighWall } from 'highwall';
import { DialogComponentProps } from './DialogComponentProps';
import { DialogSpec } from './DialogSpec';
import { ResultCallback } from './ResultCallback';
import { DialogService } from './DialogService';

/**
 * Context, which provides DialogService to child components.
 */
const DialogContext = React.createContext<DialogService | undefined>(undefined);

/**
 * Utility for using DialogService.
 */
export function useDialog(): DialogService {
  const service = useContext(DialogContext);
  if (!service) {
    throw Error('DialogContext is undefined, probably caused by implementation error.');
  }
  return service;
}

/**
 * Main component, HOC which is responsible for dialog rendering and management.
 */
export const DialogWall: React.FC = (props) => {
  const [spec, setSpec] = useState<DialogSpec>();
  const [phase, setPhase] = useState<string>('initial');

  // Instantiate the service.
  const service = new DialogService(setSpec);

  // Just for fade-in animation, changing CSS classes
  useEffect(() => {
    if (!spec) {
      setPhase('initial');
      return;
    }
    const timer = setTimeout(() => {
      setPhase('ready');
    }, 10);
    return (): void => clearTimeout(timer);
  }, [spec]);

  // No spec - No need to show dialog
  if (!spec) {
    return <DialogContext.Provider value={service}>{props.children}</DialogContext.Provider>;
  }

  // Close a dialog which is visible currently
  const closeCurrent: ResultCallback = (reason) => {
    setSpec(undefined);
    setTimeout(() => {
      if (spec.onClose) {
        spec.onClose(reason);
      }
    }, 0);
  };

  // Render a dialog
  return (
    <DialogContext.Provider value={service}>
      {props.children}
      <HighWall className="DialogWall">
        <div className={classNames('backdrop', phase)}>
          <div className={classNames('content', phase)}>
            {React.createElement<DialogComponentProps>(spec.component, { close: closeCurrent })}
          </div>
        </div>
      </HighWall>
    </DialogContext.Provider>
  );
};
