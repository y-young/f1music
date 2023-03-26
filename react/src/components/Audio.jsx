const Audio = ({ cloudId, src, children, ...props }) => (
  <audio {...props}>
    {cloudId && (
      <source src={`//music.163.com/song/media/outer/url?id=${cloudId}.mp3`} />
    )}
    {src && <source src={src} />}
    {children}
  </audio>
);

export default Audio;
