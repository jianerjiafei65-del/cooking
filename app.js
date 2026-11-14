(() => {
  "use strict";

  const STORAGE_KEY = "ouchi-recipes-v1";

  /* ===== サンプルデータ（samples.js） ===== */
  const SAMPLE_RECIPES = window.SAMPLE_RECIPES || [];
  const SEEDED_KEY = "ouchi-recipes-seeded-v1";
  // 最初のバージョンから入っていたサンプル（以前から使っている人の判定用）
  const ORIGINAL_SAMPLE_IDS = ["sample_nikujaga", "sample_oyakodon", "sample_salad", "sample_misosoup"];

  /* ===== 分類 ===== */
  const CATEGORIES = [
    { id: "main", label: "主菜", emoji: "🍖" },
    { id: "side", label: "副菜", emoji: "🥗" },
    { id: "soup", label: "汁物", emoji: "🍲" },
    { id: "staple", label: "ごはん・麺", emoji: "🍚" },
    { id: "other", label: "その他", emoji: "🍽️" }
  ];
  const TAB_KEY = "ouchi-recipes-tab";
  const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? "その他";

  // 料理名から分類を推測（分類が未設定の古いデータ用）
  function guessCategory(name) {
    if (/汁|スープ|ポタージュ|シチュー/.test(name)) return "soup";
    if (/丼|ごはん|ご飯|飯|カレー|そば|うどん|ラーメン|パスタ|スパゲ|麺|寿司|おにぎり|チャーハン|パン|焼きそば|お好み焼き/.test(name)) return "staple";
    if (/サラダ|和え|おひたし|煮物|酢の物|きんぴら|漬け|ナムル|浅漬け|マリネ/.test(name)) return "side";
    if (/焼き|揚げ|フライ|ステーキ|ハンバーグ|煮付け|炒め|カツ|天ぷら|つくね|照り焼き|煮込み/.test(name)) return "main";
    return "other";
  }

  function getCategory(r) {
    if (r.category && CATEGORIES.some((c) => c.id === r.category)) return r.category;
    const sample = SAMPLE_RECIPES.find((x) => x.id === r.id);
    return sample?.category || guessCategory(r.name);
  }

  let currentTab = "all";
  try { currentTab = localStorage.getItem(TAB_KEY) || "all"; } catch (e) { /* noop */ }

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
    tabs: $("#categoryTabs"),
    catChoices: $("#categoryChoices"),
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
    let data = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) data = parsed;
      }
    } catch (e) { /* 読み込めない場合はサンプルを使う */ }
    if (!data) {
      markSeeded(SAMPLE_RECIPES.map((r) => r.id));
      return structuredClone(SAMPLE_RECIPES);
    }
    return addNewSamples(data);
  }

  // 新しく追加されたサンプルだけを既存データに加える（削除したサンプルは戻さない）
  function addNewSamples(data) {
    let seeded;
    try { seeded = JSON.parse(localStorage.getItem(SEEDED_KEY) || "null"); } catch (e) { seeded = null; }
    if (!Array.isArray(seeded)) seeded = ORIGINAL_SAMPLE_IDS;
    const have = new Set(data.map((r) => r.id));
    const added = SAMPLE_RECIPES.filter((r) => !seeded.includes(r.id) && !have.has(r.id));
    if (added.length) {
      data = data.concat(structuredClone(added));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* 保存できなくても表示は続ける */ }
    }
    markSeeded(SAMPLE_RECIPES.map((r) => r.id));
    return data;
  }

  function markSeeded(ids) {
    try { localStorage.setItem(SEEDED_KEY, JSON.stringify(ids)); } catch (e) { /* noop */ }
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

  // 「大さじ2」のように単位を前に置く表記に対応
  const PREFIX_UNITS = ["大さじ", "小さじ", "カップ"];
  function formatQty(amount, unit) {
    if (amount == null) return "適量";
    const u = String(unit || "");
    return PREFIX_UNITS.includes(u) ? `${u}${formatAmount(amount)}` : `${formatAmount(amount)}${u}`;
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
    const matched = recipes.filter((r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );

    // タブ（件数は検索結果に連動）
    const counts = { all: matched.length };
    CATEGORIES.forEach((c) => { counts[c.id] = 0; });
    matched.forEach((r) => { counts[getCategory(r)]++; });
    const hasOther = recipes.some((r) => getCategory(r) === "other");
    const tabs = [{ id: "all", label: "すべて" }, ...CATEGORIES.filter((c) => c.id !== "other" || hasOther)];
    if (!tabs.some((t) => t.id === currentTab)) currentTab = "all";

    el.tabs.innerHTML = tabs.map((t) => `
      <button type="button" class="tab" role="tab" data-tab="${t.id}"
        aria-selected="${t.id === currentTab}" tabindex="${t.id === currentTab ? 0 : -1}">
        ${t.label}<span class="tab-count">${counts[t.id]}</span>
      </button>`).join("");

    const filtered = currentTab === "all" ? matched : matched.filter((r) => getCategory(r) === currentTab);
    const tabLabel = currentTab === "all" ? "" : `${categoryLabel(currentTab)}：`;

    el.count.textContent = q
      ? `${tabLabel}${filtered.length}件 / 全${recipes.length}件`
      : `${tabLabel}${filtered.length}件のレシピ`;
    el.empty.hidden = filtered.length > 0;
    el.empty.textContent = recipes.length === 0
      ? "レシピがまだありません。右下の ＋ から追加しましょう。"
      : q ? "レシピが見つかりません" : `${categoryLabel(currentTab)}のレシピはまだありません`;

    el.tabs.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });

    el.list.innerHTML = filtered.map((r) => {
      const perKcal = r.nutrition?.kcal ? Math.round(r.nutrition.kcal / r.servings) : null;
      return `
        <li>
          <button class="card" data-id="${escapeHtml(r.id)}">
            <span class="card-emoji" aria-hidden="true">${r.emoji || guessEmoji(r.name)}</span>
            <span class="card-body">
              <p class="card-title">${escapeHtml(r.name)}</p>
              <span class="card-meta">
                ${currentTab === "all" ? `<span class="chip chip-cat">${categoryLabel(getCategory(r))}</span>` : ""}
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
      ["protein", "たんぱく質", per(n.protein), "g"],
      ["fat", "脂質", per(n.fat), "g"],
      ["carbs", "炭水化物", per(n.carbs), "g"],
      ["salt", "食塩相当量", per(n.salt), "g"]
    ];
    const recipeCtx = `「${r.name}」1人分`;

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
          <div class="hero-emoji" aria-hidden="true">${r.emoji || guessEmoji(r.name)}</div>
          <h2>${escapeHtml(r.name)}</h2>
          <span class="hero-cat">${categoryLabel(getCategory(r))}</span>
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
          ${r.ingredients.length ? `<p class="hint">材料をタップすると栄養の解説が見られます</p>` : ""}
          <ul class="ing-list">
            ${r.ingredients.map((i, idx) => `
              <li>
                <button type="button" class="ing-item${findIngredientInfo(i.name) ? " has-info" : ""}" data-idx="${idx}" aria-label="${escapeHtml(i.name)}の栄養解説を見る">
                  <svg class="ing-info" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
                  <span class="ing-name">${escapeHtml(i.name)}</span>
                  <span class="ing-amount">${escapeHtml(formatQty(i.amount == null ? null : i.amount * factor, i.unit))}</span>
                </button>
              </li>`).join("") || `<li class="muted">材料が登録されていません</li>`}
          </ul>
        </div>

        <div class="panel">
          <h3>栄養素 <small>1人分あたり</small></h3>
          <p class="hint">栄養素をタップすると詳しい解説が見られます</p>
          <div class="nutri-grid">
            <button type="button" class="nutri nutri-kcal" ${nutrientAttrs("kcal", per(n.kcal) == null ? null : round(per(n.kcal), 0), recipeCtx, true)}>
              <span class="nutri-label">エネルギー</span>
              <span class="nutri-value">${fmt(per(n.kcal), 0)}<span class="nutri-unit">kcal</span></span>
            </button>
            ${nutriItems.map(([id, label, v, unit]) => `
              <button type="button" class="nutri" ${nutrientAttrs(id, v == null ? null : round(v), recipeCtx, true)}>
                <span class="nutri-label">${label}</span>
                <span class="nutri-value">${fmt(v)}<span class="nutri-unit">${unit}</span></span>
              </button>`).join("")}
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
    const r = findRecipe(el.detailView.dataset.id);
    if (!r) return;
    const ing = e.target.closest(".ing-item");
    if (ing) { openIngredientInfo(r, Number(ing.dataset.idx)); return; }
    const nut = e.target.closest("[data-nid]");
    if (nut) { openNutrientFromEl(nut, r, false); return; }
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
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

  /* ===== 材料の栄養解説 ===== */
  const INFO = window.INGREDIENT_INFO || [];
  const COMMON_UNITS = { g: 1, ml: 1, cc: 1, kg: 1000, l: 1000, "大さじ": 15, "小さじ": 5, "カップ": 200 };

  // 材料名にもっとも長く一致するキーを持つデータを探す
  function findIngredientInfo(name) {
    const target = String(name).replace(/\s/g, "");
    let best = null, bestLen = 0;
    for (const info of INFO) {
      for (const key of info.keys) {
        if (key.length > bestLen && target.includes(key)) { best = info; bestLen = key.length; }
      }
    }
    return best;
  }

  // 分量をグラムに換算（換算できなければ null）
  function toGrams(info, amount, unit) {
    if (amount == null) return null;
    const u = String(unit || "").trim();
    const perUnit = info.units?.[u] ?? COMMON_UNITS[u.toLowerCase()];
    return perUnit ? amount * perUnit : null;
  }

  function openIngredientInfo(r, idx) {
    const ing = r.ingredients[idx];
    if (!ing) return;
    const info = findIngredientInfo(ing.name);
    const factor = viewServings / r.servings;
    const amount = ing.amount == null ? null : ing.amount * factor;
    const amountText = formatQty(amount, ing.unit);

    let html;
    if (!info) {
      html = `
        <div class="info-head">
          <div class="info-emoji" aria-hidden="true">🔍</div>
          <div>
            <h2 id="infoTitle">${escapeHtml(ing.name)}</h2>
            <p class="info-sub">このレシピで使う量：${escapeHtml(amountText)}</p>
          </div>
        </div>
        <p>この材料の栄養データはまだ登録されていません。</p>
        <p class="info-note">「じゃがいも」「鶏もも肉」「しょうゆ」など、一般的な名前で登録すると解説が表示されやすくなります。</p>`;
    } else {
      const p = info.per100;
      const grams = toGrams(info, amount, ing.unit);
      const scaled = (v, d = 1) => round((v * grams) / 100, d);
      const sameName = info.name.replace(/（.*）/, "") === ing.name;

      html = `
        <div class="info-head">
          <div class="info-emoji" aria-hidden="true">${info.emoji}</div>
          <div>
            <h2 id="infoTitle">${escapeHtml(ing.name)}</h2>
            <p class="info-sub">${escapeHtml(info.category)}${sameName ? "" : `・「${escapeHtml(info.name)}」のデータで表示`}</p>
          </div>
        </div>

        <div class="info-section">
          <h3>主な栄養素 <small>タップで詳しい解説</small></h3>
          <div class="tags">${info.highlights.map((h) => {
            const nid = findNutrientIndex(h);
            return nid < 0
              ? `<span class="tag tag-plain">${escapeHtml(h)}</span>`
              : `<button type="button" class="tag" data-nid="${nid}">${escapeHtml(h)}</button>`;
          }).join("")}</div>
        </div>

        <div class="info-section">
          <h3>栄養の解説</h3>
          <p>${escapeHtml(info.desc)}</p>
        </div>

        ${grams != null ? `
        <div class="info-section">
          <h3>このレシピでの量（${viewServings}人分：${escapeHtml(amountText)}${ing.unit === "g" ? "" : ` ≒ ${Math.round(grams)}g`}）</h3>
          ${miniGrid({ kcal: scaled(p.kcal, 0), protein: scaled(p.protein), fat: scaled(p.fat), carbs: scaled(p.carbs), salt: scaled(p.salt) }, `「${ing.name}」${amountText}（${viewServings}人分）`)}
        </div>` : ""}

        <div class="info-section">
          <h3>100gあたり</h3>
          ${miniGrid(p, `${info.name}100gあたり`)}
        </div>

        <div class="info-section">
          <p class="tip">${escapeHtml(info.tip)}</p>
        </div>

        <p class="info-note">※数値は日本食品標準成分表（八訂）をもとにした目安です。品種・部位・調理法によって変わります。</p>`;
    }

    showSheet(html, false);
  }

  function miniGrid(n, ctx) {
    const items = [
      ["エネルギー", n.kcal, "kcal", true],
      ["たんぱく質", n.protein, "g"],
      ["脂質", n.fat, "g"],
      ["炭水化物", n.carbs, "g"],
      ["食塩", n.salt, "g"]
    ];
    const ids = ["kcal", "protein", "fat", "carbs", "salt"];
    return `<div class="mini-grid">${items.map(([label, v, unit, main], i) => `
      <button type="button" class="mini${main ? " mini-kcal" : ""}" ${nutrientAttrs(ids[i], v, ctx)}><b>${v}</b><span>${label}<br>(${unit})</span></button>`).join("")}</div>`;
  }

  /* ===== 栄養素の解説 ===== */
  const NUTRIENTS = window.NUTRIENT_INFO || [];
  const MACRO_IDS = ["kcal", "protein", "fat", "carbs", "salt"];

  // タグの文字列にもっとも長く一致する栄養素を探す（見つからなければ -1）
  function findNutrientIndex(text) {
    let best = -1, bestLen = 0;
    NUTRIENTS.forEach((nu, idx) => {
      for (const key of nu.keys) {
        if (key.length > bestLen && text.includes(key)) { best = idx; bestLen = key.length; }
      }
    });
    return best;
  }

  // 栄養素ボタンに付ける data 属性（id: kcal など、value: その文脈での量）
  function nutrientAttrs(id, value, ctx, fromRecipe = false) {
    const idx = NUTRIENTS.findIndex((nu) => nu.id === id);
    if (idx < 0) return "";
    const label = NUTRIENTS[idx].name;
    return `data-nid="${idx}"${value != null ? ` data-val="${value}"` : ""} data-ctx="${escapeHtml(ctx || "")}"${fromRecipe ? ` data-recipe="1"` : ""} aria-label="${label}の解説を見る"`;
  }

  function openNutrientFromEl(elm, r, push) {
    const nu = NUTRIENTS[Number(elm.dataset.nid)];
    if (!nu) return;
    const val = elm.dataset.val != null ? Number(elm.dataset.val) : null;
    openNutrientInfo(nu, { value: val, ctx: elm.dataset.ctx, recipe: elm.dataset.recipe ? r : null }, push);
  }

  // レシピの材料から、その栄養素を多く含む材料を推定（1人分）
  function contributors(r, id) {
    const list = [];
    r.ingredients.forEach((ing, idx) => {
      const info = findIngredientInfo(ing.name);
      if (!info) return;
      const g = toGrams(info, ing.amount, ing.unit);
      if (g == null) return;
      const v = (info.per100[id] * g) / 100 / r.servings;
      if (v > 0) list.push({ idx, name: ing.name, v });
    });
    return list.sort((a, b) => b.v - a.v).slice(0, 3);
  }

  function openNutrientInfo(nu, { value = null, ctx = "", recipe = null } = {}, push = true) {
    const unit = nu.dv?.unit || (nu.id === "kcal" ? "kcal" : "g");
    let amountBox = "";
    if (value != null && ctx) {
      const pct = nu.dv ? Math.round((value / nu.dv.value) * 100) : null;
      amountBox = `
        <div class="dv-box">
          <p class="dv-label">${escapeHtml(ctx)}</p>
          <p class="dv-value">${value}<small>${unit}</small></p>
          ${pct != null ? `
            <div class="dv-bar" role="img" aria-label="1日の基準値の約${pct}%"><span style="width:${Math.min(pct, 100)}%"></span></div>
            <p class="dv-note">1日の基準値（${nu.dv.value.toLocaleString()}${unit}）の <b>約${pct}%</b>${nu.id === "salt" ? "（少ないほどよい）" : ""}</p>` : ""}
        </div>`;
    }

    let contribHtml = "";
    if (recipe && MACRO_IDS.includes(nu.id)) {
      const list = contributors(recipe, nu.id);
      if (list.length) {
        const max = list[0].v;
        contribHtml = `
        <div class="info-section">
          <h3>このレシピで多く含む材料 <small>1人分・推定</small></h3>
          <ul class="contrib">${list.map((c) => `
            <li>
              <button type="button" class="contrib-item" data-ing-idx="${c.idx}">
                <span class="contrib-name">${escapeHtml(c.name)}</span>
                <span class="contrib-bar"><span style="width:${Math.max(6, (c.v / max) * 100)}%"></span></span>
                <span class="contrib-val">${round(c.v, nu.id === "kcal" ? 0 : 1)}${unit}</span>
              </button>
            </li>`).join("")}
          </ul>
        </div>`;
      }
    }

    const html = `
      <div class="info-head">
        <div class="info-emoji" aria-hidden="true">${nu.emoji}</div>
        <div>
          <h2 id="infoTitle">${escapeHtml(nu.name)}とは</h2>
          <p class="info-sub">${escapeHtml(nu.category)}</p>
        </div>
      </div>
      <p class="lead">${escapeHtml(nu.summary)}</p>
      ${amountBox}
      ${contribHtml}
      <div class="info-section">
        <h3>体での働き</h3>
        <p>${escapeHtml(nu.role)}</p>
      </div>
      <div class="info-section two-col">
        <div class="caution caution-lack">
          <h3>不足すると</h3>
          <p>${escapeHtml(nu.lack)}</p>
        </div>
        <div class="caution caution-excess">
          <h3>とりすぎると</h3>
          <p>${escapeHtml(nu.excess)}</p>
        </div>
      </div>
      <div class="info-section">
        <h3>1日の目安（成人）</h3>
        <p>${escapeHtml(nu.daily)}</p>
      </div>
      <div class="info-section">
        <h3>多く含む食品</h3>
        <div class="tags">${nu.foods.map((f) => `<span class="tag tag-plain">${escapeHtml(f)}</span>`).join("")}</div>
      </div>
      <div class="info-section">
        <p class="tip">${escapeHtml(nu.tip)}</p>
      </div>
      <p class="info-note">※1日の目安は「日本人の食事摂取基準」、基準値は食品表示基準の栄養素等表示基準値をもとにしたおおよその値です。年齢・性別・体格・活動量によって変わります。</p>`;

    showSheet(html, push);
  }

  const infoSheet = $("#infoSheet");
  const infoBody = $("#infoBody");
  let sheetStack = []; // 解説シートの表示履歴（戻るボタン用）

  function renderSheet() {
    const html = sheetStack[sheetStack.length - 1];
    infoBody.innerHTML = (sheetStack.length > 1
      ? `<button type="button" class="sheet-back" data-sheet-back><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>戻る</button>`
      : "") + html;
    infoSheet.scrollTop = 0;
  }

  function showSheet(html, push) {
    if (push && infoSheet.open) sheetStack.push(html); else sheetStack = [html];
    renderSheet();
    if (!infoSheet.open) {
      if (typeof infoSheet.showModal === "function") infoSheet.showModal();
      else infoSheet.setAttribute("open", "");
    }
  }

  // シート内のボタン（戻る・栄養素・材料）
  infoBody.addEventListener("click", (e) => {
    const r = findRecipe(el.detailView.dataset.id);
    if (e.target.closest("[data-sheet-back]")) { sheetStack.pop(); renderSheet(); return; }
    const nut = e.target.closest("[data-nid]");
    if (nut) { openNutrientFromEl(nut, r, true); return; }
    const ingBtn = e.target.closest("[data-ing-idx]");
    if (ingBtn && r) {
      const prev = sheetStack.slice();
      openIngredientInfo(r, Number(ingBtn.dataset.ingIdx));
      sheetStack = [...prev, ...sheetStack]; // 履歴を残したまま材料の解説へ
      renderSheet();
    }
  });

  function closeInfo() {
    if (typeof infoSheet.close === "function") infoSheet.close();
    else infoSheet.removeAttribute("open");
  }
  $("#infoClose").addEventListener("click", closeInfo);
  // シートの外側（背景）をタップしたら閉じる
  infoSheet.addEventListener("click", (e) => {
    if (e.target !== infoSheet) return;
    const b = infoSheet.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) closeInfo();
  });
  // 画面が切り替わったら閉じる
  window.addEventListener("hashchange", closeInfo);

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
    const cat = r ? getCategory(r) : (currentTab !== "all" ? currentTab : "main");
    el.catChoices.innerHTML = CATEGORIES.map((c) => `
      <label class="seg-item">
        <input type="radio" name="category" value="${c.id}" ${c.id === cat ? "checked" : ""}>
        <span>${c.emoji} ${c.label}</span>
      </label>`).join("");
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
    const prev = findRecipe(id);
    const category = el.form.querySelector('input[name="category"]:checked')?.value || "other";
    const recipe = { id, name, category, servings, ingredients, nutrition, steps };
    // 料理名を変えていなければ、元の絵文字を引き継ぐ
    if (prev?.emoji && prev.name === name) recipe.emoji = prev.emoji;

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

  function selectTab(id) {
    currentTab = id;
    try { localStorage.setItem(TAB_KEY, id); } catch (e) { /* noop */ }
    renderList();
    el.tabs.querySelector(`[data-tab="${id}"]`)?.focus();
  }
  el.tabs.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (tab) selectTab(tab.dataset.tab);
  });
  // 左右キーでタブを移動
  el.tabs.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const ids = [...el.tabs.querySelectorAll("[data-tab]")].map((t) => t.dataset.tab);
    const i = ids.indexOf(currentTab);
    const next = ids[(i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length];
    e.preventDefault();
    selectTab(next);
  });
  el.add.addEventListener("click", () => go("#/new"));
  el.back.addEventListener("click", goUp);
  el.form.elements.dishName.addEventListener("input", () => {
    el.form.elements.dishName.classList.remove("invalid");
    el.formError.textContent = "";
  });

  window.addEventListener("hashchange", route);
  route();
})();
