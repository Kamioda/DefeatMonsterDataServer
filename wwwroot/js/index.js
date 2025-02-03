toastr.options = {
    timeOut: 3000, // 3秒
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-bottom-right',
    preventDuplicates: false,
    showDuration: '300',
    hideDuration: '1000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
};

const CharacterViewer = {
    /**
     * @type {string}
     */
    character_type: '',
    /**
     * @type {{ player: {name: string, key: string}[], partner: {name: string, key: string}[], enemy: {name: string, key: string}[]}}
     */
    character_list: {
        player: [],
        partner: [],
        enemy: [],
    },
    /**
     * @type {number}
     */
    level: 1,
    /**
     * @type {string}
     */
    view_target_character_id: '',
    /**
     * @type {string}
     */
    gender: '',
    /**
     * @type {{ name: string, element: string[], parameter: { attack: number, defence: number, exp: number, hp: number, level: number, magicattack: number, magiccure: number, magicdefence: number, mp: number, speed: number}, magic: { attack: string[], cure: string[] }} | null}
     */
    parameter: null,
    oninit: () => {
        const Promises = [
            fetch('/api/v1/character/player')
                .then(res => res.json())
                .then(data => {
                    CharacterViewer.character_list.player = data.characters;
                }),
            fetch('/api/v1/character/partner')
                .then(res => res.json())
                .then(data => {
                    CharacterViewer.character_list.partner = data.characters;
                }),
            fetch('/api/v1/character/enemy')
                .then(res => res.json())
                .then(data => {
                    CharacterViewer.character_list.enemy = data.characters;
                }),
        ];
        Promise.all(Promises);
    },
    view: () => {
        return m('div.container', [
            m('div#target_selector', [
                m('section', [
                    m('label', { for: 'characterType' }, '種類:'),
                    m(
                        'select#characterType',
                        {
                            value: CharacterViewer.character_type,
                            onchange: e => {
                                const BeforeCharacterType = CharacterViewer.character_type;
                                if (BeforeCharacterType === e.target.value) return;
                                CharacterViewer.character_type = e.target.value;
                                CharacterViewer.view_target_character_id =
                                    CharacterViewer.character_list[e.target.value][0].key;
                            },
                        },
                        [
                            m('option', { value: 'player' }, 'プレイヤー'),
                            m('option', { value: 'partner' }, 'パートナーキャラクター'),
                            m('option', { value: 'enemy' }, 'モンスター'),
                        ]
                    ),
                ]),
                m('section', [
                    m(
                        'label',
                        { for: 'character_name' },
                        CharacterViewer.character_type === 'player' ? '戦闘スタイル:' : 'キャラクター名:'
                    ),
                    m(
                        'select#character_name',
                        {
                            value: CharacterViewer.view_target_character_id,
                            onchange: e => {
                                CharacterViewer.view_target_character_id = e.target.value;
                            },
                        },
                        CharacterViewer.character_type.length === 0
                            ? []
                            : CharacterViewer.character_list[CharacterViewer.character_type].map(character =>
                                  m('option', { value: character.key }, character.name)
                              )
                    ),
                ]),
                m('section', [
                    m('label', { for: 'level' }, 'レベル:'),
                    m(
                        'select#level',
                        {
                            value: CharacterViewer.level,
                            onchange: e => {
                                CharacterViewer.level = e.target.value;
                            },
                        },
                        [...Array(100).keys()].map(i => m('option', { value: i + 1 }, i + 1))
                    ),
                ]),
                m(
                    'section',
                    {
                        style: { display: CharacterViewer.character_type === 'player' ? 'block' : 'none' },
                    },
                    [
                        m(
                            'label',
                            {
                                for: 'gender',
                            },
                            '性別:'
                        ),
                        m(
                            'select#gender',
                            {
                                value: CharacterViewer.gender,
                                onchange: e => {
                                    CharacterViewer.gender = e.target.value;
                                },
                            },
                            [
                                m('option', { value: 'boy' }, '男の子'),
                                m('option', { value: 'girl' }, '女の子'),
                                m('option', { value: 'girlboy' }, '男の娘'),
                                m('option', { value: 'guygirl' }, '漢女'),
                            ]
                        ),
                    ]
                ),
                m(
                    'button',
                    {
                        onclick: () => {
                            const IsNullOrEmpty = value => value == null || value === '';
                            if (
                                IsNullOrEmpty(CharacterViewer.character_type) ||
                                IsNullOrEmpty(CharacterViewer.view_target_character_id)
                            ) {
                                toastr['error']('キャラクターを選択してください');
                                return;
                            }
                            if (CharacterViewer.character_type === 'player' && IsNullOrEmpty(CharacterViewer.gender)) {
                                toastr['error']('性別を選択してください');
                                return;
                            }
                            const Queries = new URLSearchParams({
                                level: CharacterViewer.level,
                                gender:
                                    CharacterViewer.character_type === 'player' ? CharacterViewer.gender : undefined,
                            });
                            fetch(
                                `/api/v1/character/${CharacterViewer.character_type}/${CharacterViewer.view_target_character_id}?${Queries}`
                            )
                                .then(res => res.json())
                                .then(data => {
                                    CharacterViewer.parameter = {
                                        name: data.name,
                                        element: data.element,
                                        parameter: data.parameter,
                                        magic: {
                                            attack: data.magic.attack.map(magic => magic.name),
                                            cure: data.magic.cure.map(magic => magic.name),
                                        },
                                    };
                                });
                        },
                    },
                    '表示'
                ),
            ]),
            m(
                'div#parameter_view',
                {
                    style: { display: CharacterViewer.parameter ? 'block' : 'none' },
                },
                [
                    m('section', [
                        m('h4', 'ステータス'),
                        m('table', [
                            m('tr', [
                                m('th', '属性'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.element.join(', ') : 0),
                            ]),
                            m('tr', [
                                m('th', 'レベル'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.level : 0),
                            ]),
                            m('tr', [
                                m('th', 'HP'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.hp : 0),
                            ]),
                            m('tr', [
                                m('th', 'MP'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.mp : 0),
                            ]),
                            m('tr', [
                                m('th', '攻撃力'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.attack : 0),
                            ]),
                            m('tr', [
                                m('th', '守備力'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.defence : 0),
                            ]),
                            m('tr', [
                                m('th', '魔法攻撃力'),
                                m(
                                    'td',
                                    CharacterViewer.parameter ? CharacterViewer.parameter.parameter.magicattack : 0
                                ),
                            ]),
                            m('tr', [
                                m('th', '魔法守備力'),
                                m(
                                    'td',
                                    CharacterViewer.parameter ? CharacterViewer.parameter.parameter.magicdefence : 0
                                ),
                            ]),
                            m('tr', [
                                m('th', '魔法回復力'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.magiccure : 0),
                            ]),
                            m('tr', [
                                m('th', '素早さ'),
                                m('td', CharacterViewer.parameter ? CharacterViewer.parameter.parameter.speed : 0),
                            ]),
                        ]),
                    ]),
                    m('section', [
                        m('h4', '使用可能な攻撃魔法'),
                        CharacterViewer.parameter && CharacterViewer.parameter.magic.attack.length > 0
                            ? m(
                                  'ul',
                                  CharacterViewer.parameter
                                      ? CharacterViewer.parameter.magic.attack.map(magic => m('li', magic))
                                      : []
                              )
                            : m('p', '使用可能な攻撃魔法はありません'),
                    ]),
                    m('section', [
                        m('h4', '使用可能な回復魔法'),
                        CharacterViewer.parameter && CharacterViewer.parameter.magic.cure.length > 0
                            ? m(
                                  'ul',
                                  CharacterViewer.parameter
                                      ? CharacterViewer.parameter.magic.cure.map(magic => m('li', magic))
                                      : []
                              )
                            : m('p', '使用可能な回復魔法はありません'),
                    ]),
                    m('section', [
                        m(
                            'p',
                            '※本ゲームで使える魔法は、プレイヤーは現在レベルでの最大ＭＰ、それ以外はレベル１の最大ＭＰで判定されます。'
                        ),
                    ]),
                ]
            ),
        ]);
    },
};

m.mount(document.getElementsByTagName('main')[0], CharacterViewer);
