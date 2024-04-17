import { API_URL } from '../../../util/constants';

//회원 정보 조회
export async function fetchUserInfo() {
  try {
    const response = await fetch(`${API_URL}/mypage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const resData = await response.json();

    return resData;
  } catch (error) {
    console.error('Error:', error);
  }
}

//회원 탈퇴 요청
export async function fetchWithdrawal() {
  try {
    const response = await fetch(`${API_URL}/mypage/resign`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//회원정보 수정 요청
export async function fetchUpdateUser(userInfo) {
  try {
    const response = await fetch(`${API_URL}/mypage`, {
      method: 'PUT',
      body: userInfo,
      credentials: 'include',
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//펫시터 전환 요청
export async function fetchRegistrationPetSitter(formData) {
  try {
    const response = await fetch(`${API_URL}/mypage/sitter`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//펫시터 정보 수정 요청
export async function fetchEditPetSitter(formData, sitterId) {
  try {
    const response = await fetch(`${API_URL}/sitterpage/${sitterId}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//펫시터 정보 요청(userId)
export const fetchGetSitterInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/sitterpage`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

//회원 예약 목록 조회 요청 mypage/Reservation
export async function fetchGetBookList() {
  try {
    const response = await fetch(`${API_URL}/booklist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//리뷰 작성 POST 요청
export async function fetchPostReview(data, id) {
  try {
    const response = await fetch(`${API_URL}/booklist/review/${id}`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//회원 예약 상태 수정 요청(진행중 -> 완료)
export async function fetchOrderComplete(orderId) {
  try {
    const response = await fetch(`${API_URL}/mypage/${orderId}/complete`, {
      method: 'PATCH',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//펫시터 회원 예약 목록 조회 요청 mypage/PetSitterReservation
export async function fetchGetPetSitterBookList(sitterId) {
  try {
    const response = await fetch(`${API_URL}/sitterpage/orderlist/${sitterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//펫시터회원 예약요청 확인 -> 진행중 요청
export async function fetchOrderAccept(orderId) {
  try {
    const response = await fetch(`${API_URL}/sitterpage/${orderId}/accept`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

//펫시터회원 예약요청 거절 -> 취소 요청
export async function fetchOrderReject(orderId) {
  try {
    const response = await fetch(`${API_URL}/sitterpage/${orderId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 유저 리뷰 관리
export const fetchReviews = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/booklist/review/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('서버 통신에 실패했습니다.');
    }
    const data = await response.json();
    return data.data; // API 응답에서 필요한 데이터 부분만 반환
  } catch (error) {
    console.error('Error:', error);
  }
};

// 펫시터 리뷰 관리
export const fetchPetSitterReviews = async (sitterId) => {
  try {
    const response = await fetch(`${API_URL}/booklist/review/sitter/${sitterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('서버 통신에 실패했습니다.');
    }
    const data = await response.json();
    return data.data; // API 응답에서 필요한 데이터 부분만 반환
  } catch (error) {
    console.error('Error:', error);
  }
};
