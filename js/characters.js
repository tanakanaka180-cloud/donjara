const CHARACTERS = [
    { id: 'c1', name: 'キャラクター1', skillName: '豊作ツモ', skillDesc: '自分の番に牌を1枚多くツモる。', skillId: 'SKILL_DRAW_EXTRA', image: 'img/character/選択キャラ (1).png' },
    { id: 'c2', name: 'キャラクター2', skillName: '幻惑の舞', skillDesc: '他プレイヤー全員の手牌をシャッフルする。', skillId: 'SKILL_SHUFFLE_ENEMY', image: 'img/character/選択キャラ (2).png' },
    { id: 'c3', name: 'キャラクター3', skillName: '千里眼', skillDesc: '山札の上の3枚を見る。', skillId: 'SKILL_PEEK_DECK', image: 'img/character/選択キャラ (3).png' },
    { id: 'c4', name: 'キャラクター4', skillName: 'スリ替え', skillDesc: '他プレイヤーと手牌を1つ交換する。', skillId: 'SKILL_SWAP_TILE', image: 'img/character/選択キャラ (4).png' },
    { id: 'c5', name: 'キャラクター5', skillName: '威圧', skillDesc: '次のプレイヤーのターンをスキップさせる。', skillId: 'SKILL_SKIP_TURN', image: 'img/character/選択キャラ (5).png' },
    { id: 'c6', name: 'キャラクター6', skillName: '絶対防御', skillDesc: '1ターン、他プレイヤーのスキルを無効化。', skillId: 'SKILL_PROTECT', image: 'img/character/選択キャラ (6).png' },
    { id: 'c7', name: 'キャラクター7', skillName: '大暴走', skillDesc: '全員の手牌からランダムに1枚捨てさせる。', skillId: 'SKILL_RANDOM_DISCARD', image: 'img/character/選択キャラ (7).png' },
    { id: 'c8', name: 'キャラクター8', skillName: '一攫千金', skillDesc: 'このラウンドで上がった場合の得点が2倍。', skillId: 'SKILL_DOUBLE_SCORE', image: 'img/character/選択キャラ (8).png' },
    { id: 'c9', name: 'キャラクター9', skillName: '狙い撃ち', skillDesc: '相手を指定し、重要な牌を捨てさせる。', skillId: 'SKILL_FORCE_DISCARD', image: 'img/character/選択キャラ (9).png' },
    { id: 'c10', name: 'キャラクター10', skillName: 'ネクロマンシー', skillDesc: '捨て牌から好きな牌を1つ手札に加える。', skillId: 'SKILL_RESURRECT', image: 'img/character/選択キャラ (10).png' },
    // 追加の10キャラクター
    { id: 'c11', name: 'キャラクター11', skillName: '透視眼', skillDesc: '他プレイヤーの手牌を一部覗き見る。', skillId: 'SKILL_SEE_HAND', image: 'img/character/選択キャラ (11).png' },
    { id: 'c12', name: 'キャラクター12', skillName: 'ツモ封じ', skillDesc: '次のプレイヤーのツモを1回休みにする。', skillId: 'SKILL_CANCEL_DRAW', image: 'img/character/選択キャラ (12).png' },
    { id: 'c13', name: 'キャラクター13', skillName: 'スコアドレイン', skillDesc: 'トップのプレイヤーから得点を奪う。', skillId: 'SKILL_STEAL_SCORE', image: 'img/character/選択キャラ (13).png' },
    { id: 'c14', name: 'キャラクター14', skillName: 'ダブルドロー', skillDesc: '次の自分のターンで2枚ツモれる。', skillId: 'SKILL_DOUBLE_DRAW', image: 'img/character/選択キャラ (14).png' },
    { id: 'c15', name: 'キャラクター15', skillName: 'シールドブレイク', skillDesc: '全員の防御効果を強制解除する。', skillId: 'SKILL_SHIELD_BREAK', image: 'img/character/選択キャラ (15).png' },
    { id: 'c16', name: 'キャラクター16', skillName: '捨て牌禁止', skillDesc: '指定した種類の牌を捨てられなくする。', skillId: 'SKILL_FORBID_TILE', image: 'img/character/選択キャラ (16).png' },
    { id: 'c17', name: 'キャラクター17', skillName: 'ゴミあさり', skillDesc: '手牌の一部と捨て牌をランダム交換する。', skillId: 'SKILL_TRASH_EXCHANGE', image: 'img/character/選択キャラ (17).png' },
    { id: 'c18', name: 'キャラクター18', skillName: 'ものまね', skillDesc: '直前のプレイヤーのスキルをコピーして使う。', skillId: 'SKILL_MIMIC', image: 'img/character/選択キャラ (18).png' },
    { id: 'c19', name: 'キャラクター19', skillName: 'リバース', skillDesc: 'ターンの進行方向を逆にする。', skillId: 'SKILL_REVERSE', image: 'img/character/選択キャラ (19).png' },
    { id: 'c20', name: 'キャラクター20', skillName: 'ジョーカー生成', skillDesc: '手牌の1つをオールマイティ牌に変える。', skillId: 'SKILL_JOKER', image: 'img/character/選択キャラ (20).png' }
];
