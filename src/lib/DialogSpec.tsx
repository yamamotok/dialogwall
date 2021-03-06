import { ResultCallback } from './ResultCallback';
import { DialogComponent } from './DialogComponent';

/**
 * Specification of a dialog, which will be passed to DialogService
 */
export interface DialogSpec {
  /**
   * Component which will be rendered as a dialog.
   */
  component: DialogComponent;

  /**
   * Callback which will be called immediately after the dialog was closed.
   */
  onClose?: ResultCallback;

  /**
   * Margin click will invoke cancellation.
   */
  useMarginClickForCancel?: boolean;

  /**
   * ESC key will invoke cancellation.
   */
  useEscForCancel?: boolean;
}

export interface DialogSpecNamed extends DialogSpec {
  name: string;
}
