import React, { useContext, useEffect, useState } from 'react';
import { HighWall } from 'highwall';

import './DialogWall.css';
import { DialogComponentProps } from './DialogComponentProps';
import { ResultCallback } from './ResultCallback';
import { DialogService, DialogServiceInternal, dialogServiceFactory } from './DialogService';
import { Backdrop } from './modules/Backdrop';
import { Layout } from './modules/Layout';
import { DialogSpec } from './DialogSpec';

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

const Inner: React.FC<{ service: DialogService }> = ({ service }) => {
  const [, setSpec] = useState<DialogSpec | undefined>(undefined);

  useEffect(() => {
    const _service = service as DialogServiceInternal;
    _service._store().setListener(setSpec);
    return (): void => _service._store().clearListener();
  }, [service]);

  // If no spec is there, no need to show anything.
  if (!service.isShown()) {
    return null;
  }

  const renderDialog = (): React.ReactElement => {
    const close: ResultCallback = (reason) => {
      service.discard(reason);
    };
    return React.createElement<DialogComponentProps>(service.current().component, { close });
  };

  return (
    <HighWall className="DialogWall">
      <Backdrop>
        <Layout>{renderDialog()}</Layout>
      </Backdrop>
    </HighWall>
  );
};

/**
 * Main component, HOC which is responsible for dialog rendering and management.
 */
export const DialogWall: React.FC = (props) => {
  const service = dialogServiceFactory();

  return (
    <DialogContext.Provider value={service}>
      {props.children}
      <Inner service={service} />
    </DialogContext.Provider>
  );
};
