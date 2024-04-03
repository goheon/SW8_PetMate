import DatePicker from 'react-datepicker';
import { useState } from 'react';

export const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  return <DatePicker showIcon selected={startDate} onChange={(date) => setStartDate(date)} />;
};
