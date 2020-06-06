import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { DialogWall } from './DialogWall';

describe('DialogWall', () => {
  beforeEach(() => {
    const mock = jest.fn();
    mock.mockReturnValue(undefined);
    document.elementFromPoint = mock;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders children properly', () => {
    const rendered = render(
      <DialogWall>
        <div>Child</div>
      </DialogWall>
    );
    const element = rendered.getByText('Child');
    expect(element).toBeInTheDocument();
  });
});
