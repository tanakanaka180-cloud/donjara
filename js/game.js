class DonjaraGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentRound = 1;
        this.maxRounds = 3;
        this.turnDirection = 1;
        
        this.deck = [];
        this.discardPile = [];
        this.forbidCategory = null;
        
        this.pendingRon = null; // ロン待ちデータ
        
        this.onStateChange = null;
        this.onCpuAction = null;
        this.onGameEnd = null;
        this.onSkillUsed = null;
        this.onScoreChange = null; // スコアアニメーション通知
    }

    start(playerCharacter) {
        this.currentRound = 1;
        this.turnDirection = 1;

        const availableChars = CHARACTERS.filter(c => c.id !== playerCharacter.id);
        for (let i = availableChars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableChars[i], availableChars[j]] = [availableChars[j], availableChars[i]];
        }
        
        this.players = [
            { isPlayer: true, character: playerCharacter, hand: [], drawnTile: null, score: 1000, isProtected: false, scoreMultiplier: 1, skillUsed: false },
            { isPlayer: false, character: availableChars[0], hand: [], drawnTile: null, score: 1000, isProtected: false, scoreMultiplier: 1, skillUsed: false },
            { isPlayer: false, character: availableChars[1], hand: [], drawnTile: null, score: 1000, isProtected: false, scoreMultiplier: 1, skillUsed: false },
            { isPlayer: false, character: availableChars[2], hand: [], drawnTile: null, score: 1000, isProtected: false, scoreMultiplier: 1, skillUsed: false },
        ];
        
        this.initRound();
    }

    initRound() {
        this.forbidCategory = null;
        this.deck = createDeck();
        this.discardPile = [];
        this.currentPlayerIndex = 0;
        this.pendingRon = null;

        this.players.forEach(p => {
            p.hand = [];
            p.drawnTile = null;
            p.isProtected = false;
            p.scoreMultiplier = 1;
            p.skipped = false;
            p.cancelDraw = false;
            p.skillUsed = false;
            p.isTenpai = false;
        });

        // 配牌 (各8枚)
        for (let i = 0; i < 8; i++) {
            for (let p = 0; p < 4; p++) {
                this.players[p].hand.push(this.deck.pop());
            }
        }
        
        this.players.forEach(p => p.hand.sort((a, b) => a.id.localeCompare(b.id)));
        this.updateTenpaiStatus();
        this.startTurn();
    }

    updateTenpaiStatus() {
        // テンパイ判定（手持ち8枚の状態で判定）
        this.players.forEach(p => {
            p.isTenpai = this.checkTenpai(p.hand);
        });
    }

    checkTenpai(hand) {
        // 基本手持ちが8枚の状態で、全36種のどの牌が来たら9枚で上がれるかチェック
        if (hand.length !== 8) return false;
        for (let def of TILES) {
            const testHand = [...hand, def];
            if (evaluateHand(testHand).isWin) return true;
        }
        return false;
    }

    startTurn() {
        if (this.deck.length === 0) {
            if (this.onGameEnd) this.onGameEnd({ isDraw: true });
            return;
        }

        const currentPlayer = this.players[this.currentPlayerIndex];

        if (currentPlayer.skipped) {
            currentPlayer.skipped = false;
            this.nextTurn();
            return;
        }

        // CPUスキル自動発動チェック
        if (!currentPlayer.isPlayer && !currentPlayer.skillUsed) {
            this.tryCpuSkill(currentPlayer);
        }

        // ツモ処理
        if (currentPlayer.cancelDraw) {
            currentPlayer.cancelDraw = false;
        } else {
            currentPlayer.drawnTile = this.deck.pop();
        }

        this.updateTenpaiStatus();
        if (this.onStateChange) this.onStateChange();

        if (!currentPlayer.isPlayer) {
            this.executeCpuAction();
        }
    }

    tryCpuSkill(cpu) {
        const shouldUse = cpu.isTenpai || Math.random() < 0.3;
        if (shouldUse && Skills[cpu.character.skillId]) {
            cpu.skillUsed = true;
            const msg = Skills[cpu.character.skillId](this, cpu);
            
            // スキル発動による少牌を補填
            this.replenishTiles();
            
            if (this.onSkillUsed) this.onSkillUsed(cpu.character.name, msg);
        }
    }

    executeCpuAction() {
        setTimeout(() => {
            const cpu = this.players[this.currentPlayerIndex];
            
            // 手牌とツモを合流させて全所持牌を取得
            const allTiles = [...cpu.hand];
            if (cpu.drawnTile) {
                allTiles.push(cpu.drawnTile);
                cpu.drawnTile = null;
            }

            // 1. ツモ上がり判定（9枚手牌の組み合わせをチェック）
            if (allTiles.length >= 9) {
                let winRes = null;
                if (allTiles.length === 9) {
                    winRes = evaluateHand(allTiles);
                } else {
                    for (let i = 0; i < allTiles.length; i++) {
                        const testHand = [...allTiles];
                        testHand.splice(i, 1);
                        const res = evaluateHand(testHand);
                        if (res.isWin && (!winRes || res.score > winRes.score)) {
                            winRes = res;
                        }
                    }
                }

                if (winRes && winRes.isWin) {
                    const scoreChanges = this.applyWinScore(this.currentPlayerIndex, winRes, false);
                    if (this.onScoreChange) this.onScoreChange(scoreChanges);
                    if (this.onGameEnd) this.onGameEnd({ isDraw: false, winner: cpu, winRes, isRon: false });
                    return;
                }
            }

            // 2. CPUの捨て牌処理（手牌が8枚になるまで不要牌を捨てる）
            let lastDiscarded = null;

            while (allTiles.length > 8) {
                const tileScores = allTiles.map((tile, index) => {
                    let score = 0;
                    const sameCount = allTiles.filter(t => t.name === tile.name).length;
                    score += sameCount * 15;

                    if (typeof COMBINATION_DEFINITIONS !== 'undefined') {
                        let partOfCombo = 0;
                        COMBINATION_DEFINITIONS.forEach(combo => {
                            if (combo.tiles.includes(tile.name)) {
                                let matchCount = combo.tiles.filter(reqTile => allTiles.some(t => t.name === reqTile)).length;
                                partOfCombo += matchCount * 8;
                            }
                        });
                        score += partOfCombo;
                    }
                    score += Math.random() * 5;
                    return { index, score, tile };
                });

                tileScores.sort((a, b) => a.score - b.score);
                const dropIndex = tileScores[0].index;
                const discarded = allTiles.splice(dropIndex, 1)[0];
                
                this.discardPile.push(discarded);
                lastDiscarded = discarded;
            }

            cpu.hand = allTiles;
            cpu.drawnTile = null;
            cpu.hand.sort((a, b) => a.id.localeCompare(b.id));

            if (this.onCpuAction && lastDiscarded) {
                this.onCpuAction(cpu.character.name, lastDiscarded);
            }
            
            // 最後に捨てた牌に対してロン判定
            if (lastDiscarded) {
                this.checkRonAfterDiscard(lastDiscarded, this.currentPlayerIndex);
            } else {
                this.nextTurn();
            }
        }, 800);
    }

    // プレイヤーの捨て牌処理
    discardTile(index) {
        const player = this.players[0];
        if (this.currentPlayerIndex !== 0) {
            return { success: false, message: "あなたのターンではありません！" };
        }

        // --- 【修正】ツモ牌インデックス(-1)の安全な統合処理 ---
        if (player.drawnTile) {
            if (index === -1) {
                // ツモ切り指定(-1)の場合、統合後の配列の最後尾を参照するようにインデックスを上書き
                index = player.hand.length; 
            }
            player.hand.push(player.drawnTile);
            player.drawnTile = null;
        } else if (index === -1) {
            // UI上のフェイルセーフ等でツモ牌が無いのに-1が送られてきた場合、手札の最後尾を指定
            index = player.hand.length - 1;
        }

        // 捨てる牌が手牌の範囲内かチェック（修正によりここで弾かれなくなります）
        if (index < 0 || index >= player.hand.length) {
            return { success: false, message: "無効な牌が選択されました。" };
        }

        const targetTile = player.hand[index];

        if (this.forbidCategory && targetTile.category === this.forbidCategory) {
            return { success: false, message: `スキルにより「${this.forbidCategory}」は捨てられません！` };
        }

        // 牌を捨てて捨て牌置き場へ
        const discarded = player.hand.splice(index, 1)[0];
        this.discardPile.push(discarded);
        player.hand.sort((a, b) => a.id.localeCompare(b.id));

        // 手牌がまだ8枚より多い場合（スキルで多牌になっている場合）
        const remainingToDiscard = player.hand.length - 8;
        if (remainingToDiscard > 0) {
            // まだ捨てる必要がある場合はここで状態更新だけしてターンを進めない
            if (this.onStateChange) this.onStateChange();
            return { 
                success: true, 
                requireMoreDiscard: true, 
                remaining: remainingToDiscard,
                message: `あと ${remainingToDiscard} 枚捨ててください。`
            };
        }

        // ちょうど8枚になったらロン判定へ移行（自動でターンが進行します）
        this.checkRonAfterDiscard(discarded, 0);
        return { success: true, requireMoreDiscard: false };
    }

    // 捨て牌に対するロン（他家上がり）判定
    checkRonAfterDiscard(discardedTile, discarderIndex) {
        // プレイヤー自身がロン可能か判定
        if (discarderIndex !== 0) {
            const player = this.players[0];
            const ronResult = this.testRon(player.hand, discardedTile);
            if (ronResult.isWin) {
                this.pendingRon = {
                    discarderIndex,
                    discardedTile,
                    winnerIndex: 0,
                    winRes: ronResult
                };
                if (this.onStateChange) this.onStateChange();
                return; // プレイヤーの入力待ちへ
            }
        }

        // CPUたちのロン判定
        for (let i = 0; i < 4; i++) {
            if (i === discarderIndex || i === 0) continue;
            const cpu = this.players[i];
            const ronResult = this.testRon(cpu.hand, discardedTile);
            if (ronResult.isWin) {
                const scoreChanges = this.applyWinScore(i, ronResult, true, discarderIndex);
                if (this.onScoreChange) this.onScoreChange(scoreChanges);
                if (this.onGameEnd) this.onGameEnd({
                    isDraw: false,
                    winner: cpu,
                    winRes: ronResult,
                    isRon: true,
                    loser: this.players[discarderIndex]
                });
                return;
            }
        }

        // 誰もロンしなければ次のターンへ
        this.nextTurn();
    }

    testRon(hand, discardedTile) {
        // 手持ち8枚 + 相手の捨て牌1枚 = 9枚で上がり判定
        const testHand = [...hand, discardedTile];
        if (testHand.length === 9) {
            return evaluateHand(testHand);
        }
        return { isWin: false, score: 0 };
    }

    declarePlayerRon() {
        if (!this.pendingRon) return;
        const { discarderIndex, winRes } = this.pendingRon;
        const winner = this.players[0];
        const loser = this.players[discarderIndex];
        
        const scoreChanges = this.applyWinScore(0, winRes, true, discarderIndex);
        if (this.onScoreChange) this.onScoreChange(scoreChanges);
        
        const endData = {
            isDraw: false,
            winner: winner,
            winRes: winRes,
            isRon: true,
            loser: loser
        };
        this.pendingRon = null;
        if (this.onGameEnd) this.onGameEnd(endData);
    }

    passPlayerRon() {
        this.pendingRon = null;
        this.nextTurn();
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + this.turnDirection + 4) % 4;
        this.updateTenpaiStatus();
        if (this.onStateChange) this.onStateChange();
        this.startTurn();
    }

    useSkill() {
        const player = this.players[0];
        if (player.skillUsed) return { success: false, message: "既にスキルを使用しています！" };
        if (this.currentPlayerIndex !== 0) return { success: false, message: "自分のターンにのみ使用可能です！" };
        
        player.skillUsed = true;
        const skillFunc = Skills[player.character.skillId];
        
        if (skillFunc) {
            const resultMsg = skillFunc(this, player);
            
            // ▼ スキル発動による少牌を補填
            this.replenishTiles();
            
            this.updateTenpaiStatus();
            if (this.onStateChange) this.onStateChange();
            return { success: true, message: resultMsg };
        }
        return { success: false, message: "スキルが見つかりません" };
    }

    // ★ 新規追加: 少牌防止メソッド
    // スキルなどで手持ち牌が規定枚数を下回った場合、自動でドローして補填します
    replenishTiles() {
        this.players.forEach((p, index) => {
            // 基本の期待枚数は8枚
            let targetSize = 8;
            
            // 現在のターンプレイヤーの場合、ツモ完了時点であれば9枚が期待値
            if (index === this.currentPlayerIndex) {
                if (p.isPlayer) {
                    targetSize = 9; // プレイヤーの操作時は常にツモ後なので9
                } else {
                    targetSize = p.drawnTile ? 9 : 8; // CPUはツモ前(tryCpuSkill)なら8
                }
            }
            
            let currentSize = p.hand.length + (p.drawnTile ? 1 : 0);
            
            // 現在の枚数が期待枚数を下回っている場合、山札から自動補充
            while (currentSize < targetSize && this.deck.length > 0) {
                p.hand.push(this.deck.pop());
                currentSize++;
            }
            
            p.hand.sort((a, b) => a.id.localeCompare(b.id));
        });
    }

    // ツモ上がり判定（手持ち8枚 + ツモ1枚 = 9枚）
    checkWinAvailable() {
        const player = this.players[0];
        const allTiles = [...player.hand];
        if (player.drawnTile) allTiles.push(player.drawnTile);
        
        if (allTiles.length === 9) {
            return evaluateHand(allTiles).isWin;
        } else if (allTiles.length > 9) {
            for (let i = 0; i < allTiles.length; i++) {
                const testHand = [...allTiles];
                testHand.splice(i, 1);
                if (evaluateHand(testHand).isWin) return true;
            }
        }
        return false;
    }

    declareWin() {
        const player = this.players[0];
        if (this.currentPlayerIndex !== 0) {
            return { success: false, message: "自分のターンでのみ上がれます。" };
        }

        const allTiles = [...player.hand];
        if (player.drawnTile) allTiles.push(player.drawnTile);
        
        let bestWin = null;
        if (allTiles.length === 9) {
            bestWin = evaluateHand(allTiles);
        } else if (allTiles.length > 9) {
            for (let i = 0; i < allTiles.length; i++) {
                const testHand = [...allTiles];
                testHand.splice(i, 1);
                const res = evaluateHand(testHand);
                if (res.isWin && (!bestWin || res.score > bestWin.score)) {
                    bestWin = res;
                }
            }
        }
        
        if (bestWin && bestWin.isWin) {
            const scoreChanges = this.applyWinScore(0, bestWin, false);
            if (this.onScoreChange) this.onScoreChange(scoreChanges);
            if (this.onGameEnd) this.onGameEnd({ isDraw: false, winner: player, winRes: bestWin, isRon: false });
            return { success: true, isWin: true, yakuName: bestWin.yakuName, score: bestWin.score * player.scoreMultiplier };
        } else {
            return { success: true, isWin: false };
        }
    }

    // 点数分配
    applyWinScore(winnerIndex, winRes, isRon = false, discarderIndex = -1) {
        const winner = this.players[winnerIndex];
        const gainedScore = winRes.score * winner.scoreMultiplier;
        const scoreChanges = [0, 0, 0, 0];

        if (isRon && discarderIndex >= 0) {
            this.players[discarderIndex].score -= gainedScore;
            winner.score += gainedScore;
            scoreChanges[discarderIndex] = -gainedScore;
            scoreChanges[winnerIndex] = gainedScore;
        } else {
            const payEach = Math.ceil(gainedScore / 3);
            this.players.forEach((p, idx) => {
                if (idx === winnerIndex) {
                    p.score += payEach * 3;
                    scoreChanges[idx] = payEach * 3;
                } else {
                    p.score -= payEach;
                    scoreChanges[idx] = -payEach;
                }
            });
        }
        return scoreChanges;
    }
}