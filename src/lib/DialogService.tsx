import { DialogSpec } from './DialogSpec';
import { DialogBuilder } from './DialogBuilder';

/**
 * Service which provides functionality for controlling dialog.
 */
export class DialogService {
  constructor(private setSpec: (spec: DialogSpec | undefined) => void) {}

  /**
   * Show a dialog.
   * @param spec - Dialog specification
   */
  show(spec: DialogSpec): void {
    this.setSpec(spec);
  }

  /**
   * Discard a currently visible dialog.
   */
  discard(): void {
    this.setSpec(undefined);
  }

  /**
   * Get dialog builder for showing a built-in dialog.
   */
  builder(): DialogBuilder {
    return new DialogBuilder(this);
  }
}
