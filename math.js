(function (root) {
  const MAX_MONTHS = 1200, MAX_VALUE = 1e12;
  function annualToMonthly(rate) { return Math.pow(1 + rate, 1 / 12) - 1; }
  function monthlyToAnnual(rate) { return Math.pow(1 + rate, 12) - 1; }
  function calculate({initial, contribution, rate, ratePeriod, term, termPeriod}) {
    if (![initial, contribution, rate, term].every(Number.isFinite)) throw new Error('Preencha todos os campos com valores válidos.');
    if (initial < 0 || contribution < 0 || rate < 0 || term <= 0) throw new Error('Use valores positivos e informe um prazo maior que zero.');
    const months = termPeriod === 'year' ? term * 12 : term;
    if (!Number.isInteger(months) || months > MAX_MONTHS || initial > MAX_VALUE || contribution > MAX_VALUE || rate > 10) throw new Error('Informe valores dentro dos limites permitidos para a simulação.');
    const monthlyRate = ratePeriod === 'year' ? annualToMonthly(rate) : rate;
    const evolution = []; let balance = initial, invested = initial;
    for (let month = 1; month <= months; month++) {
      const beforeInterest = balance, earnings = beforeInterest * monthlyRate;
      balance = beforeInterest + earnings + contribution; invested += contribution;
      if (!Number.isFinite(balance) || balance > MAX_VALUE * 1e4) throw new Error('O resultado ficou grande demais para uma simulação segura.');
      evolution.push({month, contribution, invested, periodEarnings: earnings, earnings: balance - invested, balance});
    }
    return {months, monthlyRate, evolution, final: balance, invested, earnings: balance - invested, returnRate: invested ? (balance - invested) / invested : 0};
  }
  const api = { annualToMonthly, monthlyToAnnual, calculate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.CalculatorMath = api;
})(typeof window !== 'undefined' ? window : globalThis);
