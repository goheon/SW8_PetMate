import React, { useState, useEffect } from 'react';

export const ButtonLoading = ({ size }) => {
  const [spinners, setSpinners] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-spinners')
        .then((module) => {
          setSpinners(module); // 전체 모듈을 상태로 설정
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      {spinners && spinners.ClockLoader ? (
        <>
          <spinners.ClockLoader color={'#FFF'} size={size} />
        </>
      ) : null}
    </>
  );
};
