import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.scss';

import { setStartDate, setEndDate, setStartTime, setEndTime } from '../../store';

export const MyDatePicker = ({ type }) => {
  const dispatch = useDispatch();
  const startDate = useSelector((state) => state.reservationStartDate.startDate);
  const endDate = useSelector((state) => state.reservationEndDate.endDate);

  const handleOnChange = async (date, type) => {
    type === 'start' ? dispatch(setStartDate(date.toString())) : dispatch(setEndDate(date.toString()));
    const endDateObject = new Date(Date.parse(endDate));

    //startDate가 endDate보다 뒤인 경우 endDate를 같게 변경
    if (type === 'start' && date > endDateObject) {
      dispatch(setEndDate(date.toString()));
    }
  };

  return (
    <DatePicker
      selected={type === 'start' ? new Date(startDate) : new Date(endDate)}
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
          <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {'<'}
          </button>
          <span className="cutom-month">{date.getMonth() + 1}월</span>
          <span className="custom-year">{date.getFullYear()}</span>
          <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {'>'}
          </button>
        </div>
      )}
    />
  );
};

export const TimePicker = ({ type }) => {
  const dispatch = useDispatch();
  const startDate = useSelector((state) => state.reservationStartDate.startDate);
  const endDate = useSelector((state) => state.reservationEndDate.endDate);
  const startTime = useSelector((state) => state.reservationStartTime.startTime);
  const endTime = useSelector((state) => state.reservationEndTime.endTime);

  const handleOnChange = (time, type) => {
    type === 'start' ? dispatch(setStartTime(time.toString())) : dispatch(setEndTime(time.toString()));

    const endTimeObject = new Date(Date.parse(endTime));

    if (type === 'start' && time >= endTimeObject) {
      const newEndtime = new Date(time.setHours(new Date(time).getHours() + 1));

      dispatch(setEndTime(time.toString()));
    }
  };
  new Date(startTime).setHours(new Date(startTime).getHours() + 1);
  const shouldSetTimeBounds = type === 'end' && new Date(endDate).getTime() <= new Date(startDate).getTime();

  return (
    <DatePicker
      onChange={(time) => {
        handleOnChange(time, type);
      }}
      selected={type === 'start' ? new Date(startTime) : new Date(endTime)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={60}
      timeCaption={type === 'start' ? '시작 시간' : '종료 시간'}
      dateFormat="h:mm aa"
      minTime={
        shouldSetTimeBounds
          ? type === 'start'
            ? undefined
            : new Date(startTime).setHours(new Date(startTime).getHours() + 1)
          : undefined
      }
      maxTime={shouldSetTimeBounds ? (type === 'start' ? undefined : new Date().setHours(23, 59, 0)) : undefined}
    />
  );
};
