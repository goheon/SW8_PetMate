import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './TypeModal.scss';

function TypeModal(props) {
    const TYPE = ['전체 🐶🐱', '강아지', '고양이'];
    const SIZE = ['소형견', '중형견', '대형견'];
    const [tempSelectedType, setTempSelectedType] = useState(props.selectedType);
    const [tempSelectedSizes, setTempSelectedSizes] = useState([]);

    const handleTypeChange = (type) => {
        setTempSelectedType(type);
        if (TYPE.indexOf(type) === 1) {
            setTempSelectedSizes(SIZE);
        } else {
            setTempSelectedSizes([]);
        }
    };

    const handleSizeChange = (size, isChecked) => {
        if (isChecked) { // 체크
            setTempSelectedSizes([...tempSelectedSizes, size]);
        } else { // 체크 해제
            // 현재 선택된 사이즈가 1개 이상일 경우에만 체크 해제를 수행
            if (tempSelectedSizes.length > 1) {
                setTempSelectedSizes(tempSelectedSizes.filter(s => s !== size));
            } else {
                // 선택된 사이즈가 하나뿐일 경우 체크 해제를 수행하지 않고,
                // 사용자에게 최소 하나의 사이즈를 선택해야 한다는 것을 알립니다.
                Swal.fire({
                    title: '선택 확인',
                    text: `강아지 크기는 최소 1개 이상 선택되어야 합니다.`,
                    icon: 'warning',
                    customClass: { container: 'custom-popup' },
                  });
            }
        };
    }

    const handleResetClick = () => {
        props.setSelectedType('전체 🐶🐱');
        props.setActiveModal('');
    };

    const handleApplyClick = () => {
        props.setSelectedType(tempSelectedType);
        props.setSelectedSizes(tempSelectedSizes);
        props.setActiveModal('');

    };

    useEffect(() => {
        // 강아지가 선택여부 확인 후 상태 업데이트
        if (props.selectedType === '강아지') {
            setTempSelectedSizes(props.selectedSizes.length > 0 ? props.selectedSizes : SIZE);
        } else {
            setTempSelectedSizes([]);
        }
    }, [props.selectedType, props.selectedSizes]);

    return (
        <div className='type-modal'>
            <div className='apply-box'>
                <p>반려동물 종류</p>
                <div className='apply-radio-box'>
                    {
                        TYPE.map((type) => {
                            return (
                                <div className='radio-box' key={type}>
                                    <label className='radio-label'>
                                        <input type="radio" name="radio" checked={tempSelectedType === type}
                                            onChange={() => handleTypeChange(type)} />
                                        <span>{type}</span>
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>

                {tempSelectedType === '강아지' ?
                    <div className='dog-checked'>
                        <p>강아지 크기</p>
                        <div className='apply-check-box'>
                            {
                                SIZE.map((size) => {
                                    return (
                                        <div className='apply-check' key={size}>
                                            <label className='check-label'>
                                                <input type="checkbox" name="checkbox" checked={tempSelectedSizes.includes(size)}
                                                    onChange={(e) => handleSizeChange(size, e.target.checked)} />
                                                <span>{size}</span>
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> : null
                }

            </div>

            <button className='reset-button' onClick={handleResetClick}>초기화</button>
            <button className='apply-button' onClick={handleApplyClick}>적용하기</button>
        </div>
    )
}

export default TypeModal;