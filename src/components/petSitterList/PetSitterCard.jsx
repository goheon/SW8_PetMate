import { useState } from 'react';
import Stars from '../Stars';
import './PetSitterCard.scss';

function PetSitterCard(props) {
    const dogTypes = ['소형견', '중형견', '대형견'];
    const typeMapping = {
        small: '소형견',
        medium: '중형견',
        large: '대형견',
        cat: '고양이',
    };

function handleCardClick(sitterId) {
    console.log(sitterId);
}

    return (
        <div className='search-list_inner'>
            <div className='search_wrap' onClick={() => (handleCardClick(props.petsitter.sitterId))}>
                <div className='img-box'>
                    <img src='public/main02_review_01.jpg' />
                </div>
                <div className='text-box'>
                    <div className='text-box_top'>
                        <p>{props.petsitter.location}&nbsp;파트너&nbsp;·&nbsp;{props.petsitter.name}&nbsp;님</p>
                        <h4>{props.petsitter.title}</h4>
                    </div>
                    <div className='text-box_bottom'>
                        <div className='tb_left'>
                            <div className='tb_keyword'>
                                {
                                    props.petsitter.type.map((type, index) => (<span key={index}>#{type}</span>))
                                }
                            </div>
                            <div className='tb_review'>
                                <Stars rating={5} />
                                <p>후기 8개</p>
                            </div>
                        </div>
                        <div className='tb_right'>

                            {
                                Object.entries(props.petsitter.hourlyRate).map(([size, price], index) => (
                                    <div className='tr_price' key={index}>
                                        <div>
                                            <p>{typeMapping[size]}</p>
                                        </div>
                                        <p>&#x20A9;{price.toLocaleString()}<span>/시간</span></p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PetSitterCard;