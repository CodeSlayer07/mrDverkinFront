import React, { useState } from "react";

export const CustomCalendar = ({ availabilityList, fetchedAvailability, setSelectedDate, selectedDate, onDateSelected }) => {
    const today = new Date();
    const [currentYearMonth, setCurrentYearMonth] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    // Вычисляем количество дней в текущем месяце
    const daysInMonth = new Date(currentYearMonth.year, currentYearMonth.month + 1, 0).getDate();
    // Определяем первый день недели для текущего месяца
    const firstDayOfWeek = (new Date(currentYearMonth.year, currentYearMonth.month, 1).getDay() || 7) % 7;

    // Создаём карту доступности для быстрого доступа к данным
    const availabilityMap = {};
    // Используем fetchedAvailability, если он предоставлен и является массивом, иначе используем availabilityList
    const dataSource = Array.isArray(fetchedAvailability) && fetchedAvailability.length > 0 ? fetchedAvailability : (availabilityList || []);
    dataSource.forEach(day => {
        if (day && day.date) {
            availabilityMap[day.date] = {
                frontDoorQuantity: day.frontDoorQuantity || 0,
                inDoorQuantity: day.inDoorQuantity || 0,
            };
        }
    });



    // Переход к предыдущему месяцу
    const handlePrevMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 0 ? prev.year - 1 : prev.year,
            month: prev.month === 0 ? 11 : prev.month - 1,
        }));
    };

    // Переход к следующему месяцу
    const handleNextMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 11 ? prev.year + 1 : prev.year,
            month: prev.month === 11 ? 0 : prev.month + 1,
        }));
    };

    // Рендеринг дней календаря
    const renderDays = () => {
        const weeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
        const days = [];
        let day = 1;
        const todayStr = formatLocalDate(today);

        for (let week = 0; week < weeks; week++) {
            const weekDays = [];
            for (let dow = 0; dow < 7; dow++) {
                const index = week * 7 + dow;
                if (index < firstDayOfWeek || day > daysInMonth) {
                    weekDays.push(<div key={`empty-${index}`} className="calendar-day empty" />);
                } else {
                    const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
                    const dateStr = formatLocalDate(date);
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === todayStr;
                    const isPast = date < today && !isToday;
                    const availability = availabilityMap[dateStr];

                    weekDays.push(
                        <div
                            key={dateStr}
                            className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                            onClick={isPast || !setSelectedDate ? undefined : () => onDateSelected(dateStr)}
                        >
                            <div className="day-number">{day}</div>
                            {availability && (
                                <div className={`availability ${isPast ? 'past' : ''}`}>
                                    <span>В: {availability.frontDoorQuantity}</span>
                                    <span>М: {availability.inDoorQuantity}</span>
                                </div>
                            )}
                        </div>
                    );
                    day++;
                }
            }
            days.push(<div key={`week-${week}`} className="calendar-week">{weekDays}</div>);
        }
        return days;
    };

    // Форматирование даты в формат YYYY-MM-DD с учётом локального часового пояса
    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <span onClick={handlePrevMonth} className="nav-arrow">{'<'}</span>
                <span>{`${monthNames[currentYearMonth.month]} ${currentYearMonth.year}`}</span>
                <span onClick={handleNextMonth} className="nav-arrow">{'>'}</span>
            </div>
            <div className="calendar-weekdays">
                {dayNames.map((day, index) => (
                    <div key={index} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-days">{renderDays()}</div>
        </div>
    );
};