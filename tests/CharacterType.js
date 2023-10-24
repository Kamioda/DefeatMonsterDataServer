import { ValidCharacterType } from '../dist/CharacterType.js';
import test from 'ava';

test('Character Type Check', t => {
    t.true(ValidCharacterType('player'));
    t.true(ValidCharacterType('partner'));
    t.true(ValidCharacterType('enemy'));
    t.false(ValidCharacterType('observer'));
});
