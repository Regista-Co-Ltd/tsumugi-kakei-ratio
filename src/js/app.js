// 暮らしのノート: 選んだ世帯状況を出発点に、手取り収入の配分目安をブラウザ内だけで計算する。
(() => {
  "use strict";

  const baseRules = [
    { label: "住居費", detail: "家賃・住宅ローン", color: "#d97161", icon: "⌂" },
    { label: "食費", detail: "食材・外食", color: "#e7a85a", icon: "♨" },
    { label: "水道光熱費", detail: "電気・ガス・水道", color: "#91b8c3", icon: "☼" },
    { label: "通信費", detail: "スマホ・ネット", color: "#8ca59b", icon: "▥" },
    { label: "保険", detail: "医療・生命・損害", color: "#a99abc", icon: "♡" },
    { label: "日用品", detail: "消耗品・雑貨", color: "#d6a68c", icon: "◌" },
    { label: "教育費", detail: "保育・習い事・学び", color: "#c9919d", icon: "✎" },
    { label: "交通費", detail: "電車・ガソリン", color: "#8fa5cd", icon: "→" },
    { label: "娯楽・交際費", detail: "レジャー・楽しみ", color: "#d1b465", icon: "✦" },
    { label: "貯蓄・投資", detail: "将来のための積立", color: "#6c9d8d", icon: "♧" }
  ];

  const householdProfiles = {
    single: { label: "一人暮らし", ratios: [30, 15, 6, 6, 5, 4, 2, 7, 10, 15] },
    couple: { label: "二人暮らし", ratios: [28, 15, 6, 5, 6, 4, 2, 5, 8, 21] },
    "family-young": { label: "子育て世帯（小学生以下）", ratios: [25, 16, 6, 5, 6, 4, 8, 4, 4, 22] },
    "family-school": { label: "子育て世帯（中高生以上）", ratios: [25, 16, 6, 5, 7, 4, 13, 4, 3, 17] },
    "multi-generation": { label: "実家暮らし・二世帯", ratios: [22, 18, 8, 5, 8, 5, 6, 5, 3, 20] }
  };

  const yen = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 });
  const input = document.querySelector("#income");
  const household = document.querySelector("#household");
  const list = document.querySelector("#budget-list");
  const donut = document.querySelector("#donut");
  const resultIncome = document.querySelector("#result-income");
  const resultIncomeTitle = document.querySelector("#result-income-title");
  const error = document.querySelector("#income-error");
  const resultStatus = document.querySelector("#result-status");

  const incomeValue = () => Number(String(input.value).replace(/[^0-9]/g, "")) || 0;
  const activeProfile = () => householdProfiles[household.value] || householdProfiles["family-young"];
  const activeRules = () => baseRules.map((rule, index) => ({ ...rule, ratio: activeProfile().ratios[index] }));

  const chartGradient = (rules) => rules.reduce((segments, rule, index) => {
    const start = rules.slice(0, index).reduce((total, item) => total + item.ratio, 0);
    segments.push(`${rule.color} ${start}% ${start + rule.ratio}%`);
    return segments;
  }, []).join(", ");

  function allocateAmounts(income, rules) {
    const roundedAmounts = rules.slice(0, -1).map((rule) => Math.round(income * rule.ratio / 100));
    const allocatedTotal = roundedAmounts.reduce((total, amount) => total + amount, 0);
    return [...roundedAmounts, income - allocatedTotal];
  }

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
    const rules = activeRules();
    const profile = activeProfile();
    donut.style.background = `conic-gradient(${chartGradient(rules)})`;
    resultIncome.textContent = `¥${yen.format(income)}`;
    resultIncomeTitle.textContent = `${yen.format(income)}円`;
    const amounts = allocateAmounts(income, rules);
    list.replaceChildren(...rules.map((rule, index) => createRow(rule, amounts[index])));
    resultStatus.textContent = `${profile.label}の目安で計算しました。お金の行き先を確認してみましょう。`;
    resultStatus.classList.add("is-active");

    if (scroll) document.querySelector("#result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelector("#calculate").addEventListener("click", () => render({ scroll: true }));
  document.querySelector("#reset").addEventListener("click", () => { input.value = "300000"; render(); });
  household.addEventListener("change", () => render());
  input.addEventListener("input", () => { error.hidden = incomeValue() > 0; });
  input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); render({ scroll: true }); } });
  render();
})();
