/** @section @imports */
  import Num from './number.js';

/** @section @internal */
  const week = {
    russian: ['воскресенье', 'понедельник', 'вторник', 'среда',     'четверг',  'пятница', 'суббота'],
    english: ['sunday',      'monday',      'tuesday', 'wednesday', 'thursday', 'friday',  'saturday']
  };

/** @section @exports */
/** {Momemt} работа с датой и временем @class
  *
  */
  export default class Moment {
  /** Является ли объект датой-временем / isDate @static @is
    * @param {any} value проверяемый объект
    * @return {boolean} true, если {any} === {Date}
    */
    static isDate(value) {
      return value instanceof Date;
    }

  /** Получение времени из числа милисекунд / time @static
    * @param {number} time число милисекунд
    * @return {string} строка вида mm:ss.msec
    */
    static time(time) {
      time = Math.round(time); // !
      const msec = time % 1000;
      const sec = Math.floor(time / 1000) % 60;
      const min = Math.floor(time / 1000 / 60) % 60;
      const hrs = Math.floor(time / 1000 / 60 / 60);
      return [Num.pad(hrs), Num.pad(min), Num.pad(sec)].join(':') + '.' + Num.pad(msec, 3);
    }

  /** Вывод даты / времени из исла милисекунд / stamp @static
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
      if (!Moment.isDate(start)) start = new Date(start);
      offset *= 24 * 60 * 60 * 1000;
      return new Date(start.valueOf() + offset);
    }

  /** Число дней между датами / getDaysCount @static
    * @param {Date} start начальная дата
    * @param {Date} finish конечная дата
    * @return {number} количество дней finish - start
    */
    static getDaysCount(start, finish) {
      if (!Moment.isDate(start))  start  = new Date(start);
      if (!Moment.isDate(finish)) finish = new Date(finish);
      return (finish.valueOf() - start.valueOf()) / 1000 / 24 / 60 / 60;
    }

  /** Список дней между датами / getDaysList @static
    * @param {Date} start начальная дата
    * @param {Date} finish конечная дата
    * @return {array} [...{from: Date, to: Date}] дни [start, finish)
    */
    static getDaysList(start, finish) {
      const length = Moment.getDaysCount(start, finish);
      return Array.from({length}, (_, index) => ({from: Moment.dateOffset(start, index), to: Moment.dateOffset(start, index + 1)}));
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
