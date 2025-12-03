import { useEffect, useState } from 'react';
import { Globals } from '../constants/Globals.ts';

export function useDimensions() {
  const [height, setHeight] = useState(
    window.innerHeight - Globals.HEADER_HEIGHT_IN_PX - Globals.FOOTER_HEIGHT_IN_PX
  );

  useEffect(() => {
    const resizeHandler = () => {
      setHeight(window.innerHeight - Globals.HEADER_HEIGHT_IN_PX - Globals.FOOTER_HEIGHT_IN_PX);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return [window.innerWidth, height]
}