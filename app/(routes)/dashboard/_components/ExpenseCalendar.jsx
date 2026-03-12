"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function ExpenseCalendar({ expensesList }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
  const filteredExpenses = expensesList.filter(
    (item) => item.createdAt === formatDate(selectedDate)
  );
  const dailyTotal = filteredExpenses.reduce(
  (sum, item) => sum + Number(item.amount),
  0
);

  return (
    <div className="border rounded-xl p-5">
      <h2 className="font-bold text-lg mb-3">Daily Expense Calendar</h2>

      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <div className="mt-4">
        <h3 className="font-medium">
          Expenses on {formatDate(selectedDate)}
        </h3>

        {filteredExpenses.length > 0 ? (
  <div>
    {filteredExpenses.map((expense) => (
      <div
        key={expense.id}
        className="flex justify-between border-b py-1"
      >
        <span>{expense.name}</span>
        <span>₹{expense.amount}</span>
      </div>
    ))}

    <div className="flex justify-between font-bold mt-3 border-t pt-2">
      <span>Total</span>
      <span>₹{dailyTotal}</span>
    </div>
  </div>
) : (
  <p className="text-gray-400">No expenses for this day</p>
)}
      </div>
    </div>
  );
}

export default ExpenseCalendar;