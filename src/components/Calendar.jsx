import DatePicker from 'react-datepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export const Calendar = () => {
  const [date, setDate] = useState(new Date());
  return <DatePicker selected={date} onChange={(date) => setDate(date)} />;
};

export const Time = () => {
  const [time, setTime] = useState(new Date());
  if (time < 45) {
    setTime(30);
  }
  return (
    <DatePicker
      onChange={(time) => {
        console.log(time);
        return setTime(time);
      }}
      selected={time}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
    />
  );
};
