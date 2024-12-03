import Modal from "./Modal"
import YouTubePlayer from './YoutubePlayer'

const TrailerModal = ({videoKey, isOpen, setOpen}) => {
  return (
    <Modal isOpen={isOpen} handleClose={() => setOpen(false)}>
      {videoKey ? (
      <YouTubePlayer
        videoKey={videoKey}
      />
      ) : (
        <div style={{padding: "30px"}}><h6>no trailer available. Try another movie</h6></div>
      )}
    </Modal>
  )
}

export default TrailerModal