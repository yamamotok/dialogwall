import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import './Layout.css';
import { useDialog } from '../useDialog';

/**
 * Phase.
 */
enum Phase {
  Initial = 'initial',
  Ready = 'ready',
}

/**
 * Layout, which is centering content vertically, with fade-in animation.
 */
export const Layout: React.FC = (props) => {
  const [phase, setPhase] = useState<Phase>(Phase.Initial);
  const layoutRef = useRef<HTMLDivElement>(null);
  const service = useDialog();

  // Just for fade-in animation, changing CSS classes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(Phase.Ready);
    }, 10);
    return (): void => clearTimeout(timer);
  }, []);

  // Esc key handling
  useEffect(() => {
    const close = (): void => {
      const current = service.getCurrent();
      if (current?.useEscForCancel) {
        service.hide(current, false);
      }
    };
    const onEscPressed = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onEscPressed);
    return (): void => document.removeEventListener('keydown', onEscPressed);
  });

  // When margin area was clicked, dialog might have to be closed.
  const onClick: MouseEventHandler = (e) => {
    const current = service.getCurrent();
    if (!current?.useMarginClickForCancel) {
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    const hit = document.elementFromPoint(x, y);
    if (hit === layoutRef.current) {
      service.hide(current, false);
    }
  };

  const className = classNames('DialogWallLayout', phase);

  return (
    <div {...{ className, onClick }} ref={layoutRef}>
      {props.children}
    </div>
  );
};
