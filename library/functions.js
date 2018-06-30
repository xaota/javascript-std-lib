/** @section @exports */
/** */
  export default class Fn {
    /** Оператор функционального матчинга @static
    * @param {any} args матчевые переменные
    * @return {function} @closure
    * @usage matches(args)(...cases)(), cases = array of [function:boolean, function:handler]
    */
    static matches(...args) {
      return (...cases) => {
        cases = cases
          .filter(c => c[0](...args))
          .map(c => c[1]);
        return (nothing = _ => undefined) =>
          cases.length > 0
            ? cases[0]
            : nothing;
      }
    }

  /** Повтор функции через равные промежутки времени (после окончания)
    * @param {Function} fn "зацикливаемая" функция
    * @param {number} delay время между запусками (в мс)
    * @param {object} context контекст запуска
    * @return {object} {start(), stop()} управление функцией
    */
    static repeatAwait(fn, delay, context = null) {
      let flag = false;
      let timer;
      return {
      /** */
        start() {
          flag = false;
          f();
        },
      /** */
        stop() {
          flag = true;
          clearTimeout(timer);
        }
      };

    /** */
      async function f() {
        if (timer) clearTimeout(timer);
        await fn.apply(context);
        if (flag === true) return;
        timer = setTimeout(f, delay);
      }
    }
  }
