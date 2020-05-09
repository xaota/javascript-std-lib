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

  /** Предварительная обработка (очистка строки) русского текста @static @RU
    * @param {string} string исходная строка
    * @return {string} очищенная строка
    */
    static cleanRU(string) {
      return (string || '').toLowerCase()
        .replace(/й/g, 'й') // странная й из *.pdf-файлов (и + символ краткости)
        .replace(/ё/g, 'е')
        // .replace(/й/g, 'и')
        .replace(/[^а-яa-z0-9%$₽€]/g, ' ')
        .replace(/[%$₽€]/g, match => ' ' + match + ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

  /** Русская форма числительного / pluralize @static @RU
    * @param {number} count количество перечисляемых объектов
    * @param {string} one числительное при одном объекте
    * @param {string} two числительное при двух объектах
    * @param {string} five числительное при пяти объектах
    * @sample pluralize(32, ...['стол', 'стола', 'столов']) -> 'стола'
    * @return {string} форма числительного в зависимости от значения количества
    */
    static pluralizeRU(count, one, two, five) {
      const n = Math.abs(count) % 100, n1 = n % 10;
      if ((n > 20 || n < 10) && n1 > 1 && n1 < 5) return two;
      if (n !== 11 && n1 === 1) return one;
      return five;
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

  /** Отформатированная строка согласно заданному шаблону @static
    * Поддерживаются следующие спецификаторы: %s, %c, %f, %p %e, %o, %x, %X, %u, %d, %b.
    * @param {string} string шаблон
    * @param {array} args даныне для подстановки
    * @returns {string} Отформатированная строка
    * @example `'%s %s'.format('This is a string', 11) // => 'This is a string 11'`
    * @example `'Array: %s'.format(['12.3', 13.6]) // => 'Array: ["12.3",13.6]'`
    * @example `'Object: %s'.format({test: 'test', id: 12}) // => 'Object: {"test":"test","id":12}'`
    * @example `'%c'.format('Test') // => 'T'`
    * @example `'%b %b %b %b'.format('', 0, 1, 'test') // => 'false false true true'`
    * @example `'%5d'.format(12) // => '   12'`
    * @example `'%3u'.format(5) // => '  5'`
    * @example `'%05d'.format(12) // => '00012'`
    * @example `'%-5d'.format(12) // => '12   '`
    * @example `'%5.2d'.format(123) // => '  120'`
    * @example `'%5.2f'.format(1.1) // => ' 1.10'`
    * @example `'%10.2e'.format(1.1) // => '   1.10e+0'`
    * @example `'%5.3p'.format(1.12345) // => ' 1.12'`
    * @example `'%o'.format(12) // => '14'`
    * @example `'%5x'.format(45054) // => ' affe'`
    * @example `'%5X'.format(45054) // => ' AFFE'`
    * @example `'%20#2x'.format('45054') // => '    1010111111111110'`
    * @example `'%6#2d'.format('111') // => '     7'`
    * @example `'%6#16d'.format('affe') // => ' 45054'`
    */
    static format(string, ...args) {
      let i = 0;

      return string.replace(/%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scbfpeoxXud])/g, (exp, p0, p1, p2, p3, p4) => {
        if (exp === '%%') return '%';
        if (p4  === 'b')  return args[++i] ? 'true' : 'false';
        if (args[++i]) {
          const exp = p2 && parseInt(p2.substr(1));
          const base = p3 && parseInt(p3.substr(1));
          let val;
          switch (p4) {
            case 's':
              val = args[i];
              break;
            case 'c':
              val = args[i][0];
              break;
            case 'f':
              val = parseFloat(args[i]).toFixed(exp);
              break;
            case 'p':
              val = parseFloat(args[i]).toPrecision(exp);
              break;
            case 'e':
              val = parseFloat(args[i]).toExponential(exp);
              break;
            case 'o':
              val = parseInt(args[i]).toString(base || 8);
              break;
            case 'x':
            case 'X':
              val = parseInt(args[i]).toString(base || 16);
              if (p4 == 'X') val = val.toUpperCase();
              break;
            case 'u':
            case 'd':
              val = parseFloat(parseInt(args[i], base || 10).toPrecision(exp)).toFixed(0);
              break;
          }

          val = typeof val == 'object' ? JSON.stringify(val) : val.toString(base);
          const sz = parseInt(p1);
          const ch = p1 && p1[0] == '0' ? '0' : ' ';

          while (val.length < sz) val = p0 ? val + ch : ch + val;
          return val
        }
      });
    }
  }
