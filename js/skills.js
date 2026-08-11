const Skills = {
    SKILL_DRAW_EXTRA: (game, user) => {
        if (game.deck.length > 0) {
            const extraTile = game.deck.pop();
            user.hand.push(extraTile);
            user.hand.sort((a, b) => a.id.localeCompare(b.id));
            return `【豊作ツモ】山札から「${extraTile.name}」を追加でツモりました！`;
        }
        return "山札がありません！";
    },
    SKILL_SHUFFLE_ENEMY: (game, user) => {
        game.players.forEach(p => {
            if (p !== user && !p.isProtected) {
                for (let i = p.hand.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [p.hand[i], p.hand[j]] = [p.hand[j], p.hand[i]];
                }
            }
        });
        return "他プレイヤー全員の手牌をシャッフルしました！";
    },
    SKILL_PEEK_DECK: (game, user) => {
        const top3 = game.deck.slice(-3).reverse().map(t => t.name).join('、');
        return `【千里眼】山札の上の3枚は「${top3 || 'なし'}」です！`;
    },
    SKILL_SWAP_TILE: (game, user) => {
        const enemies = game.players.filter(p => p !== user && p.hand.length > 0);
        if (enemies.length === 0 || user.hand.length === 0) return "交換できませんでした。";
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        const uIdx = Math.floor(Math.random() * user.hand.length);
        const tIdx = Math.floor(Math.random() * target.hand.length);
        const uTile = user.hand[uIdx];
        const tTile = target.hand[tIdx];
        user.hand[uIdx] = tTile;
        target.hand[tIdx] = uTile;
        return `【スリ替え】${target.character.name}の「${tTile.name}」と自分の「${uTile.name}」を交換しました！`;
    },
    SKILL_SKIP_TURN: (game, user) => {
        const uIdx = game.players.indexOf(user);
        const nextIdx = (uIdx + game.turnDirection + 4) % 4;
        game.players[nextIdx].skipped = true;
        return `【威圧】${game.players[nextIdx].character.name}の次のターンをスキップします！`;
    },
    SKILL_PROTECT: (game, user) => {
        user.isProtected = true;
        return "【絶対防御】1ターンの間、攻撃スキルを無効化します！";
    },
    SKILL_RANDOM_DISCARD: (game, user) => {
        game.players.forEach(p => {
            if (p !== user && !p.isProtected && p.hand.length > 0) {
                const idx = Math.floor(Math.random() * p.hand.length);
                const discarded = p.hand.splice(idx, 1)[0];
                game.discardPile.push(discarded);
            }
        });
        return "【大暴走】他プレイヤー全員の手牌からランダムに1枚捨てさせました！";
    },
    SKILL_DOUBLE_SCORE: (game, user) => {
        user.scoreMultiplier = 2;
        return "【一攫千金】このラウンドで上がった場合の獲得得点が2倍になります！";
    },
    SKILL_FORCE_DISCARD: (game, user) => {
        const enemies = game.players.filter(p => p !== user && p.hand.length > 0 && !p.isProtected);
        if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            const discarded = target.hand.pop();
            game.discardPile.push(discarded);
            return `【狙い撃ち】${target.character.name}に「${discarded.name}」を強制破棄させました！`;
        }
        return "不発に終わりました。";
    },
    SKILL_RESURRECT: (game, user) => {
        if (game.discardPile.length > 0) {
            const revived = game.discardPile.pop();
            user.hand.push(revived);
            user.hand.sort((a, b) => a.id.localeCompare(b.id));
            return `【ネクロマンシー】捨て牌から「${revived.name}」を手札に加えました！`;
        }
        return "捨て牌がありません！";
    },
    SKILL_SEE_HAND: (game, user) => {
        const enemies = game.players.filter(p => p !== user);
        const target = enemies[0];
        const handStr = target.hand.map(t => t.name).join('、');
        return `【透視眼】${target.character.name}の手牌: [ ${handStr} ]`;
    },
    SKILL_CANCEL_DRAW: (game, user) => {
        const uIdx = game.players.indexOf(user);
        const nextIdx = (uIdx + game.turnDirection + 4) % 4;
        game.players[nextIdx].cancelDraw = true;
        return `【ツモ封じ】${game.players[nextIdx].character.name}の次のツモを封印しました！`;
    },
    SKILL_STEAL_SCORE: (game, user) => {
        let topEnemy = null;
        game.players.forEach(p => {
            if (p !== user && (!topEnemy || p.score > topEnemy.score)) topEnemy = p;
        });
        if (topEnemy) {
            const stealAmount = Math.min(300, topEnemy.score);
            topEnemy.score -= stealAmount;
            user.score += stealAmount;
            return `【スコアドレイン】${topEnemy.character.name}から${stealAmount}点を奪いました！`;
        }
        return "奪える相手がいませんでした。";
    },
    SKILL_DOUBLE_DRAW: (game, user) => {
        user.doubleDrawNext = true;
        return "【ダブルドロー】次のターンで牌を2枚ツモれます！";
    },
    SKILL_SHIELD_BREAK: (game, user) => {
        game.players.forEach(p => { if (p !== user) p.isProtected = false; });
        return "【シールドブレイク】相手の防御効果を無効化しました！";
    },
    SKILL_FORBID_TILE: (game, user) => {
        game.forbidCategory = CATEGORIES.PERSON;
        return "【捨て牌禁止】このラウンド中、人物カードを捨てられなくしました！";
    },
    SKILL_TRASH_EXCHANGE: (game, user) => {
        if (user.hand.length > 0 && game.discardPile.length > 0) {
            const hIdx = Math.floor(Math.random() * user.hand.length);
            const dIdx = Math.floor(Math.random() * game.discardPile.length);
            const hTile = user.hand[hIdx];
            const dTile = game.discardPile[dIdx];
            user.hand[hIdx] = dTile;
            game.discardPile[dIdx] = hTile;
            return `【ゴミあさり】「${hTile.name}」と捨て牌の「${dTile.name}」を交換しました！`;
        }
        return "交換できませんでした。";
    },
    SKILL_MIMIC: (game, user) => {
        return Skills.SKILL_DRAW_EXTRA(game, user);
    },
    SKILL_REVERSE: (game, user) => {
        game.turnDirection *= -1;
        return "【リバース】ターンの進行方向を逆にしました！";
    },
    SKILL_JOKER: (game, user) => {
        if (user.hand.length > 0) {
            const jokerTile = { ...TILE_DEFINITIONS[0], name: '✨万能ジョーカー', uid: 'joker_' + Date.now() };
            user.hand[0] = jokerTile;
            return "【ジョーカー生成】手札の1枚を万能カードに変化させました！";
        }
        return "不発でした。";
    }
};