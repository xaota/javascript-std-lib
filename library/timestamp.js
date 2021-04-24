/** @section @imports */
  import Num from './number.js';

/** @section @internal */
  const week = {
    russian: ['воскресенье', 'понедельник', 'вторник', 'среда',     'четверг',  'пятница', 'суббота'],
    english: ['sunday',      'monday',      'tuesday', 'wednesday', 'thursday', 'friday',  'saturday']
  };

/** @section @exports */
/** {Timestamp} работа с датой и временем @class
  *
  */
  export default class Timestamp {
  /** Является ли объект датой-временем / isDate @static @is
    * @param {any} value проверяемый объект
    * @return {boolean} true, если {any} === {Date}
    */
    static is(value) {
      return value instanceof Date;
    }

  /** Переводит объект даты-времени в короткую строку / short
    * @param {Date} timestamp дата-время
    * @return {string} короткое строковое представление временной метки
    */
    static short(timestamp) {
      return new Date(timestamp).toISOString().replace(/:\d{2}\.\d{3}Z/, '').replace('T', ' ').replace(/^\d{4}-/, '').replace('-', '.');
    }

  /** Получение времени из числа милисекунд / time @static
    * @param {number} time число милисекунд
    * @return {string} строка вида hh:mm:ss.msec
    */
    static time(time) {
      time = Math.round(time); // !
      const msec = time % 1000;
      const sec = Math.floor(time / 1000) % 60;
      const min = Math.floor(time / 1000 / 60) % 60;
      const hrs = Math.floor(time / 1000 / 60 / 60);
      return [Num.pad(hrs), Num.pad(min), Num.pad(sec)].join(':') + '.' + Num.pad(msec, 3);
    }

  /** Вывод даты / времени из числа милисекунд / stamp @static
    * @param {number} time число милисекунд
    * @return {string} строка вида yyyy-mm-dd hh:mm:ss.msec
    */
    static stamp(time) {
      const  value = new Date(time);
      const   msec = value.getMilliseconds();
      const    sec = value.getSeconds();
      const    min = value.getMinutes();
      const   hour = value.getHours();
      const   date = value.getDate();
      const  month = value.getMonth();
      const   year = value.getFullYear();
      const    day = value.getDay();
      const offset = value.getTimezoneOffset();

      const stamp = {
        date: [year, Num.pad(month + 1), Num.pad(date)].join('-'),
        time: [Num.pad(hour), Num.pad(min), Num.pad(sec) + '.' + Num.pad(msec, 3)].join(':'),
        info: {
          day   : ['вск', 'пн', 'вт', 'ср', 'чт', 'пт', 'сбт'][day],
          offset: (Math.sign(offset) === 1 ? '' : '-') + Num.pad(Math.abs(offset / 60)) + ':' + Num.pad(Math.abs(offset % 60))
        }
      }
      return [stamp.info.day, stamp.date, stamp.time, '(' + stamp.info.offset + ')'].join(' ');
    }

  /** Дата в простом виде / date @static
    * @param {Date} date дата
    * @return {string} "yyyy-mm-dd"
    */
    static date(date) {
      return [
        date.getFullYear(),
        Num.pad(date.getMonth() + 1),
        Num.pad(date.getDate())
      ].join('-');
    }

  /** Дата со смещением в offset дней от исходной / dateOffset @static
    * @param {Date} start исходная дата
    * @param {number} offset смещение в днях
    * @return {Date} итоговая дата
    */
    static dateOffset(start, offset) {
      if (!Timestamp.is(start)) start = new Date(start);
      offset *= 24 * 60 * 60 * 1000;
      return new Date(start.valueOf() + offset);
    }

  /** Число дней между датами / getDaysCount @static
    * @param {Date} start начальная дата
    * @param {Date} finish конечная дата
    * @return {number} количество дней finish - start
    */
    static getDaysCount(start, finish) {
      if (!Timestamp.is(start))  start  = new Date(start);
      if (!Timestamp.is(finish)) finish = new Date(finish);
      return (finish.valueOf() - start.valueOf()) / 1000 / 24 / 60 / 60;
    }

  /** Список дней между датами / getDaysList @static
    * @param {Date} start начальная дата
    * @param {Date} finish конечная дата
    * @return {array} [...{from: Date, to: Date}] дни [start, finish)
    */
    static getDaysList(start, finish) {
      const length = Timestamp.getDaysCount(start, finish);
      return Array.from({ length }, (_, index) => ({ from: Timestamp.dateOffset(start, index), to: Timestamp.dateOffset(start, index + 1) }));
    }

  /** Название дня недели по номеру / dayOfWeek @static
    * @param {byte} index [0..6] номер дня недели
    * @param {string} language ['russian', 'english'] язык
    * @return {string} название дня недели
    */
    static dayOfWeek(index = 0, language = 'russian') {
      return week[language][index];
    }

  /** Список дней недели / week @static
    * @param {string} language ['russian', 'english'] язык
    * @return {array} {...string} список названий дней недели
    */
    static week(language = 'russian') {
      return week[language];
    }
  }

/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

/** Takes an ISO time and returns a string representing how long ago the date represents.
 */
  export function prettyDate(time) {
    const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
      const diff = (((new Date()).getTime() - date.getTime()) / 1000);
      const dayDiff = Math.floor(diff / 86400);

    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) return;

    return dayDiff === 0 && (
      diff < 60 && 'just now' ||
      diff < 120 && '1 minute ago' ||
      diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
      diff < 7200 && '1 hour ago' ||
      diff < 86400 && Math.floor(diff / 3600) + ' hours ago'
    ) ||
      dayDiff === 1 && 'Yesterday' ||
      dayDiff < 7 && dayDiff + ' days ago' ||
      dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago';
  }
