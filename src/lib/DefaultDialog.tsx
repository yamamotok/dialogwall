import React from 'react';

import './DialogWall.css';
import { DialogComponentProps } from './DialogComponentProps';

export const DEFAULT_POSITIVE_BUTTON_LABEL = 'OK';
export const DEFAULT_NEGATIVE_BUTTON_LABEL = 'Cancel';

/**
 * Props for the default dialog.
 */
export interface DefaultDialogProps {
  message: string;
  positiveButtonLabel?: string;
  negativeButtonLabel?: string;
}

/**
 * Default dialog.
 */
export const DefaultDialog: React.FC<DialogComponentProps & DefaultDialogProps> = (props) => {
  const positive = props.positiveButtonLabel || DEFAULT_POSITIVE_BUTTON_LABEL;
  const negative = props.negativeButtonLabel || DEFAULT_NEGATIVE_BUTTON_LABEL;

  return (
    <div className="container DialogWallDefault">
      <div className="message">{props.message}</div>
      <div className="buttons">
        <button className="btn btn-link" onClick={() => props.hide(negative)}>
          {negative}
        </button>
        <button className="btn btn-link" onClick={() => props.hide(positive)}>
          {positive}
        </button>
      </div>
    </div>
  );
};
