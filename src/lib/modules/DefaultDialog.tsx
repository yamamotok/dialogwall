import React, { MouseEventHandler } from 'react';

import './DefaultDialog.css';
import { DialogComponent } from '../DialogComponent';
import { ResultCallback } from '../ResultCallback';

export const DEFAULT_POSITIVE_BUTTON_LABEL = 'OK';

interface ButtonProperty {
  label: string;
  value: unknown;
}

/**
 * Props for built-in default dialog.
 */
export interface DefaultDialogProps {
  message: string;
  positive?: ButtonProperty;
  negative?: ButtonProperty;
}

/**
 * Button on dialog.
 */
const Button: React.FC<ButtonProperty & { close: ResultCallback }> = (props) => {
  const onClick: MouseEventHandler = (e) => {
    props.close(props.value);
  };
  return (
    <button className="btn btn-link" onClick={onClick}>
      {props.label}
    </button>
  );
};

/**
 * Built-in default dialog. Bootstrap is required.
 * <p>
 * @see https://getbootstrap.com/
 */
export const DefaultDialog: DialogComponent<DefaultDialogProps> = (props) => {
  let positive = props.positive;
  const negative = props.negative;
  if (!positive && !negative) {
    // If no button property was given, set up only positive button with default property.
    positive = { label: DEFAULT_POSITIVE_BUTTON_LABEL, value: true };
  }

  return (
    <div data-testid="dialogwall-default-dialog" className="container DialogWallDefault">
      <div className="message">{props.message}</div>
      <div className="buttons">
        {negative && <Button {...negative} close={props.close} />}
        {positive && <Button {...positive} close={props.close} />}
      </div>
    </div>
  );
};
