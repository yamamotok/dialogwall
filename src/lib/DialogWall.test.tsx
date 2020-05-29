import React, { MouseEventHandler } from 'react';
import {
  act,
  cleanup,
  getByTestId,
  getByText,
  queryByTestId,
  queryByText,
  render,
} from '@testing-library/react';

import { DialogWall, useDialog } from './DialogWall';
import { ResultCallback } from './ResultCallback';
import { DialogComponent } from './DialogComponent';

describe('DialogWall', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    const rendered = render(
      <DialogWall>
        <div>Child</div>
      </DialogWall>
    );
    const element = rendered.getByText(/Child/);
    expect(element).toBeInTheDocument();
  });

  it('can show a built-in dialog', async (done) => {
    const onHide: ResultCallback = jest.fn();

    // Test component which is using built-in dialog
    const Tester: React.FC = () => {
      const dialog = useDialog();
      const onClick: MouseEventHandler = (e) => {
        dialog
          .builder()
          .setMessage('Hello')
          .setCallback(onHide)
          .setPositiveButtonLabel('Go')
          .setNegativeButtonLabel('Never')
          .build();
      };
      return (
        <div>
          <button data-testid="show-dialog" onClick={onClick}>
            Show
          </button>
        </div>
      );
    };

    // Render all
    act(() => {
      render(
        <DialogWall>
          <Tester />
        </DialogWall>
      );
    });
    const button = getByTestId(document.documentElement, 'show-dialog');

    // Press button and show dialog
    function showDialog(): void {
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(queryByText(document.documentElement, 'Hello')).toBeTruthy();
      expect(queryByText(document.documentElement, 'Go')).toBeTruthy();
      expect(queryByText(document.documentElement, 'Never')).toBeTruthy();
    }

    showDialog();

    // Press button on the dialog, dialog should be closed
    const positiveButton = getByText(document.documentElement, 'Go');
    await act(async () => {
      positiveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      // Callback will be called asynchronously, we need to wait.
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByText(document.documentElement, 'Hello')).toBeNull();
    expect(queryByText(document.documentElement, 'Go')).toBeNull();
    expect(queryByText(document.documentElement, 'Never')).toBeNull();
    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledWith('Go');

    // Again
    showDialog();

    // Press negative button
    const negativeButton = getByText(document.documentElement, 'Never');
    await act(async () => {
      negativeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByText(document.documentElement, 'Hello')).toBeNull();
    expect(queryByText(document.documentElement, 'Go')).toBeNull();
    expect(queryByText(document.documentElement, 'Never')).toBeNull();
    expect(onHide).toHaveBeenCalledTimes(2);
    expect(onHide).toHaveBeenCalledWith('Never');

    done();
  });

  it('can my custom dialog', async (done) => {
    // Custom dialog
    const CustomDialog: DialogComponent = (props) => {
      const onClick: MouseEventHandler = (e) => props.close('Closed');
      return (
        <div>
          <button onClick={onClick} data-testid="close-button">
            Close
          </button>
        </div>
      );
    };

    // Mock callback
    const onHide = jest.fn();

    // Main component
    const Main: React.FC = () => {
      const dialog = useDialog();
      const onClick: MouseEventHandler = (e) => {
        dialog.show({
          component: CustomDialog,
          onClose: onHide,
        });
      };
      return (
        <div>
          <button onClick={onClick} data-testid="open-button">
            Open
          </button>
        </div>
      );
    };

    // Render main
    act(() => {
      render(
        <DialogWall>
          <Main />
        </DialogWall>
      );
    });
    const openButton = getByTestId(document.documentElement, 'open-button');

    // Open dialog
    act(() => {
      openButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const closeButton = getByTestId(document.documentElement, 'close-button');

    // Close dialog
    await act(async () => {
      closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'close-button')).toBeNull();

    // Check if callback has been called
    expect(onHide).toHaveBeenCalledWith('Closed');

    done();
  });
});
