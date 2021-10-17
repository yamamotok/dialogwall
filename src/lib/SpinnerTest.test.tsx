import React, { MouseEventHandler } from 'react';
import { act, cleanup, getByText, queryByTestId, render } from '@testing-library/react';

import { DialogWall } from './DialogWall';
import { useDialog } from './useDialog';

const Tester: React.FC = () => {
  const dialog = useDialog();

  const showSpinner: MouseEventHandler = (e) => {
    dialog.showSpinner();
    setTimeout(() => dialog.hideSpinner(), 30);
  };

  return (
    <div>
      <button onClick={showSpinner}>ShowSpinner</button>
    </div>
  );
};

const Main: React.FC = () => {
  return (
    <DialogWall>
      <Tester />
    </DialogWall>
  );
};

/**
 * Test built-in spinner.
 */
describe('Default Spinner', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render spinner initially', () => {
    act(() => {
      render(<Main />);
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-spinner')).toBeNull();
  });

  it('renders spinner', async () => {
    act(() => {
      render(<Main />);
    });
    await act(async () => {
      getByText(document.documentElement, 'ShowSpinner').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-spinner')).not.toBeNull();

    // Test component will hide the spinner after 30ms.
    await act(async () => {
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 50);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-spinner')).toBeNull();
  });
});
