import React, { MouseEventHandler } from 'react';
import { act, cleanup, getByText, queryByTestId, render } from '@testing-library/react';

import { DialogWall, useDialog } from './index';

const Page: React.FC = () => {
  const dialog = useDialog();
  const showDialog: MouseEventHandler = (e) => {
    dialog.builder().setMessage('Test').show();
  };
  const showSpinner: MouseEventHandler = (e) => {
    dialog.showSpinner();
  };
  return (
    <div>
      <button onClick={showDialog}>showDialog</button>
      <button onClick={showSpinner}>showSpinner</button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DialogWall>
      <Page />
    </DialogWall>
  );
};
describe('dialogwall', () => {
  beforeEach(() => {
    const mock = jest.fn();
    mock.mockReturnValue(undefined);
    document.elementFromPoint = mock;
  });

  afterEach(() => {
    cleanup();
  });

  it('shows dialog', async () => {
    act(() => {
      render(<App />);
    });
    await act(async () => {
      const button = getByText(document.documentElement, 'showDialog');
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).not.toBeNull();
  });

  it('shows spinner', async () => {
    act(() => {
      render(<App />);
    });
    await act(async () => {
      const button = getByText(document.documentElement, 'showSpinner');
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-spinner')).not.toBeNull();
  });
});
