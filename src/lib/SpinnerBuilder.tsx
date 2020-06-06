import React from 'react';

import { DialogSpec } from './DialogSpec';
import { DefaultSpinner } from './modules/DefaultSpinner';
import { DialogService } from './DialogService';

/**
 * Builder utility for showing built-in default dialog.
 * <p>
 * Do not instantiate this class by `new`,
 * instead you can obtain new DialogBuilder instance by using {@link DialogService#spinnerBuilder()}.
 */
export class SpinnerBuilder {
  private timeout = 0;
  constructor(private service: DialogService) {}

  /**
   * Set timeout.
   * @param timeout - milliseconds
   */
  setTimeout(timeout: number): SpinnerBuilder {
    this.timeout = timeout;
    return this;
  }

  /**
   * Build and show spinner.
   */
  show(): void {
    const spec: DialogSpec = {
      component: (props) => <DefaultSpinner timeout={this.timeout} {...props} />,
    };
    this.service.show(spec);
  }
}
