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
    single: {
      label: "ひとりで暮らす",
      hint: "住まい・食事・自分時間を大切にしながら、先取りも続ける目安です。",
      summary: "住居費と日々の楽しみを確保しながら、先取り貯蓄を続ける配分です。",
      tipTitle: "今月の整えポイント",
      tipMessage: "住居費が手取りの3割を超えるなら、通信費や定額サービスも一緒に見直してみて。",
      tipDetail: "貯蓄・投資は16%を目安に。収入が増えた月は、その一部を先取りへ回すと続けやすくなります。",
      ratios: [28, 17, 6, 5, 5, 4, 2, 7, 10, 16]
    },
    couple: {
      label: "ふたりで暮らす",
      hint: "共通の生活費と、それぞれの楽しみを無理なく両立する目安です。",
      summary: "共通の暮らし費を抑え、ふたりの将来に向けた積み立てを少し厚めにする配分です。",
      tipTitle: "ふたりの家計メモ",
      tipMessage: "共有する費用と、それぞれが自由に使うお金を分けると、話し合いがぐっと楽になります。",
      tipDetail: "貯蓄・投資は22%を目安に。目的別に口座や積立を分けると、続けやすくなります。",
      ratios: [26, 16, 6, 5, 6, 4, 2, 5, 8, 22]
    },
    "family-young": {
      label: "子どもと暮らす｜未就学〜小学生",
      hint: "食費・日用品と、保育や学びの準備を両立する目安です。",
      summary: "日々の生活費と、これからの学びの準備を両立しながら先取りを続ける配分です。",
      tipTitle: "子育て期の家計メモ",
      tipMessage: "教育費は「今月使う分」と「これからのために積む分」を分けて考えるのがおすすめです。",
      tipDetail: "貯蓄・投資は21%を目安に。季節行事や習い事の費用は、年単位でも見通しを立ててみてください。",
      ratios: [25, 16, 6, 5, 6, 6, 7, 4, 4, 21]
    },
    "family-school": {
      label: "子どもと暮らす｜中学生以降",
      hint: "教育・通学にかかる費用を厚めに見込み、固定費を守る目安です。",
      summary: "教育費を厚めに確保しながら、固定費と将来の積み立てを守る配分です。",
      tipTitle: "学びに備える家計メモ",
      tipMessage: "教材・塾・通学などは、毎月分だけでなく年間額も確認すると安心です。",
      tipDetail: "教育費は16%を目安に。臨時出費に備え、貯蓄・投資も細く長く続けましょう。",
      ratios: [24, 15, 6, 5, 7, 4, 16, 4, 3, 16]
    },
    "multi-generation": {
      label: "親世代と暮らす",
      hint: "共有の食費・光熱費と、それぞれの将来費用を見える化する目安です。",
      summary: "住居費を抑えながら、共有の食費・光熱費・保険を丁寧に見える化する配分です。",
      tipTitle: "共有する暮らしのメモ",
      tipMessage: "食費・光熱費・住居の修繕費など、誰がどこまで負担するかを言葉にしておくと安心です。",
      tipDetail: "貯蓄・投資は28%を目安に。共有費と個人のためのお金を分けて管理してみてください。",
      ratios: [18, 18, 8, 5, 9, 6, 0, 5, 3, 28]
    }
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
  const householdNote = document.querySelector("#household-note");
  const tipTitle = document.querySelector("#tip-title");
  const tipMessage = document.querySelector("#tip-message");
  const tipDetail = document.querySelector("#tip-detail");

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
    if (householdNote) householdNote.textContent = profile.hint;
    if (tipTitle) tipTitle.textContent = profile.tipTitle;
    if (tipMessage) tipMessage.textContent = profile.tipMessage;
    if (tipDetail) tipDetail.textContent = profile.tipDetail;
    donut.style.background = `conic-gradient(${chartGradient(rules)})`;
    resultIncome.textContent = `¥${yen.format(income)}`;
    resultIncomeTitle.textContent = `${yen.format(income)}円`;
    const amounts = allocateAmounts(income, rules);
    list.replaceChildren(...rules.map((rule, index) => createRow(rule, amounts[index])));
    resultStatus.textContent = profile.summary;
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
