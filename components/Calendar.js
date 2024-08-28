'use client';
import { Fugaz_One } from 'next/font/google';
import React, { useState, useEffect } from 'react';
import { baseRating, gradients } from '@/utils';

const months = {
  'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr', 'May': 'May',
  'June': 'Jun', 'July': 'Jul', 'August': 'Aug', 'September': 'Sept',
  'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
};
const monthsArr = Object.keys(months);
const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Calendar(props) {
  const { demo, completeData, handleSetMood } = props;
  const [selectedMonth, setSelectMonth] = useState(monthsArr[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    const now = new Date();
    const numericMonth = monthsArr.indexOf(selectedMonth);
    const data = completeData?.[selectedYear]?.[numericMonth] || {};

    // Calculate days in month and display logic
    const monthNow = new Date(selectedYear, numericMonth, 1);
    const firstDayOfMonth = monthNow.getDay();
    const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();
    const daysToDisplay = firstDayOfMonth + daysInMonth;
    const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

    const daysArray = [...Array(numRows).keys()].map((row, rowIndex) => (
      dayList.map((dayOfWeek, dayOfWeekIndex) => {
        let dayIndex = (rowIndex * 7) + dayOfWeekIndex - (firstDayOfMonth - 1);
        let dayDisplay = dayIndex > 0 && dayIndex <= daysInMonth;
        let isToday = dayIndex === now.getDate() && numericMonth === now.getMonth() && selectedYear === now.getFullYear();
        let color = demo
          ? gradients.indigo[baseRating[dayIndex]] || 'white'
          : dayIndex in data
            ? gradients.indigo[data[dayIndex]] || 'white'
            : 'white';

        return {
          dayIndex,
          dayDisplay,
          isToday,
          color
        };
      })
    ));

    setCalendarDays(daysArray);
  }, [selectedMonth, selectedYear, completeData, demo]);

  function handleIncrementMonth(val) {
    const currentMonthIndex = monthsArr.indexOf(selectedMonth);

    if (currentMonthIndex + val < 0) {
      setSelectedYear(curr => curr - 1);
      setSelectMonth(monthsArr[monthsArr.length - 1]);
    } else if (currentMonthIndex + val > 11) {
      setSelectedYear(curr => curr + 1);
      setSelectMonth(monthsArr[0]);
    } else {
      setSelectMonth(monthsArr[currentMonthIndex + val]);
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='grid grid-cols-5 gap-4'>
        <button onClick={() => handleIncrementMonth(-1)} className='mr-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60' aria-label="Go to previous month">
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        <p className={'text-center col-span-3 capitalized whitespace-nowrap textGradient ' + fugaz.className}>
          {selectedMonth}, {selectedYear}
        </p>
        <button onClick={() => handleIncrementMonth(1)} className='ml-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60' aria-label="Go to next month">
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
      <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
        {calendarDays.map((row, rowIndex) => (
          <div key={rowIndex} className='grid grid-cols-7 gap-1'>
            {row.map((day, dayOfWeekIndex) => (
              day.dayDisplay ? (
                <div
                  style={{ background: day.color }}
                  className={'text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ' +
                    (day.isToday ? ' border-indigo-400' : ' border-indigo-100') +
                    (day.color === 'white' ? ' text-indigo-400' : ' text-white')}
                  key={dayOfWeekIndex}
                >
                  <p>{day.dayIndex}</p>
                </div>
              ) : (
                <div className='bg-white' key={dayOfWeekIndex} />
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
