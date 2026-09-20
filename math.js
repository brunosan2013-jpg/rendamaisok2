(function (root) {
  const MAX_MONTHS = 1200;
  const MAX_VALUE = 1e12;

  function annualToMonthly(rate) {
    return Math.pow(1 + rate, 1 / 12) - 1;
  }

  function monthlyToAnnual(rate) {
    return Math.pow(1 + rate, 12) - 1;
  }

  function getMonthlyRate(rate, ratePeriod) {
    return ratePeriod === 'year'
      ? annualToMonthly(rate)
      : rate;
  }

  function calculate(initial, contribution, rate, term, termPeriod, ratePeriod) {
    if (![initial, contribution, rate, term].every(Number.isFinite)) {
      throw new Error('Preencha todos os campos com valores válidos.');
    }

    if (initial < 0 || contribution < 0 || rate < 0 || term <= 0) {
      throw new Error('Use valores positivos e informe um prazo maior que zero.');
    }

    const months = termPeriod === 'year' ? term * 12 : term;

    if (
      !Number.isInteger(months) ||
      months > MAX_MONTHS ||
      initial > MAX_VALUE ||
      contribution > MAX_VALUE ||
      rate > 10
    ) {
      throw new Error('Informe valores dentro dos limites permitidos.');
    }

    const monthlyRate = getMonthlyRate(rate, ratePeriod);

    let balance = initial;
    let invested = initial;
    const evolution = [];

    for (let month = 1; month <= months; month++) {
      const beforeInterest = balance;
      const earnings = beforeInterest * monthlyRate;

      balance = beforeInterest + earnings + contribution;
      invested += contribution;

      if (
        !Number.isFinite(balance) ||
        balance > MAX_VALUE * 1e4
      ) {
        throw new Error(
          'O resultado ficou grande demais para uma simulação segura.'
        );
      }

      evolution.push({
        month,
        contribution,
        invested,
        periodEarnings: earnings,
        earnings: balance - invested,
        balance
      });
    }

    return {
      months,
      monthlyRate,
      evolution,
      final: balance,
      invested,
      earnings: balance - invested,
      returnRate: invested
        ? (balance - invested) / invested
        : 0
    };
  }

  /*
   * Calcula o aporte mensal necessário para atingir uma meta.
   *
   * Os aportes são considerados no final de cada mês,
   * seguindo a mesma lógica da calculadora principal.
   */
  function calculateRequiredContribution(
    target,
    initial,
    rate,
    term,
    termPeriod,
    ratePeriod
  ) {
    if (
      ![
        target,
        initial,
        rate,
        term
      ].every(Number.isFinite)
    ) {
      throw new Error('Preencha todos os campos da meta com valores válidos.');
    }

    if (target <= 0 || initial < 0 || rate < 0 || term <= 0) {
      throw new Error('Informe valores válidos para calcular a meta.');
    }

    const months = termPeriod === 'year'
      ? term * 12
      : term;

    if (
      !Number.isInteger(months) ||
      months > MAX_MONTHS ||
      target > MAX_VALUE ||
      initial > MAX_VALUE ||
      rate > 10
    ) {
      throw new Error('Informe valores dentro dos limites permitidos.');
    }

    const monthlyRate = getMonthlyRate(rate, ratePeriod);

    /*
     * Valor futuro do investimento inicial:
     *
     * VF = VP × (1 + i)^n
     */
    const futureInitial =
      initial * Math.pow(1 + monthlyRate, months);

    /*
     * Se o investimento inicial sozinho já atingir
     * a meta, nenhum aporte mensal adicional é necessário.
     */
    if (futureInitial >= target) {
      return {
        target,
        initial,
        monthlyContribution: 0,
        months,
        monthlyRate,
        projectedFinal: futureInitial,
        totalInvested: initial,
        totalEarnings: futureInitial - initial
      };
    }

    let monthlyContribution;

    /*
     * Quando a taxa é zero:
     *
     * aporte = (meta - inicial) / meses
     */
    if (monthlyRate === 0) {
      monthlyContribution =
        (target - initial) / months;
    } else {
      /*
       * Fórmula do valor futuro de uma série de aportes:
       *
       * VF = aporte × [((1+i)^n - 1) / i]
       *
       * Isolando o aporte:
       */
      const factor =
        (Math.pow(1 + monthlyRate, months) - 1) /
        monthlyRate;

      monthlyContribution =
        (target - futureInitial) / factor;
    }

    if (
      !Number.isFinite(monthlyContribution) ||
      monthlyContribution < 0 ||
      monthlyContribution > MAX_VALUE
    ) {
      throw new Error(
        'Não foi possível calcular um aporte mensal seguro para essa meta.'
      );
    }

    const totalInvested =
      initial + monthlyContribution * months;

    const projectedFinal =
      futureInitial +
      monthlyContribution *
        (
          monthlyRate === 0
            ? months
            : (Math.pow(1 + monthlyRate, months) - 1) /
              monthlyRate
        );

    return {
      target,
      initial,
      monthlyContribution,
      months,
      monthlyRate,
      projectedFinal,
      totalInvested,
      totalEarnings: projectedFinal - totalInvested
    };
  }

  const api = {
    annualToMonthly,
    monthlyToAnnual,
    calculate,
    calculateRequiredContribution
  };

  if (
    typeof module !== 'undefined' &&
    module.exports
  ) {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.CalculatorMath = api;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.CalculatorMath = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
