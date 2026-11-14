(() => {
  "use strict";

  const STORAGE_KEY = "ouchi-recipes-v1";

  /* ===== サンプルデータ ===== */
  const SAMPLE_RECIPES = [
    {
      id: "sample_nikujaga",
      name: "肉じゃが",
      servings: 2,
      ingredients: [
        { name: "じゃがいも", amount: 300, unit: "g" },
        { name: "牛こま切れ肉", amount: 150, unit: "g" },
        { name: "玉ねぎ", amount: 1, unit: "個" },
        { name: "にんじん", amount: 0.5, unit: "本" },
        { name: "しょうゆ", amount: 2, unit: "大さじ" },
        { name: "砂糖", amount: 1.5, unit: "大さじ" },
        { name: "みりん", amount: 2, unit: "大さじ" },
        { name: "だし汁", amount: 300, unit: "ml" }
      ],
      nutrition: { kcal: 820, protein: 34, fat: 30, carbs: 98, salt: 5.2 },
      steps: [
        "じゃがいもは一口大、玉ねぎはくし切り、にんじんは乱切りにする。",
        "鍋に油を熱し、牛肉を炒めて色が変わったら野菜を加えて炒める。",
        "だし汁・砂糖・みりんを加え、落としぶたをして10分煮る。",
        "しょうゆを加え、じゃがいもが柔らかくなるまでさらに10分煮る。"
      ]
    },
    {
      id: "sample_oyakodon",
      name: "親子丼",
      servings: 2,
      ingredients: [
        { name: "鶏もも肉", amount: 200, unit: "g" },
        { name: "卵", amount: 3, unit: "個" },
        { name: "玉ねぎ", amount: 0.5, unit: "個" },
        { name: "ごはん", amount: 400, unit: "g" },
        { name: "めんつゆ（3倍濃縮）", amount: 3, unit: "大さじ" },
        { name: "水", amount: 100, unit: "ml" },
        { name: "三つ葉", amount: null, unit: "" }
      ],
      nutrition: { kcal: 1360, protein: 62, fat: 38, carbs: 178, salt: 4.4 },
      steps: [
        "鶏肉は一口大、玉ねぎは薄切りにする。",
        "小さめのフライパンに水とめんつゆを入れて煮立て、鶏肉と玉ねぎを煮る。",
        "鶏肉に火が通ったら溶き卵を回し入れ、半熟でふたをして火を止める。",
        "ごはんにのせ、三つ葉を添える。"
      ]
    },
    {
      id: "sample_salad",
      name: "アボカドとトマトのサラダ",
      servings: 2,
      ingredients: [
        { name: "アボカド", amount: 1, unit: "個" },
        { name: "ミニトマト", amount: 8, unit: "個" },
        { name: "オリーブオイル", amount: 1, unit: "大さじ" },
        { name: "レモン汁", amount: 2, unit: "小さじ" },
        { name: "塩", amount: 0.5, unit: "g" },
        { name: "黒こしょう", amount: null, unit: "" }
      ],
      nutrition: { kcal: 420, protein: 5, fat: 38, carbs: 18, salt: 0.6 },
      steps: [
        "アボカドとミニトマトを食べやすい大きさに切る。",
        "オリーブオイル・レモン汁・塩を混ぜてドレッシングを作る。",
        "ボウルで全体をさっくり和え、黒こしょうをふる。"
      ]
    },
    {
      id: "sample_misosoup",
      name: "豆腐とわかめの味噌汁",
      servings: 2,
      ingredients: [
        { name: "絹ごし豆腐", amount: 150, unit: "g" },
        { name: "乾燥わかめ", amount: 2, unit: "g" },
        { name: "長ねぎ", amount: 10, unit: "cm" },
        { name: "だし汁", amount: 400, unit: "ml" },
        { name: "味噌", amount: 2, unit: "大さじ" }
      ],
      nutrition: { kcal: 140, protein: 11, fat: 6, carbs: 10, salt: 3.0 },
      steps: [
        "豆腐はさいの目切り、長ねぎは小口切りにする。",
        "だし汁を温め、豆腐とわかめを入れる。",
        "火を弱めて味噌を溶き入れ、長ねぎを加えて沸騰直前で火を止める。"
      ]
    }
  ];

  /* ===== 状態 ===== */
  let recipes = load();
  let viewServings = null; // 詳細画面で表示中の人数

  /* ===== 要素 ===== */
  const $ = (sel) => document.querySelector(sel);
  const el = {
    title: $("#appTitle"),
    back: $("#backBtn"),
    add: $("#addBtn"),
    listView: $("#listView"),
    detailView: $("#detailView"),
    editView: $("#editView"),
    search: $("#searchInput"),
    list: $("#recipeList"),
    count: $("#recipeCount"),
    empty: $("#emptyMsg"),
    form: $("#recipeForm"),
    ingRows: $("#ingredientRows"),
    stepRows: $("#stepRows"),
    formError: $("#formError"),
    toast: $("#toast")
  };

  /* ===== 保存・読込 ===== */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) return data;
      }
    } catch (e) { /* 読み込めない場合はサンプルを使う */ }
    return structuredClone(SAMPLE_RECIPES);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      showToast("保存できませんでした");
    }
  }

  /* ===== ユーティリティ ===== */
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function round(n, digits = 1) {
    const p = 10 ** digits;
    return Math.round(n * p) / p;
  }

  // 分量を読みやすく整形（0.5 → 1/2 など）
  function formatAmount(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return "適量";
    const fractions = { 0.25: "1/4", 0.5: "1/2", 0.75: "3/4", 0.33: "1/3", 0.67: "2/3" };
    const whole = Math.floor(n);
    const frac = round(n - whole, 2);
    if (n < 10 && fractions[frac]) {
      return whole > 0 ? `${whole}と${fractions[frac]}` : fractions[frac];
    }
    return String(n >= 100 ? Math.round(n) : round(n, 1));
  }

  function guessEmoji(name) {
    const map = [
      [/丼|ごはん|ご飯|炒飯|チャーハン|おにぎり|カレー/, "🍚"],
      [/麺|うどん|そば|ラーメン|パスタ|スパゲ/, "🍝"],
      [/汁|スープ|味噌汁|ポタージュ/, "🍲"],
      [/サラダ/, "🥗"],
      [/魚|鮭|さば|ぶり|刺身|寿司/, "🐟"],
      [/卵|玉子|オムレツ/, "🍳"],
      [/肉|唐揚げ|ハンバーグ|ステーキ|焼き鳥/, "🍖"],
      [/パン|サンド|トースト/, "🥪"],
      [/ケーキ|クッキー|プリン|デザート|スイーツ/, "🍰"],
      [/じゃが|芋|いも/, "🥔"]
    ];
    for (const [re, emoji] of map) if (re.test(name)) return emoji;
    return "🍽️";
  }

  let toastTimer;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2000);
  }

  const findRecipe = (id) => recipes.find((r) => r.id === id);

  /* ===== ルーティング（#/ , #/recipe/ID , #/edit/ID , #/new） ===== */
  function route() {
    const [, page, id] = location.hash.replace(/^#/, "").split("/");
    el.listView.hidden = el.detailView.hidden = el.editView.hidden = true;

    if (page === "recipe" && findRecipe(id)) {
      renderDetail(findRecipe(id));
    } else if (page === "edit" && findRecipe(id)) {
      renderEdit(findRecipe(id));
    } else if (page === "new") {
      renderEdit(null);
    } else {
      renderList();
    }
    window.scrollTo(0, 0);
  }

  function go(hash) { location.hash = hash; }

  function setHeader(title, showBack) {
    el.title.textContent = title;
    el.back.hidden = !showBack;
    document.title = showBack ? `${title} | おうちレシピ帖` : "おうちレシピ帖";
  }

  /* ===== 一覧 ===== */
  function renderList() {
    setHeader("おうちレシピ帖", false);
    el.add.hidden = false;
    el.listView.hidden = false;

    const q = el.search.value.trim().toLowerCase();
    const filtered = recipes.filter((r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );

    el.count.textContent = q
      ? `${filtered.length}件 / 全${recipes.length}件`
      : `全${recipes.length}件のレシピ`;
    el.empty.hidden = filtered.length > 0;
    el.empty.textContent = recipes.length === 0
      ? "レシピがまだありません。右下の ＋ から追加しましょう。"
      : "レシピが見つかりません";

    el.list.innerHTML = filtered.map((r) => {
      const perKcal = r.nutrition?.kcal ? Math.round(r.nutrition.kcal / r.servings) : null;
      return `
        <li>
          <button class="card" data-id="${escapeHtml(r.id)}">
            <span class="card-emoji" aria-hidden="true">${guessEmoji(r.name)}</span>
            <span class="card-body">
              <p class="card-title">${escapeHtml(r.name)}</p>
              <span class="card-meta">
                ${perKcal !== null ? `<span class="chip chip-accent">${perKcal} kcal/人</span>` : ""}
                <span class="chip">${r.servings}人分</span>
                <span class="chip">材料 ${r.ingredients.length}品</span>
              </span>
            </span>
          </button>
        </li>`;
    }).join("");
  }

  /* ===== 詳細 ===== */
  function renderDetail(r) {
    setHeader(r.name, true);
    el.add.hidden = true;
    el.detailView.hidden = false;
    if (viewServings === null || el.detailView.dataset.id !== r.id) viewServings = r.servings;
    el.detailView.dataset.id = r.id;

    const factor = viewServings / r.servings;
    const n = r.nutrition || {};
    const per = (v) => (v == null || v === "" ? null : v / r.servings);
    const fmt = (v, d = 1) => (v == null ? "—" : round(v, d));

    const nutriItems = [
      ["たんぱく質", per(n.protein), "g"],
      ["脂質", per(n.fat), "g"],
      ["炭水化物", per(n.carbs), "g"],
      ["食塩相当量", per(n.salt), "g"]
    ];

    // PFCバランス（エネルギー比）
    const pE = (per(n.protein) || 0) * 4;
    const fE = (per(n.fat) || 0) * 9;
    const cE = (per(n.carbs) || 0) * 4;
    const sum = pE + fE + cE;
    const pct = (v) => (sum ? Math.round((v / sum) * 100) : 0);

    const totalKcal = per(n.kcal) != null ? Math.round(per(n.kcal) * viewServings) : null;

    el.detailView.innerHTML = `
      <div class="detail">
        <div class="hero">
          <div class="hero-emoji" aria-hidden="true">${guessEmoji(r.name)}</div>
          <h2>${escapeHtml(r.name)}</h2>
        </div>

        <div class="panel">
          <div class="stepper">
            <button type="button" data-act="minus" aria-label="人数を減らす" ${viewServings <= 1 ? "disabled" : ""}>−</button>
            <output aria-live="polite">${viewServings}人分</output>
            <button type="button" data-act="plus" aria-label="人数を増やす" ${viewServings >= 20 ? "disabled" : ""}>＋</button>
          </div>
        </div>

        <div class="panel">
          <h3>材料 <small>${viewServings}人分</small></h3>
          <ul class="ing-list">
            ${r.ingredients.map((i) => `
              <li>
                <span>${escapeHtml(i.name)}</span>
                <span class="ing-amount">${
                  i.amount == null
                    ? "適量"
                    : `${formatAmount(i.amount * factor)}${escapeHtml(i.unit)}`
                }</span>
              </li>`).join("") || `<li class="muted">材料が登録されていません</li>`}
          </ul>
        </div>

        <div class="panel">
          <h3>栄養素 <small>1人分あたり</small></h3>
          <div class="nutri-grid">
            <div class="nutri nutri-kcal">
              <span class="nutri-label">エネルギー</span>
              <span class="nutri-value">${fmt(per(n.kcal), 0)}<span class="nutri-unit">kcal</span></span>
            </div>
            ${nutriItems.map(([label, v, unit]) => `
              <div class="nutri">
                <span class="nutri-label">${label}</span>
                <span class="nutri-value">${fmt(v)}<span class="nutri-unit">${unit}</span></span>
              </div>`).join("")}
          </div>
          ${totalKcal != null ? `<p class="nutri-total">${viewServings}人分の合計：${totalKcal} kcal</p>` : ""}
          ${sum ? `
          <div class="pfc">
            <div class="pfc-bar" role="img" aria-label="PFCバランス たんぱく質${pct(pE)}% 脂質${pct(fE)}% 炭水化物${pct(cE)}%">
              <span style="width:${pct(pE)}%;background:var(--p)"></span>
              <span style="width:${pct(fE)}%;background:var(--f)"></span>
              <span style="width:${pct(cE)}%;background:var(--c)"></span>
            </div>
            <div class="pfc-legend">
              <span><i style="background:var(--p)"></i>たんぱく質 ${pct(pE)}%</span>
              <span><i style="background:var(--f)"></i>脂質 ${pct(fE)}%</span>
              <span><i style="background:var(--c)"></i>炭水化物 ${pct(cE)}%</span>
            </div>
          </div>` : ""}
        </div>

        <div class="panel">
          <h3>作り方</h3>
          ${r.steps.length
            ? `<ol class="steps">${r.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`
            : `<p class="muted">手順が登録されていません</p>`}
        </div>

        <div class="detail-actions">
          <button type="button" class="btn btn-danger" data-act="delete">削除</button>
          <button type="button" class="btn btn-primary" data-act="edit">編集する</button>
        </div>
      </div>`;
  }

  el.detailView.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const r = findRecipe(el.detailView.dataset.id);
    if (!r) return;
    const act = btn.dataset.act;

    if (act === "minus" && viewServings > 1) { viewServings--; renderDetail(r); }
    if (act === "plus" && viewServings < 20) { viewServings++; renderDetail(r); }
    if (act === "edit") go(`#/edit/${r.id}`);
    if (act === "delete" && confirm(`「${r.name}」を削除しますか？`)) {
      recipes = recipes.filter((x) => x.id !== r.id);
      save();
      showToast("削除しました");
      go("#/");
    }
  });

  /* ===== 編集フォーム ===== */
  const ICON_DEL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;

  function ingredientRow(i = { name: "", amount: "", unit: "" }) {
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <input class="r-name" placeholder="材料名" aria-label="材料名" value="${escapeHtml(i.name)}">
      <input class="r-amount" type="number" min="0" step="any" inputmode="decimal" placeholder="分量" aria-label="分量（空欄で適量）" value="${i.amount ?? ""}">
      <input class="r-unit" placeholder="単位" aria-label="単位" list="unitList" value="${escapeHtml(i.unit)}">
      <button type="button" class="row-del" aria-label="この材料を削除">${ICON_DEL}</button>`;
    return div;
  }

  function stepRow(text = "") {
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <span class="row-num"></span>
      <textarea class="r-step" rows="2" placeholder="手順を入力" aria-label="手順">${escapeHtml(text)}</textarea>
      <button type="button" class="row-del" aria-label="この手順を削除">${ICON_DEL}</button>`;
    return div;
  }

  function renumberSteps() {
    el.stepRows.querySelectorAll(".row-num").forEach((s, idx) => { s.textContent = idx + 1; });
  }

  // 単位の候補
  const unitList = document.createElement("datalist");
  unitList.id = "unitList";
  unitList.innerHTML = ["g", "kg", "ml", "L", "個", "本", "枚", "切れ", "大さじ", "小さじ", "カップ", "片", "cm", "束", "パック"]
    .map((u) => `<option value="${u}">`).join("");
  document.body.appendChild(unitList);

  function renderEdit(r) {
    setHeader(r ? "レシピを編集" : "レシピを追加", true);
    el.add.hidden = true;
    el.editView.hidden = false;
    el.formError.textContent = "";
    el.form.dataset.id = r ? r.id : "";

    const f = el.form.elements;
    f.dishName.value = r?.name ?? "";
    f.dishName.classList.remove("invalid");
    f.servings.value = r?.servings ?? 2;
    const n = r?.nutrition ?? {};
    ["kcal", "protein", "fat", "carbs", "salt"].forEach((k) => { f[k].value = n[k] ?? ""; });

    el.ingRows.replaceChildren(...(r?.ingredients.length ? r.ingredients : [{ name: "", amount: "", unit: "" }]).map(ingredientRow));
    el.stepRows.replaceChildren(...(r?.steps.length ? r.steps : [""]).map(stepRow));
    renumberSteps();
  }

  $("#addIngredientBtn").addEventListener("click", () => {
    const row = ingredientRow();
    el.ingRows.appendChild(row);
    row.querySelector("input").focus();
  });

  $("#addStepBtn").addEventListener("click", () => {
    const row = stepRow();
    el.stepRows.appendChild(row);
    renumberSteps();
    row.querySelector("textarea").focus();
  });

  el.form.addEventListener("click", (e) => {
    const del = e.target.closest(".row-del");
    if (!del) return;
    del.parentElement.remove();
    renumberSteps();
  });

  // 編集中なら詳細へ、それ以外は一覧へ戻る
  function goUp() {
    const [, page, id] = location.hash.replace(/^#/, "").split("/");
    go(page === "edit" && findRecipe(id) ? `#/recipe/${id}` : "#/");
  }

  $("#cancelBtn").addEventListener("click", goUp);

  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = el.form.elements;
    const name = f.dishName.value.trim();

    if (!name) {
      el.formError.textContent = "料理名を入力してください";
      f.dishName.classList.add("invalid");
      f.dishName.focus();
      return;
    }

    const num = (v) => (v === "" || v == null ? null : Math.max(0, Number(v)));
    const servings = Math.min(20, Math.max(1, Math.round(Number(f.servings.value) || 1)));

    const ingredients = [...el.ingRows.querySelectorAll(".row")]
      .map((row) => ({
        name: row.querySelector(".r-name").value.trim(),
        amount: num(row.querySelector(".r-amount").value),
        unit: row.querySelector(".r-unit").value.trim()
      }))
      .filter((i) => i.name);

    const steps = [...el.stepRows.querySelectorAll(".r-step")]
      .map((t) => t.value.trim())
      .filter(Boolean);

    const nutrition = {};
    ["kcal", "protein", "fat", "carbs", "salt"].forEach((k) => { nutrition[k] = num(f[k].value); });

    const id = el.form.dataset.id || `r_${Date.now()}`;
    const recipe = { id, name, servings, ingredients, nutrition, steps };

    const idx = recipes.findIndex((r) => r.id === id);
    if (idx >= 0) recipes[idx] = recipe; else recipes.unshift(recipe);
    save();

    viewServings = null;
    showToast("保存しました");
    location.replace(`#/recipe/${id}`);
  });

  /* ===== イベント ===== */
  el.list.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) { viewServings = null; go(`#/recipe/${card.dataset.id}`); }
  });

  el.search.addEventListener("input", renderList);
  el.add.addEventListener("click", () => go("#/new"));
  el.back.addEventListener("click", goUp);
  el.form.elements.dishName.addEventListener("input", () => {
    el.form.elements.dishName.classList.remove("invalid");
    el.formError.textContent = "";
  });

  window.addEventListener("hashchange", route);
  route();
})();
