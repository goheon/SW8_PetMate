import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './home.scss';
import Footer from '../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_URL, cutAddressToDistrict } from '../util/constants';

//리뷰 정보 가지구오기
async function getReview() {
  try {
    const response = await fetch(`${API_URL}/booklist/review/all`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    if (data) return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

function ReviewModal({ el, setReviewModalData }) {
  return (
    <div className="review-modal">
      <div className="review-modal_inner">
        <div className="main02-swiper_img-box">
          <img src={el.review.image[0]} alt="" />
        </div>
        <div className="main02-swiper_text-box">
          <h4>{el.review.title}</h4>
          <div>
            {[...Array(5)].map((star, i) => {
              if (el.review.starRate > i) {
                return (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                  </svg>
                );
              } else {
                return (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                  </svg>
                );
              }
            })}
            <p>{el.value.username}</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
            <p>{cutAddressToDistrict(el.value.address)}</p>
          </div>
          <p>{el.review.comment}</p>

          <div className="main02-swiper_tag-box">
            {el.value.petInfo.map((tag, index) => {
              return <span key={index}>#{tag.type}</span>;
            })}
          </div>
        </div>
        <button
          className="review-modal_close-btn"
          onClick={() => {
            setReviewModalData();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Home() {
  let [ani, setAni] = useState('');
  const [latestReview, setLatestReview] = useState([]);
  const petSitterInfo = useSelector((state) => state.petSitterInfo);
  const [reviewModalData, setReviewModalData] = useState();

  useEffect(() => {
    setTimeout(() => {
      setAni('on');
    }, 100);
    setTimeout(() => {
      setAni('on end');
    }, 1700);

    getReview().then((data) => setLatestReview(data.data));

    return () => {
      setAni('');
    };
  }, []);

  return (
    <>
      <Header />
      <section className={'main-banner ' + ani}>
        <div className="main-banner_inner">
          <h3>
            반려동물 케어 파트너<span>.</span>
          </h3>
          <p>
            혼자 남겨진 반려동물을 생각하며, 외출을 망설인 적이 있으신가요? <br />
            이제는 펫시터에게 맡기고, 여러분의 소중한 일상을 마음 편히 보내세요.
          </p>
        </div>
      </section>
      <section className={'main01 ' + ani}>
        <div className="main01_inner">
          <h3>
            전문 펫시터<span>.</span>
          </h3>
          <p>반려동물 관련 자격증 또는 전문 지식을 갖춘 분들이 전문 펫시터로 활동하고 있습니다.</p>
          <ul className="petsitter-list">
            {petSitterInfo.map((el) => {
              return (
                <li key={el.userId}>
                  <Link to={'/'}>
                    <div className="petsitter_top">
                      <div className="pt_img">
                        <img src={el.img} alt="" />
                      </div>
                      <div className="pt_detail">
                        <h4>{el.name} 펫시터</h4>
                        <p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                          </svg>
                          후기<span>{el.review}</span>개
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                          </svg>
                          단골 고객 <span>{el.regularCustomer}</span>명
                        </p>
                      </div>
                    </div>
                    <div className="petsitter_mid">
                      <ul>
                        {el.info.map((info, i) => {
                          return (
                            <li key={i}>
                              <p>{info}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="petsitter_btm">
                      <p>
                        {el.check.map((check, i) => {
                          return (
                            <span key={i}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                              </svg>
                              {check}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="main02">
        <div className="main02_inner">
          <h3>
            방금 올라온 이용 후기<span>.</span>
          </h3>
          <p>실제로 이용한 고객님들의 따끈따끈한 이용 후기를 확인하세요!</p>

          <div className="main02-swiper-wrap">
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              navigation={true}
              modules={[Navigation]}
              className="main02-swiper"
            >
              {latestReview &&
                latestReview.map((el, index) => {
                  if (index < 8) {
                    return (
                      <SwiperSlide
                        key={el.review._id}
                        onClick={() => {
                          setReviewModalData(el);
                        }}
                      >
                        <div>
                          <div className="main02-swiper_img-box">
                            <img src={el.review.image[0]} alt="" />
                          </div>
                          <div className="main02-swiper_text-box">
                            <h4>{el.review.title}</h4>
                            <div>
                              {[...Array(5)].map((star, i) => {
                                if (el.review.starRate > i) {
                                  return (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                    </svg>
                                  );
                                } else {
                                  return (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                      <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                                    </svg>
                                  );
                                }
                              })}
                              <p>{el.value.username}</p>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                              </svg>
                              <p>{cutAddressToDistrict(el.value.address)}</p>
                            </div>
                            <p>{el.review.comment}</p>

                            <div className="main02-swiper_tag-box">
                              {el.value.petInfo.map((tag, index) => {
                                return <span key={index}>#{tag.type}</span>;
                              })}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  }
                  return null;
                })}
            </Swiper>
          </div>
        </div>
      </section>

      {reviewModalData && <ReviewModal el={reviewModalData} setReviewModalData={setReviewModalData} />}
      <Footer />
    </>
  );
}

export default Home;
