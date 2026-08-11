document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(255, 60, 60, 0.7); transform: scale(1); }
            50% { box-shadow: 0 0 15px 8px rgba(255, 60, 60, 0); transform: scale(1.05); }
            100% { box-shadow: 0 0 0 0 rgba(255, 60, 60, 0); transform: scale(1); }
        }
        .tenpai-pulse {
            animation: pulse-red 1.2s infinite;
            border: 3px solid #ff3c3c !important;
            border-radius: 8px;
        }
        .reach-text {
            color: #ff3c3c;
            font-weight: bold;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        #reach-cutin {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3.5rem;
            font-weight: 900;
            color: #ff2a2a;
            text-shadow: 3px 3px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0px 0px 20px #ffeb3b;
            z-index: 2000;
            pointer-events: none;
            opacity: 0;
            display: none;
            white-space: nowrap;
        }
        .show-cutin {
            display: block !important;
            animation: cutin-anim 2s ease-out forwards;
        }
        @keyframes cutin-anim {
            0% { transform: translate(-150vw, -50%) skewX(-20deg); opacity: 0; }
            15% { transform: translate(-50%, -50%) skewX(0); opacity: 1; }
            80% { transform: translate(-50%, -50%) skewX(0); opacity: 1; }
            100% { transform: translate(150vw, -50%) skewX(20deg); opacity: 0; }
        }
        .score-float {
            position: absolute;
            font-size: 1.8rem;
            font-weight: 900;
            pointer-events: none;
            z-index: 1500;
            animation: floatUp 1.8s ease-out forwards;
            text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff;
        }
        .score-plus { color: #10b981; }
        .score-minus { color: #ef4444; }
        @keyframes floatUp {
            0% { opacity: 0; transform: translateY(0) scale(0.8); }
            20% { opacity: 1; transform: translateY(-15px) scale(1.2); }
            80% { opacity: 1; transform: translateY(-35px) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(0.8); }
        }
        #ron-action-panel {
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: none;
            gap: 15px;
            background: rgba(0,0,0,0.85);
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            border: 2px solid #ffeb3b;
            animation: bounce 0.6s infinite alternate;
        }
        @keyframes bounce {
            from { transform: translateX(-50%) translateY(0); }
            to { transform: translateX(-50%) translateY(-8px); }
        }
    `;
    document.head.appendChild(style);

    const reachCutin = document.createElement('div');
    reachCutin.id = 'reach-cutin';
    document.body.appendChild(reachCutin);

    const ronPanel = document.createElement('div');
    ronPanel.id = 'ron-action-panel';
    ronPanel.innerHTML = `
        <span style="color: white; font-weight: bold; line-height: 2.2;">ロンできます！</span>
        <button id="player-ron-btn" class="btn primary" style="background: linear-gradient(45deg, #ff3c3c, #b91c1c); font-size: 1.1rem; padding: 6px 20px;">ロン！</button>
        <button id="player-pass-btn" class="btn secondary" style="font-size: 0.9rem; padding: 6px 15px;">パス</button>
    `;
    document.body.appendChild(ronPanel);

    let reachedPlayers = new Set();

    const titleScreen = document.getElementById('title-screen');
    const titleStartBtn = document.getElementById('title-start-btn');
    const charGrid = document.getElementById('character-grid');
    const startBtn = document.getElementById('start-btn');
    const selectionScreen = document.getElementById('character-selection');
    const gameScreen = document.getElementById('game-screen');
    
    let selectedCharId = null;
    const game = new DonjaraGame();

    // ==============================================================
    // ▼ 追加：画像付き役一覧を自動生成して表示するシステム ▼
    // ==============================================================
function generateYakuVisualList() {
        const container = document.getElementById('yaku-list-container');
        if (!container) return;

        const getTileImage = (tileName) => {
            const searchSource = (typeof TILES !== 'undefined') ? TILES : (game.deck || []);
            let tile = searchSource.find(t => t.name === tileName);
            if (!tile) tile = searchSource.find(t => t.name.includes(tileName) || tileName.includes(t.name));
            return tile && tile.image ? tile.image : null;
        };

        // スコア別に自動でグループ分け
        const groups = {
            40: { title: "【王道・ドラマチック役】各40点", desc: "高得点の強力な組み合わせ！", items: [] },
            30: { title: "【ギャップ・カオス役】各30点", desc: "一風変わった面白い組み合わせ！", items: [] },
            20: { title: "【テーマ・サブテーマ役】各20点", desc: "同じジャンルやテーマを集める！", items: [] }
        };

        // COMBINATION_DEFINITIONS から役のリストを自動読み込み
        if (typeof COMBINATION_DEFINITIONS !== 'undefined') {
            COMBINATION_DEFINITIONS.forEach(def => {
                if (groups[def.score]) {
                    groups[def.score].items.push({ name: def.name, tiles: def.tiles });
                }
            });
        }

        let html = `
        <div style="margin-bottom: 25px; padding: 10px; background: #fff8e7; border-radius: 8px;">
            <h3 style="color: var(--primary); margin-bottom: 5px;">【基本3枚セット役】10点</h3>
            <p style="font-size: 0.95rem; color: #555;">「同じ人物×3枚」「同じアイテム×3枚」「同じ衣装×3枚」のどれか</p>
        </div>`;

        // グループごとにHTMLを生成
        [40, 30, 20].forEach(score => {
            const group = groups[score];
            if (group.items.length === 0) return;
            
            html += `<h3 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-top: 20px;">${group.title}</h3>`;
            html += `<p style="font-size: 0.9rem; margin-top: 5px; margin-bottom: 15px; color: #666;">${group.desc}</p>`;
            html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; margin-bottom: 30px;">`;
            
            group.items.forEach(yaku => {
                html += `
                <div style="background: #ffffff; padding: 12px; border-radius: 12px; border: 2px solid #E0E0E0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center;">
                    <div style="font-weight: 900; margin-bottom: 10px; font-size: 0.95rem; color: #333; text-align: center;">${yaku.name}</div>
                    <div style="display: flex; gap: 6px; justify-content: center;">`;
                
                yaku.tiles.forEach(tileName => {
                    const imgSrc = getTileImage(tileName);
                    html += `
                        <div style="width: 48px; height: 70px; background: white; border: 2px solid #ccc; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 1px 1px 3px rgba(0,0,0,0.1);" title="${tileName}">
                            ${imgSrc 
                                ? `<img src="${imgSrc}" alt="${tileName}" style="width: 100%; height: 100%; object-fit: cover;">` 
                                : `<span style="font-size: 0.55rem; text-align: center; word-break: break-all; padding: 2px;">${tileName}</span>`}
                        </div>`;
                });
                
                html += `
                    </div>
                </div>`;
            });
            html += `</div>`;
        });

        // 9枚役（固定表示）
        html += `
        <h3 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-top: 30px;">【9枚全体役】</h3>
        <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">手牌9枚すべてを使って完成させる超強力な役！</p>
        <ul style="list-style-type: none; padding-left: 0; line-height: 1.8; font-size: 0.95rem; margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
            <li style="background: #fff0f5; padding: 12px; border-radius: 8px; border: 2px solid #ffb6c1;"><strong>👑 完全三位一体（300点）</strong><br>3セットすべてが40点の役で構成されている</li>
            <li style="background: #f0fff0; padding: 12px; border-radius: 8px; border: 2px solid #98fb98;"><strong>✨ 百鬼夜行 / 武器庫 / クローゼット（各100点）</strong><br>9枚すべてが「人物」/「アイテム」/「衣装」のみで構成されている</li>
        </ul>`;

        container.innerHTML = html;
    }

    // 画面が読み込まれたら自動で役一覧の画像を生成しておく
    generateYakuVisualList();
    // ==============================================================


    CHARACTERS.forEach(char => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.dataset.id = char.id;
        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}" class="char-image" onerror="this.src=''; this.alt='画像未設定'; this.style.backgroundColor='#ccc';">
            <h3>${char.name}</h3>
            <div class="skill-desc">
                <strong>【${char.skillName}】</strong><br>
                ${char.skillDesc}
            </div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCharId = char.id;
            startBtn.disabled = false;
        });
        charGrid.appendChild(card);
    });

    titleStartBtn.addEventListener('click', () => {
        titleScreen.classList.remove('active');
        selectionScreen.classList.add('active');
        if (!isBgmOn) {
            isBgmOn = true;
            bgmToggleBtn.textContent = 'ON';
            bgmPlayer.play().catch(e => console.log("BGM再生失敗", e));
        }
    });

    const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    const bgmPlayer = document.getElementById('bgm-player');
    const bgmVolume = document.getElementById('bgm-volume');
    const bgmTrackSelect = document.getElementById('bgm-track-select');
    let isBgmOn = false;

    bgmPlayer.volume = bgmVolume.value;
    bgmToggleBtn.addEventListener('click', () => {
        isBgmOn = !isBgmOn;
        if (isBgmOn) {
            bgmToggleBtn.textContent = 'ON';
            bgmPlayer.play().catch(e => { isBgmOn = false; bgmToggleBtn.textContent = 'OFF'; });
        } else {
            bgmToggleBtn.textContent = 'OFF';
            bgmPlayer.pause();
        }
    });

    bgmVolume.addEventListener('input', (e) => { bgmPlayer.volume = e.target.value; });
    bgmTrackSelect.addEventListener('change', (e) => { bgmPlayer.src = e.target.value; if (isBgmOn) bgmPlayer.play(); });

    startBtn.addEventListener('click', () => {
        if (!selectedCharId) return;
        
        const selectedChar = CHARACTERS.find(c => c.id === selectedCharId);
        document.getElementById('player-avatar').src = selectedChar.image;
        
        game.onStateChange = renderGameUI;
        game.onCpuAction = (cpuName, discardedTile) => {
            console.log(`${cpuName} が ${discardedTile.name} を捨てました`);
        };

        game.onSkillUsed = (cpuName, msg) => {
            showReachCutin(`✨ ${cpuName} スキル発動！`);
            setTimeout(() => {
                showModal(`✨ ${cpuName} のスキル発動！`, msg);
            }, 600);
        };

        game.onScoreChange = (scoreChanges) => {
            for (let i = 0; i < 4; i++) {
                const change = scoreChanges[i];
                if (change !== 0) {
                    showScoreFloat(i, change);
                }
            }
        };

        game.onGameEnd = (data) => {
            ronPanel.style.display = 'none';
            let title = '';
            let msg = '';
            
            if (data.isDraw) {
                title = '流局';
                msg = '山札がなくなりました！引き分けです。\n\n';
            } else {
                const winType = data.isRon ? `【ロン上がり（放銃: ${data.loser.character.name}）】` : '【ツモ上がり】';
                title = data.winner.isPlayer ? '🎉 あなたの勝利！ 🎉' : `😭 ${data.winner.character.name} の上がり！`;
                msg = `${winType}\n役: ${data.winRes.yakuName}\n点数: ${data.winRes.score}点\n\n`;
            }

            msg += '【現在のスコア】\n' + game.players.map(p => `${p.character.name}: ${p.score}点`).join('\n');

            setTimeout(() => {
                if (game.currentRound < game.maxRounds) {
                    showModal(title, msg, '次のラウンドへ', () => {
                        game.currentRound++;
                        game.initRound();
                    });
                } else {
                    showModal(title, msg, '最終結果を見る', () => {
                        showFinalRanking();
                    });
                }
            }, 1000);
        };

        function showFinalRanking() {
            const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
            let rankMsg = '';
            sortedPlayers.forEach((p, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '😩';
                rankMsg += `${medal} 第${index + 1}位: ${p.character.name} (${p.score}点)\n`;
            });
            
            if (sortedPlayers[0].isPlayer) {
                rankMsg += '\n🎊 優勝おめでとうございます！ 🎊';
            } else {
                rankMsg += '\n残念... 次は勝てるように頑張りましょう！';
            }

            showModal('🏆 最終順位発表 🏆', rankMsg, 'タイトルへ戻る', () => {
                location.reload();
            });
        }

        selectionScreen.classList.remove('active');
        gameScreen.classList.add('active');

        game.start(selectedChar);
    });

    function showReachCutin(text) {
        const cutin = document.getElementById('reach-cutin');
        cutin.textContent = text;
        cutin.classList.remove('show-cutin');
        void cutin.offsetWidth;
        cutin.classList.add('show-cutin');
    }

    function showScoreFloat(playerIndex, changeAmount) {
        const seat = document.getElementById(playerIndex === 0 ? 'player-0-seat' : `player-${playerIndex}-seat`);
        if (!seat) return;

        const floatEl = document.createElement('div');
        floatEl.className = `score-float ${changeAmount > 0 ? 'score-plus' : 'score-minus'}`;
        floatEl.textContent = `${changeAmount > 0 ? '+' : ''}${changeAmount}pt`;
        
        const rect = seat.getBoundingClientRect();
        floatEl.style.left = `${rect.left + rect.width / 2 - 30}px`;
        floatEl.style.top = `${rect.top + 10}px`;

        document.body.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 2000);
    }

    function renderGameUI() {
        const handContainer = document.getElementById('hand-tiles');
        const drawnContainer = document.getElementById('drawn-tile-area');
        const declareWinBtn = document.getElementById('declare-win-btn');
        const turnIndicator = document.getElementById('turn-indicator');
        const deckCountEl = document.getElementById('deck-count');
        const useSkillBtn = document.getElementById('use-skill-btn');
        
        if (deckCountEl) deckCountEl.textContent = game.deck.length;

        if (game.players[0].skillUsed) {
            useSkillBtn.disabled = true;
            useSkillBtn.style.opacity = '0.5';
        } else {
            useSkillBtn.disabled = false;
            useSkillBtn.style.opacity = '1';
        }

        if (game.discardPile.length === 0) {
            reachedPlayers.clear();
        }

        for (let i = 0; i < 4; i++) {
            const player = game.players[i];
            if (player.isTenpai && !reachedPlayers.has(i)) {
                reachedPlayers.add(i);
                showReachCutin(i === 0 ? 'あなた リーチ！' : `${player.character.name} リーチ！`);
            }
        }

        for (let i = 0; i < 4; i++) {
            const seat = document.getElementById(`player-${i}-seat`).querySelector('.seat-info');
            seat.classList.remove('active-turn');
        }

        if (game.currentPlayerIndex === 0) {
            turnIndicator.textContent = `Round ${game.currentRound} - あなたの番`;
            document.getElementById('player-0-seat').querySelector('.seat-info').classList.add('active-turn');
        } else {
            turnIndicator.textContent = `Round ${game.currentRound} - ${game.players[game.currentPlayerIndex].character.name}の番`;
            document.getElementById(`player-${game.currentPlayerIndex}-seat`).querySelector('.seat-info').classList.add('active-turn');
        }

        document.getElementById('player-status').innerHTML = `点数: ${game.players[0].score}pt ${game.players[0].isTenpai ? '<span class="reach-text">🔥リーチ!</span>' : ''}`;

        const playerAvatar = document.getElementById('player-avatar');
        if (game.players[0].isTenpai) {
            playerAvatar.classList.add('tenpai-pulse');
        } else {
            playerAvatar.classList.remove('tenpai-pulse');
        }

        for (let i = 1; i <= 3; i++) {
            const cpu = game.players[i];
            document.getElementById(`cpu${i}-name`).textContent = cpu.character.name;
            const avatar = document.getElementById(`cpu${i}-avatar`);
            avatar.src = cpu.character.image;

            if (cpu.isTenpai) {
                avatar.classList.add('tenpai-pulse');
            } else {
                avatar.classList.remove('tenpai-pulse');
            }

            const statusText = `${cpu.score}pt (${game.currentPlayerIndex === i ? '思考中' : '待機'})`;
            document.getElementById(`cpu${i}-status`).innerHTML = statusText + (cpu.isTenpai ? '<br><span class="reach-text">🔥リーチ!</span>' : '');
        }
        
        handContainer.innerHTML = '';
        drawnContainer.innerHTML = '';
        const isMyTurn = (game.currentPlayerIndex === 0);
        const me = game.players[0];

        const BASE_HAND_SIZE = 8;
        const isOverdrawn = me.hand.length > BASE_HAND_SIZE;
        const canDiscard = isMyTurn && (me.drawnTile !== null || isOverdrawn);

        // --- 打牌処理の判定ロジック強化 ---
        const handleDiscardAction = (tileIndex) => {
            let result = game.discardTile(tileIndex);

            // 多牌時にツモ切り(-1)が弾かれた場合の救済処理
            if (!result.success && tileIndex === -1 && isOverdrawn) {
                if (me.drawnTile) {
                    me.hand.push(me.drawnTile);
                    me.drawnTile = null;
                    result = game.discardTile(me.hand.length - 1);
                }
            }

            if (!result.success) {
                showModal('注意', result.message);
                return;
            }

            // 捨てた後の手札合計枚数（手札 + ツモ牌）
            const remainingCount = me.hand.length + (me.drawnTile ? 1 : 0);

            if (remainingCount > BASE_HAND_SIZE) {
                // まだ多牌状態（9枚以上）なら連続で捨てるためにUIを更新
                renderGameUI();
            } else {
                // 規定枚数（8枚）に戻った場合
                renderGameUI();
                // game.js 側で自動進行が停止している場合のセーフティ
                if (game.currentPlayerIndex === 0 && typeof game.nextTurn === 'function') {
                    game.nextTurn();
                }
            }
        };

        me.hand.forEach((tile, index) => {
            const el = createTileElement(tile, 'tile');
            if (canDiscard) { 
                el.classList.add('playable');
                el.addEventListener('click', () => handleDiscardAction(index));
            }
            handContainer.appendChild(el);
        });

        if (me.drawnTile) {
            const el = createTileElement(me.drawnTile, 'tile');
            el.classList.add('drawn-tile-highlight');
            if (canDiscard) { 
                el.classList.add('playable');
                el.addEventListener('click', () => handleDiscardAction(-1));
            }
            drawnContainer.appendChild(el);
        }

        declareWinBtn.style.display = (isMyTurn && game.checkWinAvailable()) ? 'block' : 'none';

        if (game.pendingRon && game.pendingRon.winnerIndex === 0) {
            ronPanel.style.display = 'flex';
        } else {
            ronPanel.style.display = 'none';
        }

        const discardPile = document.getElementById('discard-pile');
        discardPile.innerHTML = '';
        game.discardPile.forEach(tile => {
            const el = createTileElement(tile, 'discard-tile-mini');
            discardPile.appendChild(el);
        });
    }

    document.getElementById('player-ron-btn').addEventListener('click', () => {
        game.declarePlayerRon();
    });
    document.getElementById('player-pass-btn').addEventListener('click', () => {
        game.passPlayerRon();
    });

    function createTileElement(tile, className) {
        const div = document.createElement('div');
        div.className = className;
        
        let borderColor = '#E0E0E0';
        if (tile.category === CATEGORIES.PERSON) borderColor = '#ff8a80';
        if (tile.category === CATEGORIES.ITEM) borderColor = '#80deea';
        if (tile.category === CATEGORIES.COSTUME) borderColor = '#a5d6a7';
        div.style.borderColor = borderColor;

        if (tile.image) {
            const img = document.createElement('img');
            img.src = tile.image;
            img.alt = tile.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.onerror = () => {
                img.remove();
                div.textContent = tile.name;
                div.style.fontSize = className === 'discard-tile-mini' ? '0.4rem' : '0.6rem';
            };
            div.appendChild(img);
        } else {
            div.textContent = tile.name;
        }

        div.title = tile.name;
        return div;
    }

 document.getElementById('declare-win-btn').addEventListener('click', () => {
        const result = game.declareWin();
        if (!result.success) {
            showModal('注意', result.message);
        } else if (!result.isWin) {
            showModal('チョンボ！', '役が揃っていません...');
        }
    });

    const useSkillBtn = document.getElementById('use-skill-btn');
    useSkillBtn.addEventListener('click', () => {
        const result = game.useSkill();
        if (result.success) {
            showModal(`✨ スキル発動！ ✨`, result.message);
        } else {
            showModal('エラー', result.message);
        }
    });

    // ==========================================
    // ▼ 重複を解消したモーダル・終了処理 ▼
    // ==========================================
    const modalOverlay = document.getElementById('modal-overlay');
    let modalCallback = null; 
    let modalCallback2 = null; 

    // 最終順位発表と2つの選択肢
    function showFinalRanking() {
        const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
        let rankMsg = '';
        sortedPlayers.forEach((p, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '😩';
            rankMsg += `${medal} 第${index + 1}位: ${p.character.name} (${p.score}点)\n`;
        });
        
        if (sortedPlayers[0].isPlayer) {
            rankMsg += '\n🎊 優勝おめでとうございます！ 🎊';
        } else {
            rankMsg += '\n残念... 次は勝てるように頑張りましょう！';
        }

        showModal('🏆 最終順位発表 🏆', rankMsg, 
            'もう一度（同じキャラ）', () => {
                game.start(game.players[0].character);
            },
            'キャラ選択に戻る', () => {
                document.getElementById('game-screen').classList.remove('active');
                document.getElementById('character-selection').classList.add('active');
            }
        );
    }

    // 第2ボタンも扱えるように拡張した showModal
    function showModal(title, text, buttonText = "閉じる", callback = null, button2Text = null, callback2 = null) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').innerHTML = text.replace(/\n/g, '<br>');
        
        const btn1 = document.getElementById('modal-close');
        btn1.textContent = buttonText;
        modalCallback = callback;

        const btn2 = document.getElementById('modal-btn-2');
        if (button2Text) {
            btn2.style.display = 'inline-block';
            btn2.textContent = button2Text;
            modalCallback2 = callback2;
        } else {
            btn2.style.display = 'none';
            modalCallback2 = null;
        }

        modalOverlay.classList.add('show');
    }
    
    // フリーズ解消：アニメーション完了（約0.3秒）を待ってから次の処理を動かす
    document.getElementById('modal-close').addEventListener('click', () => {
        modalOverlay.classList.remove('show');
        if (modalCallback) {
            const cb = modalCallback;
            modalCallback = null; 
            setTimeout(cb, 300); // アニメーションを待つ
        }
    });

    document.getElementById('modal-btn-2').addEventListener('click', () => {
        modalOverlay.classList.remove('show');
        if (modalCallback2) {
            const cb = modalCallback2;
            modalCallback2 = null; 
            setTimeout(cb, 300); // アニメーションを待つ
        }
    });
}); // <-- main.js は必ずこの閉じカッコで終わります