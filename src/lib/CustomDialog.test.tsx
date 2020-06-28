import React, { MouseEventHandler } from 'react';
import { act, cleanup, getByText, queryByTestId, render } from '@testing-library/react';

import { DialogWall, useDialog } from './DialogWall';
import { DialogComponent } from './DialogComponent';
import { ResultCallback } from './ResultCallback';

const CustomDialog: DialogComponent = (props) => {
  return (
    <div data-testid="custom-dialog">
      <p>My Custom Dialog</p>
      <button onClick={(): void => props.close(true)}>CloseTrue</button>
    </div>
  );
};

interface TesterProps {
  resultCallback: ResultCallback;
}

const Tester: React.FC<TesterProps> = (props) => {
  const dialog = useDialog();

  const showDialog: MouseEventHandler = (e) => {
    dialog.show({
      component: CustomDialog,
      onClose: props.resultCallback,
    });
  };

  return (
    <div>
      <button onClick={showDialog}>ShowDialog</button>
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

describe('Custom Dialog', () => {
  beforeEach(() => {
    const mock = jest.fn();
    mock.mockReturnValue(undefined);
    document.elementFromPoint = mock;
  });

  afterEach(() => {
    cleanup();
  });

  it('returns result properly', async (done) => {
    const callback = jest.fn();
    act(() => {
      render(<Main resultCallback={callback} />);
    });
    await act(async () => {
      getByText(document.documentElement, 'ShowDialog').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve => {
        setTimeout(resolve, 0);
      }));
    });
    expect(queryByTestId(document.documentElement, 'custom-dialog')).not.toBeNull();

    // Close dialog
    await act(async () => {
      getByText(document.documentElement, 'CloseTrue').dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
    });
    expect(queryByTestId(document.documentElement, 'custom-dialog')).toBeNull();
    expect(callback).toHaveBeenCalledWith(true);

    done();
  });
});
