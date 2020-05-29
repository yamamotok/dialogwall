import React from 'react';
import { DialogComponentProps } from './DialogComponentProps';

/**
 * Type for custom dialog components.
 */
export type DialogComponent<T = unknown> = React.ComponentType<DialogComponentProps & T>;
