import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchUpdateUser, fetchUserInfo } from './util/APIrequest';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../../store';
import { ButtonLoading } from '../Spinner';

const ProfileImgEditModal = ({ isOpen, onClose }) => {
  const [preview, setPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const fileInput = useRef();
  const dispatch = useDispatch();

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('img', fileInput.current.files[0]);

    if (formData.get('img') === 'undefined') {
      Swal.fire({
        title: '이미지를 업로드해주세요',
        icon: 'warning',
        confirmButtonText: '확인',
        customClass: { container: 'custom-popup' },
      });
      return;
    }
    setIsLoading(true);
    console.log(formData.get('img'));
    const response = await fetchUpdateUser(formData);
    if (!response.ok) throw new Error('Network response was not ok');
    const resData = await fetchUserInfo();
    dispatch(setUserInfo(resData));
    setIsLoading(false);
    Swal.fire({
      title: '수정되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
      customClass: { container: 'custom-popup' },
    });
  };

  const handleImageUpload = (e) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    reader.onerror = () => {};
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={stopPropagation}>
            <button className="modal-close-btn" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
            </button>
            <div className="modal_inner">
              <form action="submit" id="modal_form" className="modal_form" onSubmit={handleSubmit}>
                <span className="profile-image-edit">프로필 이미지 변경</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInput} />
                {preview && (
                  <div className="file_img-box">
                    <img src={preview} alt="preview" />
                  </div>
                )}
                <div className="submit-button-wrapper">
                  <button type="submit" className="modal_submit">
                    {isLoading === true ? <ButtonLoading size={15} /> : '변경하기'}
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

export default ProfileImgEditModal;
