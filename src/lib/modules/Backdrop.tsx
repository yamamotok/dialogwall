import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import './Backdrop.css';

interface Props {
  light?: boolean;
}

enum Phase {
  Initial = 'initial',
  Ready = 'ready',
}

/**
 * Backdrop behind a dialog box.
 */
export const Backdrop: React.FC<Props> = (props) => {
  const [phase, setPhase] = useState<Phase>(Phase.Initial);

  // Just for fade-in animation, changing CSS classes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(Phase.Ready);
    }, 10);
    return (): void => clearTimeout(timer);
  }, []);

  const className = classNames('DialogWallBackdrop', { light: props.light }, phase);

  return <div {...{ className }}>{props.children}</div>;
};
