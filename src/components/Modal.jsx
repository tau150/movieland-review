
import ReactDOM from 'react-dom';
import { useRef } from 'react'
import { useClickOutside } from "../hooks/useClickOutside"
import "../styles/modal.scss"

const DEFAULT_MODAL_ID = 'modal-root'

const Modal = ({children, isOpen, handleClose, id = DEFAULT_MODAL_ID }) => {
  const modalRef = useRef(null);

  useClickOutside(modalRef, handleClose);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal" >
      <div className="modal-content" ref={modalRef}>
        <div className="custom-modal-header">
          <button className='close-button' onClick={handleClose}>X</button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById(id)
  );
}

export default Modal