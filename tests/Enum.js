import { EnumCharacters, GetMagic } from '../dist/Enum.js';
import test from 'ava';

test('Enum/partner characters', t => {
    const Expected = [
        { name: 'あやか', key: 'ayaka' },
        { name: 'ことは', key: 'kotoha' },
        { name: 'みさき', key: 'misaki' },
        { name: 'みゆき', key: 'miyuki' },
    ];
    const Result = EnumCharacters('partner');
    t.deepEqual(Result, Expected);
});

test('Enum allowed magics', t => {
    const Magics = GetMagic(200, 'player');
    const Expected = {
        attack: [
            {
                name: 'ファイヤー',
                id: 'amfire',
                mp: { use: 4, less: 100 },
                basepower: 50,
                element: 'fire',
                effect: { graphic: { file: 'fire.png', blend: -1, trans: true }, sound: 'fire.wav' },
                range: false,
            },
            {
                name: 'アイスクリスタル',
                id: 'amice',
                mp: { use: 7, less: 170 },
                basepower: 75,
                element: 'ice',
                effect: { graphic: { file: 'ice.png', blend: -1, trans: true }, sound: 'ice.mp3' },
                range: false,
            },
            {
                name: 'アーススパイク',
                id: 'amearth',
                mp: { use: 8, less: 190 },
                basepower: 80,
                element: 'earth',
                effect: { graphic: { file: 'earth.png', blend: -1, trans: true }, sound: 'earth_spike.mp3' },
                range: false,
            },
            {
                name: 'ストーム',
                id: 'amstorm',
                mp: { use: 16, less: 200 },
                basepower: 100,
                element: 'wind',
                effect: { graphic: { file: 'wind.png', blend: -1, trans: true }, sound: 'wind.mp3' },
                range: false,
            },
        ],
        cure: [
            {
                name: 'ヒール',
                id: 'scmheal',
                mp: { use: 2, less: 30 },
                basepower: 30,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: false,
                resurrection: false,
            },
            {
                name: 'ケア',
                id: 'scmcare',
                mp: { use: 4, less: 60 },
                basepower: 50,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: false,
                resurrection: false,
            },
            {
                name: 'ケアル',
                id: 'scmcarel',
                mp: { use: 7, less: 120 },
                basepower: 100,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: false,
                resurrection: false,
            },
            {
                name: 'スーパーケアル',
                id: 'scmscarel',
                mp: { use: 15, less: 180 },
                basepower: 140,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: false,
                resurrection: false,
            },
            {
                name: 'ヒーリング',
                id: 'rcmheal',
                mp: { use: 10, less: 110 },
                basepower: 30,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: true,
                resurrection: false,
                allow: ['player', 'partner'],
            },
            {
                name: 'ケアリング',
                id: 'rcmcare',
                mp: { use: 15, less: 160 },
                basepower: 80,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: true,
                resurrection: false,
                allow: ['player', 'partner'],
            },
            {
                name: 'エクステンドケアルリング',
                id: 'rcmexcarel',
                mp: { use: 39, less: 39 },
                basepower: 210,
                element: 'shine',
                effect: { graphic: { file: 'cure.png', blend: -1, trans: true }, sound: 'cure.mp3' },
                range: true,
                resurrection: true,
                allow: ['player'],
            },
        ],
    };
    t.deepEqual(Magics, Expected);
});
