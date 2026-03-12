const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  try {

    const savings = totalIncome - totalSpend;

    // Prevent divide-by-zero
    const expenseRatio = totalIncome > 0 ? totalSpend / totalIncome : 0;

    // Financial status logic
    let status = "safe";
    let alert = "🟢 Your spending is healthy and well within your income.";

    if (expenseRatio >= 1) {
      status = "danger";
      alert = "🔴 Alert: Your expenses are higher than your income!";
    } 
    else if (expenseRatio >= 0.7) {
      status = "warning";
      alert = "🟡 Warning: Your expenses are getting close to your income.";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },

      body: JSON.stringify({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: "You are a simple and practical financial advisor."
          },
          {
            role: "user",
            content: `
User Financial Data:

Total Budget: ₹${totalBudget}
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalSpend}
Savings: ₹${savings}

Instructions:
- Give ONLY 1 or 2 very short sentences.
Do not explain too much.
Keep advice simple like a finance app notification..
- If expenses are below 50% of income, say spending is healthy.
- If expenses are between 50% and 80%, suggest controlling spending.
- If expenses exceed income, strongly warn the user.
- Suggest saving or investing if savings exist.
`
          }
        ],

        temperature: 0.6,
        max_tokens: 100
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return {
        advice: "AI advice unavailable right now.",
        status,
        alert
      };
    }

    return {
      advice: data.choices[0].message.content.trim(),
      status,
      alert
    };

  } catch (error) {

    console.error("Fetch error:", error);

    return {
      advice: "Unable to generate advice right now.",
      status: "warning",
      alert: "🟡 AI service temporarily unavailable."
    };
  }
};

export default getFinancialAdvice;