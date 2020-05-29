import { ResultCallback } from './ResultCallback';

/**
 * Props which will be given to a dialog component when it is instantiated.
 */
export interface DialogComponentProps {
  /**
   * Custom dialog needs to call this for closing it self.
   */
  close: ResultCallback;
}
