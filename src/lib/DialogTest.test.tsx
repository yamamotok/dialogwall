import React, { MouseEventHandler } from 'react';
import { act, cleanup, getByText, queryByTestId, render } from '@testing-library/react';

import { DialogWall } from './DialogWall';
import { ResultCallback } from './ResultCallback';
import { DEFAULT_POSITIVE_BUTTON_LABEL } from './modules/DefaultDialog';
import { useDialog } from './useDialog';

interface TesterProps {
  resultCallback: ResultCallback;
}

const Tester: React.FC<TesterProps> = (props) => {
  const dialog = useDialog();

  const onlyMessage: MouseEventHandler = (e) => {
    dialog.builder().setMessage('Hello').setResultCallback(props.resultCallback).show();
  };
  const twoButtons: MouseEventHandler = (e) => {
    dialog
      .builder()
      .setMessage('Hello')
      .setPositiveButton('Accept')
      .setNegativeButton('Decline')
      .setResultCallback(props.resultCallback)
      .show();
  };
  const customResult: MouseEventHandler = (e) => {
    dialog
      .builder()
      .setMessage('Hello')
      .setPositiveButton('Accept', 'custom_result')
      .setResultCallback(props.resultCallback)
      .show();
  };
  const escKey: MouseEventHandler = (e) => {
    dialog
      .builder()
      .setMessage('Hello')
      .setResultCallback(props.resultCallback)
      .setSpec({ useEscForCancel: true })
      .show();
  };
  return (
    <div>
      <button onClick={onlyMessage}>OnlyMessage</button>
      <button onClick={twoButtons}>TwoButtons</button>
      <button onClick={customResult}>CustomResult</button>
      <button onClick={escKey}>EscKey</button>
    </div>
  );
};

const Main: React.FC<TesterProps> = (props) => {
  return (
    <DialogWall>
      <Tester {...props} />
    </DialogWall>
  );
};

describe('Default Dialog', () => {
  beforeEach(() => {
    const mock = jest.fn();
    mock.mockReturnValue(undefined);
    document.elementFromPoint = mock;
  });

  afterEach(() => {
    cleanup();
  });

  it('is not visible initially', () => {
    act(() => {
      render(<Main resultCallback={(result): void => undefined} />);
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).toBeNull();
  });

  it('shows simplest dialog', async () => {
    const callback = jest.fn();
    act(() => {
      render(<Main resultCallback={callback} />);
    });
    await act(async () => {
      getByText(document.documentElement, 'OnlyMessage').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).not.toBeNull();

    // Close dialog
    await act(async () => {
      getByText(document.documentElement, DEFAULT_POSITIVE_BUTTON_LABEL).dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).toBeNull();
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('shows two-button dialog', async () => {
    const callback = jest.fn();
    act(() => {
      render(<Main resultCallback={callback} />);
    });
    await act(async () => {
      getByText(document.documentElement, 'TwoButtons').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).not.toBeNull();

    // Close dialog
    await act(async () => {
      getByText(document.documentElement, 'Decline').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).toBeNull();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it('returns custom dialog result', async () => {
    const callback = jest.fn();
    act(() => {
      render(<Main resultCallback={callback} />);
    });
    await act(async () => {
      getByText(document.documentElement, 'CustomResult').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).not.toBeNull();

    // Close dialog
    await act(async () => {
      getByText(document.documentElement, 'Accept').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).toBeNull();
    expect(callback).toHaveBeenCalledWith('custom_result');
  });

  it('is closed by ESC key press', async () => {
    const callback = jest.fn();
    act(() => {
      render(<Main resultCallback={callback} />);
    });
    await act(async () => {
      getByText(document.documentElement, 'EscKey').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).not.toBeNull();

    // Close dialog
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'dialogwall-default-dialog')).toBeNull();
    expect(callback).toHaveBeenCalledWith(false);
  });
});
