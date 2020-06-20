import React, { useEffect } from 'react';

import './DefaultSpinner.css';
import { DialogComponent } from '../DialogComponent';
import { useDialog } from '../DialogWall';

export interface DefaultSpinnerProps {
  /**
   * Timeout in milli-seconds.
   */
  timeout?: number;
}

/**
 * Built-in spinner.
 * <p>
 * Using {@link https://loading.io/css/}.
 */
export const DefaultSpinner: DialogComponent<DefaultSpinnerProps> = (props) => {
  const service = useDialog();

  useEffect(() => {
    const timeout = props.timeout || 0;
    if (timeout > 0) {
      const timer = setTimeout(() => {
        service.hideSpinner();
      }, timeout);
      return (): void => clearTimeout(timer);
    }
  });

  return (
    <div data-testid="dialogwall-default-spinner" className="DialogWallDefaultSpinner">
      <div className="lds-default">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
