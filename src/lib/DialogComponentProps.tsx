import { HideFunction } from './HideFunction';

/**
 * Props which will be given to a dialog component when it is instantiated.
 */
export interface DialogComponentProps {
  /**
   * Function which will be called by dialog component to hide itself.
   * @param result - dialog result, e.g. ok, yes, canceled, no.
   */
  hide: HideFunction;
}
