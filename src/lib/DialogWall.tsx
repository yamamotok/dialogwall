import React, { useContext, useEffect, useState } from 'react';
import { HighWall } from 'highwall';

import './DialogWall.css';
import { DialogComponentProps } from './DialogComponentProps';
import { ResultCallback } from './ResultCallback';
import { DialogService, DialogServiceInternal, dialogServiceFactory } from './DialogService';
import { Backdrop } from './modules/Backdrop';
import { Layout } from './modules/Layout';
import { DialogSpec, DialogSpecNamed } from './DialogSpec';

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
  const [dialog, setDialog] = useState<DialogSpecNamed | undefined>(undefined);
  const [spinner, setSpinner] = useState<DialogSpec | undefined>(undefined);

  useEffect(() => {
    const _service = service as DialogServiceInternal;
    _service.dialog.setObserver(setDialog);
    _service.spinner.setObserver(setSpinner);
    return (): void => {
      _service.dialog.deleteObserver();
      _service.spinner.deleteObserver();
    };
  }, [service]);

  const renderDialog = (): React.ReactElement | null => {
    if (!dialog) {
      return null;
    }
    const close: ResultCallback = (reason) => {
      service.hide(dialog, reason);
    };
    return (
      <Layout>
        {React.createElement<DialogComponentProps>(dialog.component, { close })}
      </Layout>
    );
  };

  const renderSpinner = (): React.ReactElement | null => {
    if (!spinner) {
      return null;
    }
    const close: ResultCallback = () => {
      service.hideSpinner();
    };
    return (
      <Layout>
        {React.createElement<DialogComponentProps>(spinner.component, { close })}
      </Layout>
    );
  };

  if (!dialog && !spinner) {
    return null;
  }

  return (
    <HighWall className="DialogWall">
      <Backdrop light={!dialog && !!spinner}>
        {renderDialog()}
        {renderSpinner()}
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
