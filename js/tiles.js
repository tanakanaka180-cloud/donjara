// カテゴリ定義
const CATEGORIES = {
    PERSON: '人物',
    ITEM: 'アイテム',
    COSTUME: '衣装'
};

// カード（牌）の定義（全36種）
const TILES = [
    // 人物
    { id: 'p1', name: 'おじさん', category: CATEGORIES.PERSON, image: 'img/card/人物/おじさん.png' },
    { id: 'p2', name: 'マッチョ', category: CATEGORIES.PERSON, image: 'img/card/人物/マッチョ.png' },
    { id: 'p3', name: '女子高生', category: CATEGORIES.PERSON, image: 'img/card/人物/女子高生.png' },
    { id: 'p4', name: 'ギャル', category: CATEGORIES.PERSON, image: 'img/card/人物/ギャル.png' },
    { id: 'p5', name: '獣人（猫）', category: CATEGORIES.PERSON, image: 'img/card/人物/猫.png' },
    { id: 'p6', name: '獣人（熊）', category: CATEGORIES.PERSON, image: 'img/card/人物/熊.png' },
    { id: 'p7', name: 'ダンディなイケメンおじさん', category: CATEGORIES.PERSON, image: 'img/card/人物/イケオジ.png' },
    { id: 'p8', name: 'メイド', category: CATEGORIES.PERSON, image: 'img/card/人物/メイド.png' },
    { id: 'p9', name: '忍者', category: CATEGORIES.PERSON, image: 'img/card/人物/忍者.png' },
    { id: 'p10', name: '中二病男子', category: CATEGORIES.PERSON, image: 'img/card/人物/中二男子.png' },
    { id: 'p11', name: 'おばちゃん', category: CATEGORIES.PERSON, image: 'img/card/人物/おばちゃん.png' },
    { id: 'p12', name: 'OL', category: CATEGORIES.PERSON, image: 'img/card/人物/OL.png' },

    // アイテム
    { id: 'i1', name: '魔法のステッキ', category: CATEGORIES.ITEM, image: 'img/card/アイテム/魔法のステッキ.png' },
    { id: 'i2', name: 'チェーンソー', category: CATEGORIES.ITEM, image: 'img/card/アイテム/チェーンソー.png' },
    { id: 'i3', name: 'ネクタイ', category: CATEGORIES.ITEM, image: 'img/card/アイテム/ネクタイ.png' },
    { id: 'i4', name: 'ママチャリ', category: CATEGORIES.ITEM, image: 'img/card/アイテム/ママチャリ.png' },
    { id: 'i5', name: '猫耳', category: CATEGORIES.ITEM, image: 'img/card/アイテム/ねこみみ.png' },
    { id: 'i6', name: 'サングラス', category: CATEGORIES.ITEM, image: 'img/card/アイテム/サングラス.png' },
    { id: 'i7', name: '日本刀', category: CATEGORIES.ITEM, image: 'img/card/アイテム/日本刀.png' },
    { id: 'i8', name: 'バット', category: CATEGORIES.ITEM, image: 'img/card/アイテム/バット.png' },
    { id: 'i9', name: 'マイク', category: CATEGORIES.ITEM, image: 'img/card/アイテム/マイク.png' },
    { id: 'i10', name: 'バナナ', category: CATEGORIES.ITEM, image: 'img/card/アイテム/バナナ.png' },
    { id: 'i11', name: 'ぬいぐるみ', category: CATEGORIES.ITEM, image: 'img/card/アイテム/ぬいぐるみ.png' },
    { id: 'i12', name: '丸太', category: CATEGORIES.ITEM, image: 'img/card/アイテム/丸太.png' },

    // 衣装
    { id: 'c1', name: '全身タイツ', category: CATEGORIES.COSTUME, image: 'img/card/衣装/全身タイツ.png' },
    { id: 'c2', name: '魔法少女衣装(アイドル衣装)', category: CATEGORIES.COSTUME, image: 'img/card/衣装/魔法少女衣装（アイドル衣装）.png' },
    { id: 'c3', name: 'メイド服', category: CATEGORIES.COSTUME, image: 'img/card/衣装/メイド衣装.png' },
    { id: 'c4', name: 'ウェディングドレス', category: CATEGORIES.COSTUME, image: 'img/card/衣装/ウェディングドレス.png' },
    { id: 'c5', name: 'チャイナ服', category: CATEGORIES.COSTUME, image: 'img/card/衣装/チャイナ服.png' },
    { id: 'c6', name: 'バニーガール衣装', category: CATEGORIES.COSTUME, image: 'img/card/衣装/バニーガール衣装.png' },
    { id: 'c7', name: 'セーラー服', category: CATEGORIES.COSTUME, image: 'img/card/衣装/セーラー服.png' },
    { id: 'c8', name: '鎧', category: CATEGORIES.COSTUME, image: 'img/card/衣装/鎧.png' },
    { id: 'c9', name: 'スーツ', category: CATEGORIES.COSTUME, image: 'img/card/衣装/スーツ.png' },
    { id: 'c10', name: '白衣', category: CATEGORIES.COSTUME, image: 'img/card/衣装/白衣.png' },
    { id: 'c11', name: '腹巻', category: CATEGORIES.COSTUME, image: 'img/card/衣装/腹巻.png' },
    { id: 'c12', name: '和服', category: CATEGORIES.COSTUME, image: 'img/card/衣装/和服.png' }
];

// 3枚セットの定義一覧
const COMBINATION_DEFINITIONS = [
    // --- 王道コーディネート (各40点) ---
    { name: '王道魔法少女', score: 40, tiles: ['女子高生', '魔法のステッキ', '魔法少女衣装(アイドル衣装)'] },
    { name: '完璧なるメイド', score: 40, tiles: ['メイド', 'ぬいぐるみ', 'メイド服'] },
    { name: '真・忍者', score: 40, tiles: ['忍者', '日本刀', '和服'] },
    { name: 'バリキャリOL', score: 40, tiles: ['OL', 'ネクタイ', 'スーツ'] },
    { name: '商店街の覇者', score: 40, tiles: ['おばちゃん', 'ママチャリ', '腹巻'] },
    { name: '裏社会のフィクサー', score: 40, tiles: ['ダンディなイケメンおじさん', 'サングラス', 'スーツ'] },
    { name: '邪気眼の覚醒', score: 40, tiles: ['中二病男子', '日本刀', '鎧'] },
    { name: '怪力バーサーカー', score: 40, tiles: ['マッチョ', '丸太', '全身タイツ'] },
    { name: 'スケバン伝説', score: 40, tiles: ['女子高生', 'バット', 'セーラー服'] },
    { name: 'あざとギャル', score: 40, tiles: ['ギャル', '猫耳', 'バニーガール衣装'] },
    { name: 'マッドサイエンティスト', score: 40, tiles: ['おじさん', 'サングラス', '白衣'] },
    { name: '森の守護獣', score: 40, tiles: ['獣人（熊）', '丸太', '鎧'] },
    { name: 'くノ一', score: 40, tiles: ['女子高生', '日本刀', '和服'] },
    { name: '歌姫アイドル', score: 40, tiles: ['ギャル', 'マイク', '魔法少女衣装(アイドル衣装)'] },
    { name: '敏腕女スパイ', score: 40, tiles: ['OL', 'サングラス', 'バニーガール衣装'] },
    { name: '熱血教師', score: 40, tiles: ['マッチョ', 'バット', 'スーツ'] },
    { name: '休日のパパ', score: 40, tiles: ['おじさん', 'ネクタイ', '腹巻'] },
    { name: '中華街の用心棒', score: 40, tiles: ['忍者', '丸太', 'チャイナ服'] },
    { name: '戦闘メイド', score: 40, tiles: ['メイド', 'チェーンソー', 'メイド服'] },
    { name: 'にゃんこ忍者', score: 40, tiles: ['獣人（猫）', '猫耳', '和服'] },

    // --- ドラマチック系 (各40点) ---
    { name: '逃走する花嫁', score: 40, tiles: ['OL', 'ママチャリ', 'ウェディングドレス'] },
    { name: 'パニックホラーサバイバー', score: 40, tiles: ['女子高生', 'チェーンソー', 'セーラー服'] },
    { name: '闇医者ブラック・ジャック', score: 40, tiles: ['おじさん', '日本刀', '白衣'] },
    { name: 'サイバーパンク侍', score: 40, tiles: ['中二病男子', '日本刀', 'スーツ'] },
    { name: '化け猫太夫', score: 40, tiles: ['獣人（猫）', '日本刀', '和服'] },
    { name: 'カンフーマスター', score: 40, tiles: ['おじさん', '丸太', 'チャイナ服'] },
    { name: '悲劇のヒロイン', score: 40, tiles: ['女子高生', 'ぬいぐるみ', 'ウェディングドレス'] },
    { name: '極道修行', score: 40, tiles: ['中二病男子', '日本刀', '白衣'] }, 
    { name: 'マフィアのボス', score: 40, tiles: ['ダンディなイケメンおじさん', 'バナナ', 'スーツ'] }, 
    { name: 'ドン・キホーテ', score: 40, tiles: ['おじさん', 'ママチャリ', '鎧'] },

    // --- ギャップ・カオス (各30点) ---
    { name: '筋肉少女隊', score: 30, tiles: ['マッチョ', '魔法のステッキ', '魔法少女衣装(アイドル衣装)'] },
    { name: '深夜の不審者', score: 30, tiles: ['おじさん', 'チェーンソー', '全身タイツ'] },
    { name: '野生解放', score: 30, tiles: ['獣人（猫）', 'バナナ', 'ウェディングドレス'] },
    { name: '戦うおばちゃん', score: 30, tiles: ['おばちゃん', '日本刀', 'チャイナ服'] },
    { name: 'イケメンご奉仕', score: 30, tiles: ['ダンディなイケメンおじさん', 'マイク', 'メイド服'] },
    { name: 'マジカル・オジサン', score: 30, tiles: ['おじさん', '魔法のステッキ', '魔法少女衣装(アイドル衣装)'] },
    { name: '世紀末おばちゃん', score: 30, tiles: ['おばちゃん', 'チェーンソー', '鎧'] },
    { name: '白馬の王子様？', score: 30, tiles: ['ダンディなイケメンおじさん', 'ママチャリ', 'ウェディングドレス'] },
    { name: '野生の証明', score: 30, tiles: ['OL', '丸太', '全身タイツ'] },
    { name: 'デスゲーム主催者', score: 30, tiles: ['獣人（熊）', 'サングラス', 'スーツ'] },
    { name: 'ヤンキー忍者', score: 30, tiles: ['忍者', 'バット', 'セーラー服'] },
    { name: 'バナナの復讐鬼', score: 30, tiles: ['メイド', 'バナナ', '全身タイツ'] },
    { name: '中二病の末路', score: 30, tiles: ['中二病男子', 'ぬいぐるみ', '腹巻'] },
    { name: '結婚詐欺師', score: 30, tiles: ['マッチョ', 'ネクタイ', 'ウェディングドレス'] },

    // --- 激ヤバ・カオス系 (各30点) ---
    { name: '宴会部長の最終形態', score: 30, tiles: ['おじさん', 'ネクタイ', '全身タイツ'] },
    { name: '変態紳士', score: 30, tiles: ['ダンディなイケメンおじさん', 'ネクタイ', 'バニーガール衣装'] },
    { name: 'サーカス団の脱走熊', score: 30, tiles: ['獣人（熊）', 'ママチャリ', 'バニーガール衣装'] },
    { name: '偽装失敗忍者', score: 30, tiles: ['忍者', 'サングラス', 'スーツ'] },
    { name: '狂気の沙汰', score: 30, tiles: ['メイド', 'バット', 'ウェディングドレス'] },
    { name: 'ストリート・ファイト', score: 30, tiles: ['マッチョ', '丸太', '腹巻'] },
    { name: '社畜の限界休日', score: 30, tiles: ['OL', 'ぬいぐるみ', '腹巻'] },
    { name: '大阪のおばちゃん進化系', score: 30, tiles: ['おばちゃん', 'バナナ', '全身タイツ'] },
    { name: 'ゴリラアイドルの誕生', score: 30, tiles: ['マッチョ', 'マイク', '魔法少女衣装(アイドル衣装)'] },
    { name: 'チャイナドレスの野獣', score: 30, tiles: ['獣人（熊）', 'マイク', 'チャイナ服'] },
    { name: 'バニーボーイ', score: 30, tiles: ['中二病男子', '猫耳', 'バニーガール衣装'] },
    { name: 'メカジジイ', score: 30, tiles: ['おじさん', 'チェーンソー', '鎧'] },

    // --- テーマ別トリオ (各20点) ---
    { name: '凶器三種', score: 20, tiles: ['チェーンソー', '日本刀', 'バット'] },
    { name: '日常と移動道具', score: 20, tiles: ['ママチャリ', 'ネクタイ', 'バナナ'] },
    { name: 'ステージアイドル', score: 20, tiles: ['マイク', '猫耳', '魔法のステッキ'] },
    { name: '女子会トリオ', score: 20, tiles: ['女子高生', 'ギャル', 'OL'] },
    { name: 'ケモナー連合', score: 20, tiles: ['獣人（猫）', '獣人（熊）', '猫耳'] },
    { name: 'オヤジ同盟', score: 20, tiles: ['おじさん', 'ダンディなイケメンおじさん', 'おばちゃん'] },
    { name: 'アキバコスチューム', score: 20, tiles: ['魔法少女衣装(アイドル衣装)', 'メイド服', 'バニーガール衣装'] },
    { name: '伝統の装い', score: 20, tiles: ['和服', 'チャイナ服', '鎧'] },
    { name: 'お仕事ウェア', score: 20, tiles: ['スーツ', '白衣', 'メイド服'] },
    { name: '癒やし空間', score: 20, tiles: ['メイド', '獣人（猫）', 'ぬいぐるみ'] },
    { name: '通勤ラッシュ', score: 20, tiles: ['OL', 'おじさん', 'ママチャリ'] },
    { name: 'マッドメディカル', score: 20, tiles: ['白衣', 'チェーンソー', '中二病男子'] },
    { name: '深夜のコンビニ', score: 20, tiles: ['ギャル', '腹巻', 'バナナ'] },
    { name: 'アニマルプラネット', score: 20, tiles: ['獣人（熊）', '獣人（猫）', '丸太'] },
    { name: 'アイドルオーディション', score: 20, tiles: ['マイク', '魔法少女衣装(アイドル衣装)', 'セーラー服'] },
    { name: '大立ち回り', score: 20, tiles: ['日本刀', '忍者', '和服'] },

    // --- サブテーマ系 (各20点) ---
    { name: 'バナナの守護者', score: 20, tiles: ['獣人（熊）', 'バナナ', '鎧'] },
    { name: '絶対領域', score: 20, tiles: ['女子高生', '猫耳', 'セーラー服'] },
    { name: 'パリピ空間', score: 20, tiles: ['ギャル', 'サングラス', 'マイク'] },
    { name: '謎の覆面集団', score: 20, tiles: ['全身タイツ', '忍者', 'サングラス'] },
    { name: 'スポーツの秋', score: 20, tiles: ['女子高生', 'バット', 'マッチョ'] },
    { name: '異世界転生', score: 20, tiles: ['鎧', '魔法のステッキ', '中二病男子'] },
    { name: '修学旅行の夜', score: 20, tiles: ['女子高生', '中二病男子', 'ぬいぐるみ'] }
];

// 山札の生成（各カード3枚ずつ）
function createDeck() {
    let deck = [];
    TILES.forEach(def => {
        for (let i = 0; i < 3; i++) {
            deck.push({ ...def, uid: `${def.id}_${i}` });
        }
    });
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// ツールチップ表示用の関連役取得関数
function getRelatedYaku(tileName) {
    const list = [];
    list.push({
        name: '基本同牌',
        score: 10,
        tiles: [tileName, tileName, tileName]
    });

    COMBINATION_DEFINITIONS.forEach(cd => {
        if (cd.tiles.includes(tileName)) {
            list.push({
                name: cd.name,
                score: cd.score,
                tiles: cd.tiles
            });
        }
    });
    return list;
}

// 手牌9枚を総合判定する関数
function evaluateHand(hand) {
    if (hand.length !== 9) return { isWin: false, yakuName: '', score: 0 };

    const names = hand.map(t => t.name);
    const categories = hand.map(t => t.category);

    // 1. 9枚全体の特殊判定（染め手のみ）
    if (categories.every(c => c === CATEGORIES.PERSON)) {
        return { isWin: true, yakuName: '百鬼夜行', score: 100 };
    }
    if (categories.every(c => c === CATEGORIES.ITEM)) {
        return { isWin: true, yakuName: '武器庫・宝物庫', score: 100 };
    }
    if (categories.every(c => c === CATEGORIES.COSTUME)) {
        return { isWin: true, yakuName: 'クローゼット', score: 100 };
    }

    // 候補となる有効な3枚セットを定義
    const availableSets = [];
    
    // 同一カード3枚（基本同牌: 10点）
    const uniqueNames = Array.from(new Set(names));
    uniqueNames.forEach(un => {
        availableSets.push({
            name: '基本同牌',
            score: 10,
            tiles: [un, un, un]
        });
    });

    // 定義済みの組み合わせ役を追加
    COMBINATION_DEFINITIONS.forEach(cd => {
        availableSets.push({
            name: cd.name,
            score: cd.score,
            tiles: [...cd.tiles].sort()
        });
    });

    // 再帰探索で手札9枚を3つの有効なセットに分割できるか判定
    function canPartition(remTiles, formedSets) {
        if (remTiles.length === 0) return formedSets;

        const first = remTiles[0];
        for (let vs of availableSets) {
            if (vs.tiles.includes(first)) {
                let tempRem = [...remTiles];
                let match = true;
                for (let t of vs.tiles) {
                    const idx = tempRem.indexOf(t);
                    if (idx !== -1) {
                        tempRem.splice(idx, 1);
                    } else {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    const res = canPartition(tempRem, [...formedSets, vs]);
                    if (res) return res;
                }
            }
        }
        return null;
    }

    const matchedSets = canPartition([...names].sort(), []);
    if (!matchedSets) return { isWin: false, yakuName: '', score: 0 };

    // 役満判定（40点役が3組揃った場合）
    const setScores = matchedSets.map(s => s.score);
    if (setScores.filter(s => s >= 40).length === 3) {
        return { isWin: true, yakuName: '完全三位一体', score: 300 };
    }

    const setNames = matchedSets.map(s => s.name);
    const totalScore = setScores.reduce((a, b) => a + b, 0);

    return {
        isWin: true,
        yakuName: setNames.join(' ＋ '),
        score: totalScore
    };
}