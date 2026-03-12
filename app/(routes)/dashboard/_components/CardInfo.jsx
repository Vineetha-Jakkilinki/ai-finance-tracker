import getFinancialAdvice from "@/utils/getFinancialAdvice";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
  Landmark
} from "lucide-react";
import React, { useEffect, useState } from "react";

// Indian Rupee Formatter
const formatINR = (amount) => {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

function CardInfo({ budgetList, incomeList }) {

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const savings = totalIncome - totalSpend;

  const [financialAdvice, setFinancialAdvice] = useState("");
  const [status, setStatus] = useState("");
  const [alert, setAlert] = useState("");

  // ⭐ NEW STATES
  const [healthScore, setHealthScore] = useState(0);
  const [healthStatus, setHealthStatus] = useState("");
  
  // Calculate totals
  useEffect(() => {
    if (budgetList?.length > 0 || incomeList?.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  // Fetch AI Advice ONLY when income exists
  useEffect(() => {

    if (totalIncome > 0) {

      const fetchFinancialAdvice = async () => {

        const result = await getFinancialAdvice(
          totalBudget,
          totalIncome,
          totalSpend
        );

        setFinancialAdvice(result.advice);
        setStatus(result.status);
        setAlert(result.alert);
      };

      fetchFinancialAdvice();
    }

  }, [totalBudget, totalIncome, totalSpend]);

  // ⭐ Financial Health Score Logic
  const calculateHealthScore = (income, spend) => {

    if (income === 0) return;

    const ratio = spend / income;

    let score = 0;
    let status = "";

    if (ratio < 0.3) {
      score = 90;
      status = "🟢 Excellent";
    } 
    else if (ratio < 0.5) {
      score = 80;
      status = "🟢 Good";
    } 
    else if (ratio < 0.7) {
      score = 65;
      status = "🟡 Moderate";
    } 
    else if (ratio < 1) {
      score = 50;
      status = "🟠 Risky";
    } 
    else {
      score = 30;
      status = "🔴 Dangerous";
    }

    setHealthScore(score);
    setHealthStatus(status);
  };

  const CalculateCardInfo = () => {

    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    budgetList?.forEach((element) => {
      totalBudget_ += Number(element.amount);
      totalSpend_ += Number(element.totalSpend);
    });

    incomeList?.forEach((income) => {
      totalIncome_ += Number(income.amount);
    });

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    setTotalIncome(totalIncome_);

    // ⭐ Calculate health score
    calculateHealthScore(totalIncome_, totalSpend_);
  };

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>

          {/* AI CARD */}

          <div className="p-7 border mt-4 -mb-1 rounded-2xl">

            <div className="flex mb-2 flex-row space-x-1 items-center">
              <h2 className="text-md">FinanceAI</h2>
              <Sparkles className="rounded-full text-white w-10 h-10 p-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"/>
            </div>

            {alert && (
              <div
                className={`p-3 rounded-lg mb-2 ${
                  status === "safe"
                    ? "bg-green-100 text-green-700"
                    : status === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {alert}
              </div>
            )}

            <p className="font-light text-md">
              {financialAdvice || "Generating AI financial advice..."}
            </p>

          </div>


          {/* DASHBOARD CARDS */}

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">{formatINR(totalBudget)}</h2>
              </div>
              <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>

            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Spend</h2>
                <h2 className="font-bold text-2xl">{formatINR(totalSpend)}</h2>
              </div>
              <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>

            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
              </div>
              <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>

            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Sum of Income Streams</h2>
                <h2 className="font-bold text-2xl">{formatINR(totalIncome)}</h2>
              </div>
              <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>

            <div className="p-7 border rounded-2xl flex items-center justify-between">
          <div>
             <h2 className="text-sm">Savings</h2>
             <h2 className="font-bold text-2xl">
              {formatINR(savings)}
           </h2>
            </div>

  <Landmark className="bg-green-600 p-3 h-12 w-12 rounded-full text-white" />
</div>

            {/* ⭐ NEW HEALTH SCORE CARD */}

            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Financial Health Score</h2>
                <h2 className="font-bold text-2xl">{healthScore} / 100</h2>
                <p className="text-sm">{healthStatus}</p>
              </div>
              <CircleDollarSign className="bg-green-700 p-3 h-12 w-12 rounded-full text-white" />
            </div>

          </div>

        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;