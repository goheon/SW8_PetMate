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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
            </button>
            <div className="modal_inner">
              <form action="submit" id="modal_form" className="modal_form" onSubmit={handleSubmit}>
                <span className="inquiry">{name} 님에게 문의하기</span>
                <span>제목</span>
                <input type="text" className="title" placeholder='제목을 입력하세요.' />
                <span>내용</span>
                <textarea placeholder='문의내용을 입력하세요.' name="content" id="content" cols="30" rows="5" className="content"></textarea>
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
