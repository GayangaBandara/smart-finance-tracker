const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

let rates = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const fetchExchangeRates = async () => {
  const now = Date.now();
  if (rates && now - lastFetch < CACHE_DURATION) {
    return rates;
  }

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    rates = data.rates;
    lastFetch = now;
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback rates if API fails
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      // Add more fallbacks
    };
  }
};

export const convertAmount = async (amount, fromCurrency = 'USD', toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  const rates = await fetchExchangeRates();
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  return (amount / fromRate) * toRate;
};

export const formatCurrency = (amount, currency) => {
  const numAmount = parseFloat(amount) || 0;
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: '$',
    AUD: '$',
    CHF: 'Fr',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    LKR: 'Rs',
    BRL: 'R$',
    MXN: '$',
    RUB: '₽',
    ZAR: 'R',
    SGD: '$',
    HKD: '$',
    NZD: '$',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    TRY: '₺',
    THB: '฿',
    MYR: 'RM',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    CZK: 'Kč',
    HUF: 'Ft',
    ILS: '₪',
    EGP: '£',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    UYU: '$',
    PYG: '₲',
    BOB: 'Bs',
    VES: 'Bs',
    CRC: '₡',
    GTQ: 'Q',
    HNL: 'L',
    NIO: 'C$',
    SVC: '$',
    PAB: 'B/.',
    DOP: 'RD$',
    JMD: 'J$',
    TTD: 'TT$',
    BBD: 'Bds$',
    BSD: '$',
    KYD: '$',
    XCD: '$',
    ANG: 'ƒ',
    AWG: 'ƒ',
    BMD: '$',
    BTN: 'Nu.',
    GEL: '₾',
    ISK: 'kr',
    KZT: '₸',
    LAK: '₭',
    MKD: 'ден',
    MNT: '₮',
    NPR: '₨',
    RON: 'lei',
    RSD: 'дин',
    SCR: '₨',
    TWD: 'NT$',
    UAH: '₴',
    UZS: "so'm",
    VUV: 'VT',
    WST: 'WS$',
    XAF: 'FCFA',
    XOF: 'CFA',
    XPF: '₣',
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${numAmount.toFixed(2)}`;
};
