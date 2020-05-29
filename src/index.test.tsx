import React, { MouseEventHandler } from 'react';
import { act, cleanup, getByTestId, getByText, queryByText, render } from '@testing-library/react';

import { DialogWall, useDialog } from './index';

describe('App using DialogWall', () => {
  const Page: React.FC = () => {
    const dialog = useDialog();
    const onClick: MouseEventHandler = (e) => {
      dialog.builder().setPositiveButtonLabel('Accept').build();
    };
    return (
      <div>
        <button data-testid="open-button" onClick={onClick}>
          Open
        </button>
      </div>
    );
  };

  const App: React.FC = () => {
    return (
      <div>
        <DialogWall>
          <Page />
        </DialogWall>
      </div>
    );
  };

  afterEach(() => {
    cleanup();
  });

  it('shows dialog and then it is closed', () => {
    act(() => {
      render(<App />);
    });
    const openButton = getByTestId(document.documentElement, 'open-button');

    act(() => {
      openButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const closeButton = getByText(document.documentElement, 'Accept');

    act(() => {
      closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(queryByText(document.documentElement, 'Accept')).toBeNull();
  });
});
