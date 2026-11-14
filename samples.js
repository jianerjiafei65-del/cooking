/*
 * サンプルレシピ
 * 栄養素はレシピ全体（servings 人分）の合計。和食20品は ingredients.js の材料データから計算した目安値です。
 */
window.SAMPLE_RECIPES = [
  {
    id: "sample_nikujaga", category: "main", emoji: "🥔",
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
    id: "sample_oyakodon", category: "staple", emoji: "🍚",
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
    id: "sample_salad", category: "side", emoji: "🥗",
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
    id: "sample_misosoup", category: "soup", emoji: "🍲",
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
  },

  /* ---------- 和食20品 ---------- */
  {
    id: "washoku_w01", category: "main", name: "豚の生姜焼き", emoji: "🐖", servings: 2,
    ingredients: [
      { name: "豚ロース薄切り肉", amount: 200, unit: "g" },
      { name: "玉ねぎ", amount: 0.5, unit: "個" },
      { name: "しょうが", amount: 1, unit: "片" },
      { name: "しょうゆ", amount: 2, unit: "大さじ" },
      { name: "みりん", amount: 2, unit: "大さじ" },
      { name: "酒", amount: 1, unit: "大さじ" },
      { name: "サラダ油", amount: 2, unit: "小さじ" },
      { name: "キャベツ", amount: 2, unit: "枚" }
    ],
    nutrition: { kcal: 720, protein: 41.4, fat: 42.3, carbs: 34.1, salt: 5.4 },
    steps: [
      "しょうがはすりおろし、しょうゆ・みりん・酒と混ぜてたれを作る。",
      "玉ねぎは薄切り、キャベツは千切りにする。",
      "フライパンに油を熱し、豚肉を広げて両面を焼き、玉ねぎを加えて炒める。",
      "たれを加えて全体に絡め、照りが出たら火を止める。キャベツと一緒に盛り付ける。"
    ]
  },
  {
    id: "washoku_w02", category: "main", name: "鶏の照り焼き", emoji: "🍗", servings: 2,
    ingredients: [
      { name: "鶏もも肉", amount: 1, unit: "枚" },
      { name: "しょうゆ", amount: 2, unit: "大さじ" },
      { name: "みりん", amount: 2, unit: "大さじ" },
      { name: "砂糖", amount: 2, unit: "小さじ" },
      { name: "酒", amount: 1, unit: "大さじ" },
      { name: "サラダ油", amount: 1, unit: "小さじ" }
    ],
    nutrition: { kcal: 664, protein: 44.4, fat: 39.5, carbs: 25.1, salt: 5.7 },
    steps: [
      "鶏肉は余分な脂を取り、厚い部分に切り込みを入れて厚さをそろえる。",
      "調味料をすべて混ぜておく。",
      "フライパンに油を熱し、鶏肉を皮目から中火で焼く。焼き色がついたら裏返し、ふたをして弱火で5分蒸し焼きにする。",
      "余分な脂を拭き取り、合わせ調味料を加えて煮詰めながら絡める。食べやすく切って盛り付ける。"
    ]
  },
  {
    id: "washoku_w03", category: "main", name: "さばの味噌煮", emoji: "🐟", servings: 2,
    ingredients: [
      { name: "さば", amount: 2, unit: "切れ" },
      { name: "しょうが", amount: 1, unit: "片" },
      { name: "味噌", amount: 2, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "大さじ" },
      { name: "酒", amount: 2, unit: "大さじ" },
      { name: "みりん", amount: 1, unit: "大さじ" },
      { name: "水", amount: 150, unit: "ml" }
    ],
    nutrition: { kcal: 518, protein: 37.8, fat: 29.1, carbs: 27.5, salt: 4.9 },
    steps: [
      "さばは皮に切り込みを入れ、熱湯をかけて臭みを取る。しょうがは薄切りにする。",
      "鍋に水・酒・砂糖・みりん・しょうがを入れて煮立て、さばを皮目を上にして並べる。",
      "味噌の半量を煮汁で溶いて加え、落としぶたをして中火で10分煮る。",
      "残りの味噌を加え、煮汁をかけながらとろみがつくまで3〜4分煮詰める。"
    ]
  },
  {
    id: "washoku_w04", category: "main", name: "鮭の塩焼き", emoji: "🐟", servings: 2,
    ingredients: [
      { name: "生鮭", amount: 2, unit: "切れ" },
      { name: "塩", amount: 1, unit: "g" },
      { name: "大根", amount: 4, unit: "cm" },
      { name: "しょうゆ", amount: 1, unit: "小さじ" }
    ],
    nutrition: { kcal: 221, protein: 36.7, fat: 6.7, carbs: 5.6, salt: 2.2 },
    steps: [
      "鮭に塩をふって10分おき、出てきた水分をキッチンペーパーで拭き取る。",
      "大根はすりおろして軽く水気をきる。",
      "魚焼きグリルを温め、鮭を盛り付けたときに表になる面から中火で焼く。",
      "両面がこんがり焼けたら器に盛り、大根おろしを添えてしょうゆをかける。"
    ]
  },
  {
    id: "washoku_w05", category: "main", name: "ぶり大根", emoji: "🐟", servings: 2,
    ingredients: [
      { name: "ぶり", amount: 2, unit: "切れ" },
      { name: "大根", amount: 10, unit: "cm" },
      { name: "しょうが", amount: 1, unit: "片" },
      { name: "しょうゆ", amount: 2, unit: "大さじ" },
      { name: "みりん", amount: 2, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "大さじ" },
      { name: "酒", amount: 2, unit: "大さじ" },
      { name: "水", amount: 300, unit: "ml" }
    ],
    nutrition: { kcal: 586, protein: 38.9, fat: 28.5, carbs: 42.6, salt: 5.4 },
    steps: [
      "大根は2cm厚さの半月切りにして面取りし、下ゆでする。",
      "ぶりは一口大に切り、熱湯をかけて霜降りにし、冷水で血合いやうろこを洗う。しょうがは薄切りにする。",
      "鍋に水・酒・砂糖・しょうがを入れて煮立て、大根とぶりを加えて落としぶたをして10分煮る。",
      "しょうゆとみりんを加え、煮汁が少なくなるまで15分ほど煮る。"
    ]
  },
  {
    id: "washoku_w06", category: "side", name: "筑前煮", emoji: "🥕", servings: 3,
    ingredients: [
      { name: "鶏もも肉", amount: 150, unit: "g" },
      { name: "ごぼう", amount: 0.5, unit: "本" },
      { name: "にんじん", amount: 0.5, unit: "本" },
      { name: "れんこん", amount: 100, unit: "g" },
      { name: "こんにゃく", amount: 0.5, unit: "枚" },
      { name: "生しいたけ", amount: 4, unit: "個" },
      { name: "ごま油", amount: 2, unit: "小さじ" },
      { name: "だし汁", amount: 200, unit: "ml" },
      { name: "しょうゆ", amount: 2, unit: "大さじ" },
      { name: "みりん", amount: 2, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "大さじ" }
    ],
    nutrition: { kcal: 667, protein: 34.1, fat: 29.8, carbs: 68.2, salt: 5.7 },
    steps: [
      "鶏肉は一口大、ごぼう・にんじん・れんこんは乱切りにする。こんにゃくはちぎって下ゆでし、しいたけは半分に切る。",
      "鍋にごま油を熱し、鶏肉を炒める。色が変わったら野菜とこんにゃくを加えて炒め合わせる。",
      "だし汁・砂糖・みりんを加え、落としぶたをして10分煮る。",
      "しょうゆを加え、ときどき混ぜながら煮汁がほとんどなくなるまで煮る。"
    ]
  },
  {
    id: "washoku_w07", category: "side", name: "きんぴらごぼう", emoji: "🥢", servings: 2,
    ingredients: [
      { name: "ごぼう", amount: 1, unit: "本" },
      { name: "にんじん", amount: 0.3, unit: "本" },
      { name: "ごま油", amount: 2, unit: "小さじ" },
      { name: "しょうゆ", amount: 1, unit: "大さじ" },
      { name: "みりん", amount: 1, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "小さじ" },
      { name: "白ごま", amount: 1, unit: "小さじ" }
    ],
    nutrition: { kcal: 261, protein: 5.1, fat: 9.9, carbs: 39.7, salt: 2.6 },
    steps: [
      "ごぼうは皮をこそげて細切りにし、水にさっとさらして水気をきる。にんじんも細切りにする。",
      "フライパンにごま油を熱し、ごぼうとにんじんを中火で炒める。",
      "しんなりしたら砂糖・みりん・しょうゆを加え、汁気がなくなるまで炒める。",
      "火を止めて白ごまをふる。"
    ]
  },
  {
    id: "washoku_w08", category: "side", name: "ほうれん草のおひたし", emoji: "🥬", servings: 2,
    ingredients: [
      { name: "ほうれん草", amount: 1, unit: "束" },
      { name: "だし汁", amount: 2, unit: "大さじ" },
      { name: "しょうゆ", amount: 2, unit: "小さじ" },
      { name: "かつお節", amount: 1, unit: "パック" }
    ],
    nutrition: { kcal: 52, protein: 6.9, fat: 0.9, carbs: 7.3, salt: 1.8 },
    steps: [
      "ほうれん草は根元をよく洗い、塩少々を入れた熱湯で根元から入れて1分ほどゆでる。",
      "冷水にとって色止めし、水気をしっかり絞って4cm長さに切る。",
      "だし汁としょうゆを合わせ、ほうれん草をひたす。",
      "器に盛り、かつお節をのせる。"
    ]
  },
  {
    id: "washoku_w09", category: "side", name: "だし巻き卵", emoji: "🍳", servings: 2,
    ingredients: [
      { name: "卵", amount: 3, unit: "個" },
      { name: "だし汁", amount: 3, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "小さじ" },
      { name: "しょうゆ", amount: 0.5, unit: "小さじ" },
      { name: "塩", amount: 0.5, unit: "g" },
      { name: "サラダ油", amount: 1, unit: "小さじ" }
    ],
    nutrition: { kcal: 263, protein: 18.7, fat: 19.3, carbs: 4, salt: 1.6 },
    steps: [
      "ボウルに卵を溶きほぐし、だし汁・砂糖・しょうゆ・塩を加えてよく混ぜる。",
      "卵焼き器を中火で熱して油をなじませ、卵液の1/3量を流し入れる。",
      "半熟になったら奥から手前に巻き、奥に寄せる。空いたところに油をなじませ、残りの卵液を2回に分けて同様に焼く。",
      "巻きすで形を整え、少し冷ましてから切り分ける。"
    ]
  },
  {
    id: "washoku_w10", category: "soup", name: "豚汁", emoji: "🍲", servings: 3,
    ingredients: [
      { name: "豚バラ薄切り肉", amount: 100, unit: "g" },
      { name: "大根", amount: 4, unit: "cm" },
      { name: "にんじん", amount: 0.3, unit: "本" },
      { name: "ごぼう", amount: 0.3, unit: "本" },
      { name: "こんにゃく", amount: 0.25, unit: "枚" },
      { name: "長ねぎ", amount: 0.5, unit: "本" },
      { name: "ごま油", amount: 1, unit: "小さじ" },
      { name: "だし汁", amount: 600, unit: "ml" },
      { name: "味噌", amount: 3, unit: "大さじ" }
    ],
    nutrition: { kcal: 456, protein: 29, fat: 24.5, carbs: 35.2, salt: 7.4 },
    steps: [
      "豚肉は3cm幅、大根とにんじんはいちょう切り、ごぼうはささがきにする。こんにゃくはちぎって下ゆでし、長ねぎは小口切りにする。",
      "鍋にごま油を熱して豚肉を炒め、色が変わったら長ねぎ以外の具材を加えて炒める。",
      "だし汁を加え、アクを取りながら野菜がやわらかくなるまで10〜15分煮る。",
      "火を弱めて味噌を溶き入れ、長ねぎを加えてひと煮立ちさせる。"
    ]
  },
  {
    id: "washoku_w11", category: "staple", name: "牛丼", emoji: "🍚", servings: 2,
    ingredients: [
      { name: "牛こま切れ肉", amount: 200, unit: "g" },
      { name: "玉ねぎ", amount: 1, unit: "個" },
      { name: "ごはん", amount: 400, unit: "g" },
      { name: "だし汁", amount: 150, unit: "ml" },
      { name: "しょうゆ", amount: 3, unit: "大さじ" },
      { name: "みりん", amount: 2, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "大さじ" },
      { name: "酒", amount: 2, unit: "大さじ" },
      { name: "紅しょうが", amount: null, unit: "" }
    ],
    nutrition: { kcal: 1389, protein: 50.8, fat: 39.4, carbs: 196.5, salt: 8.2 },
    steps: [
      "玉ねぎは1cm幅のくし切りにする。",
      "鍋にだし汁・しょうゆ・みりん・砂糖・酒を入れて煮立て、玉ねぎを加えて5分煮る。",
      "牛肉をほぐしながら加え、アクを取りながら5分ほど煮る。",
      "丼にごはんを盛り、煮汁ごとのせて紅しょうがを添える。"
    ]
  },
  {
    id: "washoku_w12", category: "main", name: "鶏の唐揚げ", emoji: "🍗", servings: 2,
    ingredients: [
      { name: "鶏もも肉", amount: 300, unit: "g" },
      { name: "しょうゆ", amount: 1.5, unit: "大さじ" },
      { name: "酒", amount: 1, unit: "大さじ" },
      { name: "しょうが", amount: 1, unit: "片" },
      { name: "にんにく", amount: 1, unit: "片" },
      { name: "片栗粉", amount: 4, unit: "大さじ" },
      { name: "揚げ油（吸油分）", amount: 1.5, unit: "大さじ" },
      { name: "レモン", amount: null, unit: "" }
    ],
    nutrition: { kcal: 899, protein: 52.4, fat: 60.7, carbs: 34.6, salt: 4.5 },
    steps: [
      "鶏肉は一口大に切る。しょうがとにんにくはすりおろす。",
      "ポリ袋に鶏肉・しょうゆ・酒・しょうが・にんにくを入れてよくもみ込み、15分以上おく。",
      "汁気を軽くきって片栗粉をまぶす。",
      "170℃の油で3分揚げていったん取り出し、4分休ませる。180℃に上げて1分ほど二度揚げし、カラッと仕上げる。レモンを添える。"
    ]
  },
  {
    id: "washoku_w13", category: "side", name: "揚げ出し豆腐", emoji: "⬜", servings: 2,
    ingredients: [
      { name: "木綿豆腐", amount: 1, unit: "丁" },
      { name: "片栗粉", amount: 2, unit: "大さじ" },
      { name: "揚げ油（吸油分）", amount: 1, unit: "大さじ" },
      { name: "だし汁", amount: 150, unit: "ml" },
      { name: "しょうゆ", amount: 1, unit: "大さじ" },
      { name: "みりん", amount: 1, unit: "大さじ" },
      { name: "大根", amount: 3, unit: "cm" },
      { name: "長ねぎ", amount: 5, unit: "cm" }
    ],
    nutrition: { kcal: 465, protein: 23.6, fat: 26.8, carbs: 33.8, salt: 2.8 },
    steps: [
      "豆腐はキッチンペーパーで包んで重しをのせ、20分ほど水切りして4等分に切る。",
      "だし汁・しょうゆ・みりんを小鍋でひと煮立ちさせ、つゆを作る。大根はすりおろし、長ねぎは小口切りにする。",
      "豆腐の水気を拭いて片栗粉を全体にまぶし、170℃の油できつね色になるまで揚げる。",
      "器に盛ってつゆをかけ、大根おろしと長ねぎをのせる。"
    ]
  },
  {
    id: "washoku_w14", category: "side", name: "かぼちゃの煮物", emoji: "🎃", servings: 2,
    ingredients: [
      { name: "かぼちゃ", amount: 300, unit: "g" },
      { name: "だし汁", amount: 200, unit: "ml" },
      { name: "砂糖", amount: 1, unit: "大さじ" },
      { name: "みりん", amount: 1, unit: "大さじ" },
      { name: "しょうゆ", amount: 1, unit: "大さじ" }
    ],
    nutrition: { kcal: 330, protein: 7.7, fat: 0.9, carbs: 80.5, salt: 2.8 },
    steps: [
      "かぼちゃは種とわたを取り、一口大に切って皮をところどころむき、面取りする。",
      "鍋に皮目を下にして並べ、だし汁・砂糖・みりんを加えて火にかける。",
      "煮立ったら落としぶたをして弱めの中火で8分煮る。",
      "しょうゆを加えてさらに5分煮て、竹串がすっと通ったら火を止め、そのまま冷まして味を含ませる。"
    ]
  },
  {
    id: "washoku_w15", category: "side", name: "ひじきの煮物", emoji: "🌿", servings: 4,
    ingredients: [
      { name: "乾燥ひじき", amount: 15, unit: "g" },
      { name: "にんじん", amount: 0.3, unit: "本" },
      { name: "油揚げ", amount: 1, unit: "枚" },
      { name: "大豆（水煮）", amount: 50, unit: "g" },
      { name: "ごま油", amount: 1, unit: "小さじ" },
      { name: "だし汁", amount: 150, unit: "ml" },
      { name: "しょうゆ", amount: 1.5, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "大さじ" },
      { name: "みりん", amount: 1, unit: "大さじ" }
    ],
    nutrition: { kcal: 356, protein: 17.7, fat: 18.2, carbs: 36.3, salt: 5 },
    steps: [
      "ひじきはたっぷりの水で20分ほど戻し、ざるにあげて水気をきる。",
      "にんじんは細切り、油揚げは油抜きをして細切りにする。",
      "鍋にごま油を熱し、ひじきとにんじんを炒める。油が回ったら油揚げと大豆を加える。",
      "だし汁・砂糖・みりん・しょうゆを加え、汁気が少なくなるまで中火で10分ほど煮る。"
    ]
  },
  {
    id: "washoku_w16", category: "side", name: "きゅうりとわかめの酢の物", emoji: "🥒", servings: 2,
    ingredients: [
      { name: "きゅうり", amount: 1, unit: "本" },
      { name: "乾燥わかめ", amount: 2, unit: "g" },
      { name: "塩", amount: 0.5, unit: "g" },
      { name: "酢", amount: 2, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "大さじ" },
      { name: "しょうゆ", amount: 0.5, unit: "小さじ" },
      { name: "白ごま", amount: null, unit: "" }
    ],
    nutrition: { kcal: 61, protein: 1.5, fat: 0.1, carbs: 13.7, salt: 1.3 },
    steps: [
      "きゅうりは薄い輪切りにし、塩をふって5分おき、しんなりしたら水気を絞る。",
      "わかめは水で戻し、水気をきる。",
      "酢・砂糖・しょうゆを混ぜて合わせ酢を作る。",
      "きゅうりとわかめを合わせ酢で和え、器に盛って白ごまをふる。"
    ]
  },
  {
    id: "washoku_w17", category: "side", name: "茶碗蒸し", emoji: "🥚", servings: 2,
    ingredients: [
      { name: "卵", amount: 1, unit: "個" },
      { name: "だし汁", amount: 200, unit: "ml" },
      { name: "しょうゆ", amount: 0.5, unit: "小さじ" },
      { name: "みりん", amount: 0.5, unit: "小さじ" },
      { name: "塩", amount: 0.5, unit: "g" },
      { name: "鶏ささみ", amount: 1, unit: "本" },
      { name: "えび", amount: 2, unit: "尾" },
      { name: "生しいたけ", amount: 2, unit: "個" },
      { name: "三つ葉", amount: null, unit: "" }
    ],
    nutrition: { kcal: 172, protein: 27.2, fat: 5.7, carbs: 4.4, salt: 1.5 },
    steps: [
      "卵を泡立てないように溶きほぐし、だし汁・しょうゆ・みりん・塩を加えて混ぜ、こし器でこす。",
      "ささみはそぎ切り、えびは殻と背わたを取り、しいたけは薄切りにする。",
      "器に具材を入れて卵液を静かに注ぎ、表面の泡を取ってアルミホイルでふたをする。",
      "鍋に器の1/3の高さまで湯を張り、ふたをずらしてのせて弱火で12〜15分蒸す。三つ葉をのせる。"
    ]
  },
  {
    id: "washoku_w18", category: "staple", name: "鶏ごぼうの炊き込みご飯", emoji: "🍚", servings: 4,
    ingredients: [
      { name: "米", amount: 2, unit: "合" },
      { name: "鶏もも肉", amount: 100, unit: "g" },
      { name: "ごぼう", amount: 0.3, unit: "本" },
      { name: "にんじん", amount: 0.3, unit: "本" },
      { name: "しめじ", amount: 0.5, unit: "パック" },
      { name: "油揚げ", amount: 0.5, unit: "枚" },
      { name: "しょうゆ", amount: 2, unit: "大さじ" },
      { name: "みりん", amount: 1, unit: "大さじ" },
      { name: "酒", amount: 1, unit: "大さじ" },
      { name: "だし汁", amount: 330, unit: "ml" }
    ],
    nutrition: { kcal: 1419, protein: 44.8, fat: 22.4, carbs: 258.5, salt: 5.8 },
    steps: [
      "米は洗ってざるにあげ、30分おく。",
      "鶏肉は小さめの一口大、ごぼうはささがき、にんじんと油揚げは細切り、しめじは小房に分ける。",
      "炊飯器に米・しょうゆ・みりん・酒を入れ、だし汁を2合の目盛りまで加えて軽く混ぜる。",
      "具材を米の上に広げてのせ（混ぜない）、普通に炊く。炊き上がったら全体をさっくり混ぜる。"
    ]
  },
  {
    id: "washoku_w19", category: "staple", name: "ざるそば", emoji: "🍜", servings: 2,
    ingredients: [
      { name: "そば（乾麺）", amount: 200, unit: "g" },
      { name: "めんつゆ（3倍濃縮）", amount: 4, unit: "大さじ" },
      { name: "水", amount: 180, unit: "ml" },
      { name: "長ねぎ", amount: 10, unit: "cm" },
      { name: "焼きのり", amount: 0.5, unit: "枚" },
      { name: "わさび", amount: null, unit: "" }
    ],
    nutrition: { kcal: 774, protein: 32.3, fat: 4.7, carbs: 151, salt: 11.5 },
    steps: [
      "めんつゆを水で割り、冷蔵庫で冷やしておく。長ねぎは小口切り、のりは細く切る。",
      "たっぷりの湯でそばを袋の表示時間どおりにゆでる。",
      "ざるにあげて流水でぬめりを洗い、氷水でしめて水気をよくきる。",
      "器に盛ってのりをのせ、つゆ・長ねぎ・わさびを添える。"
    ]
  },
  {
    id: "washoku_w20", category: "main", name: "鶏つくね", emoji: "🍢", servings: 2,
    ingredients: [
      { name: "鶏ひき肉", amount: 250, unit: "g" },
      { name: "長ねぎ", amount: 0.5, unit: "本" },
      { name: "しょうが", amount: 1, unit: "片" },
      { name: "卵", amount: 0.5, unit: "個" },
      { name: "片栗粉", amount: 1, unit: "大さじ" },
      { name: "塩", amount: 0.5, unit: "g" },
      { name: "サラダ油", amount: 2, unit: "小さじ" },
      { name: "しょうゆ", amount: 1.5, unit: "大さじ" },
      { name: "みりん", amount: 1.5, unit: "大さじ" },
      { name: "砂糖", amount: 1, unit: "小さじ" }
    ],
    nutrition: { kcal: 684, protein: 49.8, fat: 40.7, carbs: 29.4, salt: 4.8 },
    steps: [
      "長ねぎはみじん切り、しょうがはすりおろす。",
      "ボウルにひき肉・長ねぎ・しょうが・溶き卵・片栗粉・塩を入れ、粘りが出るまでよく練り、6等分して小判形にする。",
      "フライパンに油を熱し、つくねを並べて中火で焼く。焼き色がついたら裏返し、ふたをして弱火で4分蒸し焼きにする。",
      "しょうゆ・みりん・砂糖を加え、煮詰めながら全体に絡める。"
    ]
  }
];
