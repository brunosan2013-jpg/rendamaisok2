const assert = require('node:assert/strict');
const {annualToMonthly, monthlyToAnnual, calculate} = require('./math.js');
const close = (a,b,epsilon=1e-9) => assert.ok(Math.abs(a-b)<epsilon, `${a} != ${b}`);
close(annualToMonthly(.12), Math.pow(1.12,1/12)-1); close(monthlyToAnnual(.01), Math.pow(1.01,12)-1);
let r=calculate({initial:1000,contribution:0,rate:.01,ratePeriod:'month',term:12,termPeriod:'month'});close(r.final,1000*Math.pow(1.01,12));
r=calculate({initial:1000,contribution:500,rate:.01,ratePeriod:'month',term:12,termPeriod:'month'});close(r.final,1000*Math.pow(1.01,12)+500*(Math.pow(1.01,12)-1)/.01);
r=calculate({initial:0,contribution:0,rate:.12,ratePeriod:'year',term:1,termPeriod:'year'});assert.equal(r.final,0);assert.equal(r.months,12);
assert.throws(()=>calculate({initial:-1,contribution:0,rate:0,ratePeriod:'month',term:1,termPeriod:'month'}));console.log('✓ Todos os 5 testes matemáticos passaram.');
