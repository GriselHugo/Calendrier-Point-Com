import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';

import { IonIcon } from "@ionic/react";
import { todayOutline } from 'ionicons/icons';
import { caretBack } from 'ionicons/icons';
import { caretForward } from 'ionicons/icons';
import { removeOutline } from 'ionicons/icons';
import { reorderThreeOutline } from 'ionicons/icons';

import './Calendar.css';

import expressServer from "../../api/server-express";

function Calendar() {
  const [CurrentDate, setCurrentDate] = useState(moment());
  console.log("CurrentDate: " + CurrentDate.format('DD/MM/YYYY HH:mm:ss'));
  const [viewMode, setViewMode] = useState('month');

  const currentUserId = parseInt(localStorage.getItem("currentUserId"));
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    expressServer.getTodosByUser(currentUserId).then((response) => {
      if (response.status === 200) {
        setTodos(response.data);
      } else {
        console.log("Todos not retrieved");
      }
    }).catch((err) => {
      console.error(err);
    });
  }, [currentUserId]);

  const getTodosByDate = (date) => {
    const todosByDate = todos.filter((todo) => {
      const todoDate = moment(todo.begin_at);
      return todoDate.isSame(date, 'day');
    }
    );
    return todosByDate;
  };

  useEffect(() => {
    moment.locale('fr');
  }, []);

  const renderDaysOfWeek = () => {
    const daysOfWeek = moment.weekdays();
    daysOfWeek.push(daysOfWeek.shift());
    return daysOfWeek.map(day => (
      <div key={day} className="day-of-week">
        {day}
      </div>
    ));
  };

  const renderCalendarDays = () => {
    const startOfMonth = moment(CurrentDate).startOf(viewMode);
    const endOfMonth = moment(CurrentDate).endOf(viewMode);
    const startDate = moment(startOfMonth).startOf('week');
    const endDate = moment(endOfMonth).endOf('week');

    console.log("startOfMonth: " + startOfMonth.format('YYYY-MM-DD HH:mm:ss'));
    console.log("endOfMonth: " + endOfMonth.format('DD/MM/YYYY HH:mm:ss'));
    console.log("startDate: " + startDate.format('DD/MM/YYYY HH:mm:ss'));
    console.log("endDate: " + endDate.format('DD/MM/YYYY HH:mm:ss'));

    const daysDifference = endDate.diff(startDate, 'days') + 1;
    console.log("daysDifference: " + daysDifference);

    const today = moment().format('DD/MM/YYYY');
    console.log("today: " + today);

    const calendarDays = [];
    let currentDate = startDate;

    while (currentDate.isBefore(endDate)) {
      calendarDays.push(
        <div key={currentDate.toString()}
          className={
          `calendar-day
          ${viewMode === 'week' ? 'one-row' : daysDifference === 35 ? 'five-rows' : 'six-rows'}
          ${currentDate.isSame(CurrentDate, 'month') ? 'current-month' : 'other-month'}
          ${currentDate.format('DD/MM/YYYY') === today ? 'today' : ''}`}
        >
          <div className='day'>
            {currentDate.format('D')}
          </div>
          <div className="todos">
            {getTodosByDate(currentDate).map((todo) => (
              <div key={todo.id} className={`todo ${todo.status === 'done' ? 'done' : ''}`}>
                {todo.action}
              </div>
            ))}
          </div>
        </div>
      );
      currentDate.add(1, 'days');
    }

    return calendarDays;
  };

  const prevMonth = () => {
    setCurrentDate(moment(CurrentDate).subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentDate(moment(CurrentDate).add(1, 'month'));
  };

  const prevWeek = () => {
    setCurrentDate(moment(CurrentDate).subtract(1, 'week'));
  };

  const nextWeek = () => {
    setCurrentDate(moment(CurrentDate).add(1, 'week'));
  }

  const resetDate = () => {
    setCurrentDate(moment());
  }

  return (
    <div className="calendar-container">
      <div className="header">
        {
          viewMode === 'month' ? (
            <>
              <div className='big-header'>
                <div className='button' onClick={prevMonth}><IonIcon icon={caretBack} className="whiteIcon"/></div>
                <h2>{CurrentDate.format('MMMM YYYY').toUpperCase()}</h2>
                <div className='button' onClick={nextMonth}><IonIcon icon={caretForward} className="whiteIcon"/></div>
              </div>
              <div className='small-header'>
                <div className='button' onClick={resetDate}><IonIcon icon={todayOutline} className="whiteIcon"/></div>
                <div className='button' onClick={() => setViewMode('week')}><IonIcon icon={removeOutline} className="whiteIcon"/></div>
              </div>
            </>
          ) : (
            <>
              <div className='big-header'>
                <div className='button' onClick={prevWeek}><IonIcon icon={caretBack} className="whiteIcon"/></div>
                <h2>Week n°{CurrentDate.format('WW')}</h2>
                <div className='button' onClick={nextWeek}><IonIcon icon={caretForward} className="whiteIcon"/></div>
              </div>
              <div className='small-header'>
                <div className='button' onClick={resetDate}><IonIcon icon={todayOutline} className="whiteIcon"/></div>
                <div className='button' onClick={() => setViewMode('month')}><IonIcon icon={reorderThreeOutline} className="whiteIcon"/></div>
              </div>
            </>
          )
        }
      </div>
      <div className="days-of-week">{renderDaysOfWeek()}</div>
      <div className="calendar-days">{renderCalendarDays()}</div>
    </div>
  );
};

export default Calendar;
