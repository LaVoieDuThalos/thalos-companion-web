import { useEffect, useState } from 'react';
import { Globals } from '../constants/Globals.ts';

export function useDimensions() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(
    window.innerHeight - Globals.HEADER_HEIGHT_IN_PX - Globals.FOOTER_HEIGHT_IN_PX
  );

  useEffect(() => {
    const resizeHandler = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight - Globals.HEADER_HEIGHT_IN_PX - Globals.FOOTER_HEIGHT_IN_PX);
    };

    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', resizeHandler);
    };
  }, []);

  return [width, height];
}