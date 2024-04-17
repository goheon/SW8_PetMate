import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../Stars';
import { cutAddressToDistrict } from '../../util/constants';
import './PetSitterCard.scss';

function PetSitterCard(props) {
    const navigate = useNavigate();
    const typeMapping = {
        small: '소형견',
        medium: '중형견',
        large: '대형견',
        cat: '고양이',
    };

    const handleCardClick = (sitterId) => {
        navigate(`/pet-sitter/${sitterId}`);
    }

    return (
        <div className='search-list_inner'>
            <div className='search_wrap' onClick={() => (handleCardClick(props.sitter.sitterId))}>
                <div className='img-box'>
                    <img src={props.sitter.image} />
                    {
                        console.log(props.sitter.image)
                    }
                </div>
                <div className='text-box'>
                    <div className='text-box_top'>
                        <p>{cutAddressToDistrict(props.sitter.address)}&nbsp;파트너&nbsp;&middot;&nbsp;{props.sitter.name}&nbsp;님</p>
                        <h4>{props.sitter.title}</h4>
                    </div>
                    <div className='text-box_bottom'>
                        <div className='tb_left'>
                            <div className='tb_keyword'>
                                {
                                    props.sitter.type.map((type, index) => (<span key={index}>#{type}</span>))
                                }
                            </div>
                            <div className='tb_review'>
                                <Stars rating={5} />
                                <p>후기 8개</p>
                            </div>
                        </div>
                        <div className='tb_right'>

                            {
                                Object.entries(props.sitter.hourlyRate).map(([size, price], index) => (
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