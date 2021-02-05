export default class Emoji {
  /** emoji флаг из кода страны @static
   * @param {string} countryCode код страны, например, "RU, UK, DE, FR"
   * @return {string} emoji флага страны
   */
  static flag(countryCode) {
    const zero = "a".charCodeAt(0);
    const base = 0x1f1e6; // emoji "A"
    return countryCode
      .toLowerCase()
      .split('')
      .map(c => String.fromCodePoint(base + c.charCodeAt(0) - zero))
      .join('')
  }
}
