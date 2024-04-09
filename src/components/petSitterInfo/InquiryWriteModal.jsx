import React from 'react';
import './InquiryWriteModal.scss';

const InquiryWriteModal = ({ isOpen, onClose, name }) => {
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={stopPropagation}>
            <button className="modal-close-btn" onClick={onClose}>
              X
            </button>
            <div className="modal_inner">
              <form action="submit" id="modal_form" className="modal_form" onSubmit={handleSubmit}>
                <span className="inquiry">{name} 님에게 문의하기</span>
                <span>제목</span>
                <input type="text" className="title" />
                <span>내용</span>
                <textarea name="content" id="content" cols="30" rows="10" className="content"></textarea>
                <div className="submit-button-wrapper">
                  <button type="submit" className="modal_submit">
                    문의하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiryWriteModal;
