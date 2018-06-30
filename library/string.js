/** @section @imports */
  import Arr from './array.js';

/** @section @exports */
/** string functions
  *
  */
  export default class Str {
  /** Проверка того, что объект строка @static
    * @param {any} value проверяемый объект
    * @return {boolean} результат проверки
    */
    static is(value) {
      return typeof value === 'string' || value instanceof String;
    }

  /** Предварительная обработка (очистка строки) русского текста @static
    * @param {string} string исходная строка
    * @return {string} очищенная строка
    */
    static cleanRU(string) {
      return (string || '').toLowerCase()
        .replace(/ё/g, 'е')
        // .replace(/й/g, 'и')
        .replace(/[^а-яa-z0-9%$₽€]/g, ' ')
        .replace(/[%$₽€]/g, match => ' ' + match + ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

  /** Создание строки определенной длины из паттерна @static
    * @param {number} length желаемая длина
    * @param {string} pattern заполнитель
    * @return {string} итоговая строка
    */
    static fill(length = 0, pattern = ' ') {
      if (length < 1) return '';
      if (length < pattern.length) return pattern.substr(0, length);
      if (length === pattern.length) return pattern;
      const base = Math.ceil(length / pattern.length);
      return Arr.fill(base, pattern).join('').substr(0, length);
    }

  /** Строка из случайных символов заданной длины @static
    * @param {number} length желаемая длина
    * @param {string} space пространство символов ииз которых генерировать строку
    * @return {string} сгенерированная строка
    */
    static random(length, space = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      let result = '';
      space = space.split('');
      for (let i = 0; i < length; ++i) {
        result += Arr.rand(space);
      }
      return result;
    }

  /** Возврат всех вхождений в строку
    * @param {string} input строка для проверки
    * @param {RegExp} regexp выражение для поиска вхождений
    * @return {object} {input: string, matches: array[{match, index}]}
    */
    static matchAll(input, regexp) {
      const matches = [];
      let match, index, last = 0;
      while (true) {
        match = input.substr(last).match(regexp);
        if (!match) break;
        index = match.index + last;
        match = match[0];
        matches.push({match, index});
        last = index + match.length;
      }
      return {
        input,
        matches
      };
    }
  }
