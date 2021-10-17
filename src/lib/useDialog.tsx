import { useContext } from 'react';
import { DialogContext } from './DialogContext';
import { DialogService } from './DialogService';

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
