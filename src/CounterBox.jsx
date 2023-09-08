import React, { useState, useEffect } from 'react';
import './CounterBox.css';

function CounterBox({ records }) {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const incomeTotal = records
      .filter((record) => record.type === 'entrada')
      .reduce((total, record) => total + parseFloat(record.value), 0);

    const expensesTotal = records
      .filter((record) => record.type === 'saída')
      .reduce((total, record) => total + parseFloat(record.value), 0);

    const totalAmount = incomeTotal - expensesTotal;

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotal(totalAmount);
  }, [records]);

  return (
    <div className="counter-box">
      <div className="counter-card">
        <h2>Entradas</h2>
        <p>R$ {income.toFixed(2)}</p>
      </div>
      <div className="counter-card">
        <h2>Saídas</h2>
        <p>R$ {expenses.toFixed(2)}</p>
      </div>
      <div className="counter-card">
        <h2>Total</h2>
        <p>R$ {total.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default CounterBox;
