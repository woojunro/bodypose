import './column-video.css';
import ReactPlayer from 'react-player';

const ColumnVideo = ({ data }) => {
  const RenderedVideos = data.video.map((vid, idx) => {
    return (
      <ReactPlayer
        key={idx}
        className="column-video-player"
        url={vid}
        width="100%"
        height="100%"
      />
    );
  });
  return <div>{RenderedVideos}</div>;
};

export default ColumnVideo;
