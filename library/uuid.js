/** Генерация UUID @unsafe
  * @param {string} prefix префикс, если нужен
  * @return {string} uuid
  */
  export default function uuid(prefix = '') {
    return prefix + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

// #region [Private]
/** */
  function s4() {
    const number = (1 + Math.random()) * 0x10000;
    return Math
      .floor(number)
      .toString(16)
      .substring(1);
  }
// #endregion
