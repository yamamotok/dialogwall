import React, { useContext } from 'react';
import { HighWall } from 'highwall';

import './DialogWall.css';
import { DialogComponentProps } from './DialogComponentProps';
import { ResultCallback } from './ResultCallback';
import { DialogService, useDialogService } from './DialogService';
import { Backdrop } from './modules/Backdrop';
import { Layout } from './modules/Layout';

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
  // Instantiate the service.
  const service = useDialogService();

  // If no spec is there, no need to show anything.
  if (!service.isShown()) {
    return <DialogContext.Provider value={service}>{props.children}</DialogContext.Provider>;
  }

  const renderDialog = (): React.ReactElement => {
    const close: ResultCallback = (reason) => {
      service.discard(reason);
    };
    return React.createElement<DialogComponentProps>(service.current().component, { close });
  };

  return (
    <DialogContext.Provider value={service}>
      {props.children}
      <HighWall className="DialogWall">
        <Backdrop>
          <Layout>{renderDialog()}</Layout>
        </Backdrop>
      </HighWall>
    </DialogContext.Provider>
  );
};
