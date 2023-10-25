import { GetCharacter } from '../dist/CharacterLoader.js';
import { CreateExpList } from '../dist/ExpCalculationManager.js';
import test from 'ava';
import ayaka from '../parameters/partner/ayaka.json' assert { type: 'json' };
const expTable = CreateExpList(ayaka.params.map(i => i.exp));

const OKTestData = {
    element: ['shine', 'fire'],
    name: 'あやか',
    parameter: {
        attack: 144,
        cleverness: 328,
        defence: 1085,
        exp: 36,
        hp: 1232,
        level: 18,
        magicattack: 151,
        magiccure: 298,
        magicdefence: 1089,
        mp: 501,
        speed: 144,
    },
};

test('Character Loader Test/ok', t => {
    t.deepEqual(GetCharacter.FromExp('ayaka', 'partner', expTable[17]), OKTestData);
    t.deepEqual(GetCharacter.FromLevel('ayaka', 'partner', 18), OKTestData);
});

test('Character Loader Test/id error', t => {
    t.is(GetCharacter.FromExp('naoto', 'partner', 0), null);
});

test('Character Loader Test/level error', t => {
    t.is(GetCharacter.FromLevel('ayaka', 'partner', 106), null);
});

test('Character Loader Test/no exp record', t => {
    t.is(GetCharacter.FromExp('satan', 'enemy', 0), null);
});
