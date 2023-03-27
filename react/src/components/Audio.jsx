import { forwardRef } from "react";
import useAudioVolume from "../hooks/useAudioVolume";

const Audio = ({ cloudId, src, children, initialVolume, ...props }, ref) => {
  const [audioVolume, setVolume] = useAudioVolume(initialVolume);

  const setInitialVolume = event => {
    event.target.volume = audioVolume;
  };

  const handleVolumeChange = event => {
    const volume = event.target.volume;
    setVolume(volume);
  };

  if (!cloudId) {
    // Player doesn't work with <source>
    return (
      <audio
        ref={ref}
        src={src}
        onCanPlay={setInitialVolume}
        onVolumeChange={handleVolumeChange}
        {...props}
      />
    );
  }

  return (
    <audio
      ref={ref}
      onCanPlay={setInitialVolume}
      onVolumeChange={handleVolumeChange}
      {...props}
    >
      {cloudId && (
        <source
          src={`//music.163.com/song/media/outer/url?id=${cloudId}.mp3`}
        />
      )}
      {src && <source src={src} />}
      {children}
    </audio>
  );
};

export default forwardRef(Audio);
