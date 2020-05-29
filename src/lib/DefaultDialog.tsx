import React, { useEffect } from 'react';

import './DialogWall.css';
import { DialogComponent } from './DialogComponent';
import { ResultCallback } from './ResultCallback';

export const DEFAULT_POSITIVE_BUTTON_LABEL = 'OK';

/**
 * Props for built-in default dialog.
 */
export interface DefaultDialogProps {
  message: string;
  positiveButtonLabel?: string;
  negativeButtonLabel?: string;
}

/**
 * Button on dialog.
 */
const Button: React.FC<{ label?: string; close: ResultCallback }> = ({ label, close }) => {
  if (!label) return null;
  return (
    <button className="btn btn-link" onClick={(): void => close(label)}>
      {label}
    </button>
  );
};

/**
 * A built-in default dialog.
 */
export const DefaultDialog: DialogComponent<DefaultDialogProps> = (props) => {
  let positive = props.positiveButtonLabel;
  const negative = props.negativeButtonLabel;
  if (!positive && !negative) {
    // If no label was given, set up only positive button with default label.
    positive = DEFAULT_POSITIVE_BUTTON_LABEL;
  }

  // Esc key handling
  useEffect(() => {
    if (negative) {
      const onEscPressed = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          props.close(negative);
        }
      };
      document.addEventListener('keydown', onEscPressed);
      return (): void => document.removeEventListener('keydown', onEscPressed);
    }
  });

  return (
    <div className="container DialogWallDefault">
      <div className="message">{props.message}</div>
      <div className="buttons">
        <Button label={negative} close={props.close} />
        <Button label={positive} close={props.close} />
      </div>
    </div>
  );
};
