import DatePicker from 'react-datepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.scss';
import { setStartDate, setEndDate, setStartTime, setEndTime } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

export const MyDatePicker = ({ type }) => {
  const [newDate, setNewDate] = useState(new Date());
  const dispatch = useDispatch();
  const startDate = useSelector((state) => state.reservationStartDate.startDate);
  const endDate = useSelector((state) => state.reservationEndDate.endDate);

  const handleOnChange = (date, type) => {
    setNewDate(date);
    type === 'start' ? dispatch(setStartDate(date.toString())) : dispatch(setEndDate(date.toString()));

    const endDateObject = new Date(Date.parse(endDate));
    //startDate가 endDate보다 큰 경우 endDate의 상태 변경 필요..
    // if (type === 'start' && date > endDateObject) {

    // }
  };

  return (
    <DatePicker
      selected={newDate}
      onChange={(date) => handleOnChange(date, type)}
      dateFormat="yyyy/MM/dd"
      minDate={type === 'start' ? new Date() : startDate}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {'<'}
          </button>
          <span className="cutom-month">{date.getMonth(date) + 1}월</span>
          <span className="custom-year">{date.getFullYear(date)}</span>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {'>'}
          </button>
        </div>
      )}
    />
  );
};

export const TimePicker = ({ type }) => {
  const [newTime, setNewTime] = useState(new Date());
  const dispatch = useDispatch();

  const handleOnChange = (time, type) => {
    setNewTime(time);
    type === 'start' ? dispatch(setStartTime(date.toString())) : dispatch(setEndTime(date.toString()));
  };

  return (
    <DatePicker
      onChange={(time) => {
        handleOnChange(time, type);
      }}
      selected={newTime}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={60}
      timeCaption={type === 'start' ? '시작 시간' : '종료 시간'}
      dateFormat="h:mm aa"
    />
  );
};
