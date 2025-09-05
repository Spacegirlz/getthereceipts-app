
import { Howl } from 'howler';
import { useEffect, useRef } from 'react';

const useSound = (src, options = {}) => {
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      ...options,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [src, options]);

  const play = (playOptions) => {
    if (soundRef.current) {
      soundRef.current.play(playOptions);
    }
  };

  return [play];
};

export default useSound;
