import mg from '../parameters/magnification.json' assert { type: 'json' };
import { AdjustByGender } from '../dist/GenderMagnification.js';
import test from 'ava';

test('magnification test/gender ok', t => {
    const Parameter = {
        level: 1,
        hp: 410,
        mp: 158,
        attack: 189,
        defence: 177,
        magicattack: 189,
        magicdefence: 177,
        magiccure: 175,
        speed: 90,
        cleverness: 181,
    };
    const Expect = {
        level: 1,
        hp: Math.floor((Parameter.hp * (mg.boy.hp ?? 100)) / 100),
        mp: Math.floor((Parameter.mp * (mg.boy.mp ?? 100)) / 100),
        attack: Math.floor((Parameter.attack * (mg.boy.attack ?? 100)) / 100),
        defence: Math.floor((Parameter.defence * (mg.boy.defence ?? 100)) / 100),
        magicattack: Math.floor((Parameter.magicattack * (mg.boy.magicattack ?? 100)) / 100),
        magicdefence: Math.floor((Parameter.magicdefence * (mg.boy.magicdefence ?? 100)) / 100),
        magiccure: Math.floor((Parameter.magiccure * (mg.boy.magiccure ?? 100)) / 100),
        speed: Math.floor((Parameter.speed * (mg.boy.speed ?? 100)) / 100),
        cleverness: Math.floor((Parameter.cleverness * (mg.boy.cleverness ?? 100)) / 100),
    };
    t.deepEqual(AdjustByGender('boy', Parameter), Expect);
});

test('magnification test/gender ng', t => {
    const Parameter = {
        level: 1,
        hp: 410,
        mp: 158,
        attack: 189,
        defence: 177,
        magicattack: 189,
        magicdefence: 177,
        magiccure: 175,
        speed: 90,
        cleverness: 181,
    };
    t.deepEqual(AdjustByGender('unknown', Parameter), Parameter);
});
