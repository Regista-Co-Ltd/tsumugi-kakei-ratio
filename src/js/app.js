(() => {
  "use strict";

  const rules = [
    { label: "住居費", detail: "家賃・住宅ローン", ratio: 25, color: "#d97161", icon: "⌂" },
    { label: "食費", detail: "食材・外食", ratio: 15, color: "#e7a85a", icon: "♨" },
    { label: "水道光熱費", detail: "電気・ガス・水道", ratio: 6, color: "#91b8c3", icon: "☼" },
    { label: "通信費", detail: "スマホ・ネット", ratio: 5, color: "#8ca59b", icon: "▥" },
    { label: "保険", detail: "医療・生命・損害", ratio: 4, color: "#a99abc", icon: "♡" },
    { label: "日用品", detail: "消耗品・雑貨", ratio: 3, color: "#d6a68c", icon: "◌" },
    { label: "教育費", detail: "保育・習い事・学び", ratio: 10, color: "#c9919d", icon: "✎" },
    { label: "交通費", detail: "電車・ガソリン", ratio: 4, color: "#8fa5cd", icon: "→" },
    { label: "娯楽・交際費", detail: "レジャー・楽しみ", ratio: 4, color: "#d1b465", icon: "✦" },
    { label: "貯蓄・投資", detail: "将来のための積立", ratio: 24, color: "#6c9d8d", icon: "♧" }
  ];

  const yen = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 });
  const input = document.querySelector("#income");
  const list = document.querySelector("#budget-list");
  const donut = document.querySelector("#donut");
  const resultIncome = document.querySelector("#result-income");
  const resultIncomeTitle = document.querySelector("#result-income-title");
  const error = document.querySelector("#income-error");
  const resultStatus = document.querySelector("#result-status");

  const incomeValue = () => Number(String(input.value).replace(/[^0-9]/g, "")) || 0;

  const chartGradient = rules.reduce((segments, rule, index) => {
    const start = rules.slice(0, index).reduce((total, item) => total + item.ratio, 0);
    segments.push(`${rule.color} ${start}% ${start + rule.ratio}%`);
    return segments;
  }, []).join(", ");

  function createRow(rule, amount) {
    const row = document.createElement("article");
    row.className = "budget-row";
    row.style.setProperty("--rule-color", rule.color);
    row.innerHTML = `<span class="budget-row__icon" style="color:${rule.color};background:${rule.color}20">${rule.icon}</span><div><h3>${rule.label}<span>${rule.ratio}%</span></h3><p>${rule.detail}</p></div><strong>¥${yen.format(Math.round(amount))}</strong>`;
    return row;
  }

  function render({ scroll = false } = {}) {
    const income = incomeValue();
    error.hidden = income > 0;
    if (!income) return;

    input.value = String(income);
    donut.style.background = `conic-gradient(${chartGradient})`;
    resultIncome.textContent = `¥${yen.format(income)}`;
    resultIncomeTitle.textContent = `${yen.format(income)}円`;
    list.replaceChildren(...rules.map((rule) => createRow(rule, income * rule.ratio / 100)));
    resultStatus.textContent = "計算しました。お金の行き先を確認してみましょう。";
    resultStatus.classList.add("is-active");

    if (scroll) document.querySelector("#result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelector("#calculate").addEventListener("click", () => render({ scroll: true }));
  document.querySelector("#reset").addEventListener("click", () => { input.value = "300000"; render(); });
  input.addEventListener("input", () => { error.hidden = incomeValue() > 0; });
  input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); render({ scroll: true }); } });
  render();
})();
