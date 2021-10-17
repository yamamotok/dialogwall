import React from 'react';
import { DialogService } from './DialogService';

/**
 * Context, which provides DialogService to child components.
 */
export const DialogContext = React.createContext<DialogService | undefined>(undefined);
