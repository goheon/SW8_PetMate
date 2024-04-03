import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import './AddressAPI.scss';

const AddressAPI = (props) => {
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    props.setInputValues((current)=> {
      return ({
        ...current,
        postcode: data.zonecode,
        address: fullAddress,
      })
    });
    
  };

  const handleClose = ()=> {
    props.setIsOpen(false);
  }

  return (
    <div className="AddressAPI">
      <div className="AddressAPI_inner">
        <DaumPostcodeEmbed onClose={handleClose} onComplete={handleComplete} {...props} />
        <div
          className="AddressAPI_close"
          onClick={() => {
            props.setIsOpen(false);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AddressAPI;
