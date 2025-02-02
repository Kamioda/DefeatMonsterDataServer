import { APIServer as server } from '../dist/server.js';
import { GetMagic } from '../dist/Enum.js';
import { GetCharacter } from '../dist/CharacterLoader.js';
import test from 'ava';
import request from 'supertest';

test('Get characters/ok', async t => {
    const res = await request(server()).get('/character/partner').send();
    t.deepEqual(res.body, {
        characters: [
            { name: 'あやか', key: 'ayaka' },
            { name: 'ことは', key: 'kotoha' },
            { name: 'みさき', key: 'misaki' },
            { name: 'みゆき', key: 'miyuki' },
        ],
    });
});

test('Get characters/no type', async t => {
    const res = await request(server()).get('/character/observer').send();
    t.is(res.status, 404);
});

test('Get character/from level/valid 1', async t => {
    const TargetCharacter = {
        id: 'misaki',
        type: 'partner',
        level: 79,
    };
    const Parameter = {
        lv1: GetCharacter.FromLevel(TargetCharacter.id, TargetCharacter.type, 1),
        target: GetCharacter.FromLevel(TargetCharacter.id, TargetCharacter.type, TargetCharacter.level),
    };
    const Expect = {
        ...Parameter.target,
        magic: GetMagic(Parameter.lv1.parameter.mp, TargetCharacter.type),
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level })
        .send();
    t.deepEqual(res.body, Expect);
});

test('Get character/from level/valid 2', async t => {
    const TargetCharacter = {
        id: 'balance',
        type: 'player',
        gender: 'girl',
        level: 79,
    };
    const Parameter = GetCharacter.FromLevel(
        TargetCharacter.id,
        TargetCharacter.type,
        TargetCharacter.level,
        TargetCharacter.gender
    );
    if (Parameter == null) return t.fail();
    const Expect = {
        ...Parameter,
        magic: GetMagic(Parameter.parameter.mp, TargetCharacter.type),
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level, gender: TargetCharacter.gender })
        .send();
    t.deepEqual(res.body, Expect);
});

test('Get character/from level/invalid 1', async t => {
    const TargetCharacter = {
        id: 'ayaka',
        type: 'partner',
        level: 104,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level })
        .send();
    t.is(res.status, 404);
});

test('Get character/from level/invalid 2', async t => {
    const TargetCharacter = {
        id: 'ayaka',
        type: 'partner',
        level: 'lv10',
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level })
        .send();
    t.is(res.status, 400);
});

test('Get character/from exp/valid 1', async t => {
    const TargetCharacter = {
        id: 'miyuki',
        type: 'partner',
        exp: 1075,
    };
    const Parameter = {
        lv1: GetCharacter.FromLevel(TargetCharacter.id, TargetCharacter.type, 1),
        target: GetCharacter.FromExp(TargetCharacter.id, TargetCharacter.type, TargetCharacter.exp),
    };
    const Expect = {
        ...Parameter.target,
        magic: GetMagic(Parameter.lv1.parameter.mp, TargetCharacter.type),
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp })
        .send();
    t.deepEqual(res.body, Expect);
});

test('Get character/from exp/valid 2', async t => {
    const TargetCharacter = {
        id: 'balance',
        type: 'player',
        gender: 'boy',
        exp: 1075,
    };
    const Parameter = GetCharacter.FromExp(
        TargetCharacter.id,
        TargetCharacter.type,
        TargetCharacter.exp,
        TargetCharacter.gender
    );
    if (Parameter == null) return t.fail();
    const Expect = {
        ...Parameter,
        magic: GetMagic(Parameter.parameter.mp, TargetCharacter.type),
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp, gender: TargetCharacter.gender })
        .send();
    t.deepEqual(res.body, Expect);
});

test('Get character/from exp/invalid 1', async t => {
    const TargetCharacter = {
        id: 'kotoha',
        type: 'partner',
        exp: -1,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp })
        .send();
    t.is(res.status, 400);
});

test('Get character/from exp/invalid 2', async t => {
    const TargetCharacter = {
        id: 'kotoha',
        type: 'partner',
        exp: 'exp10',
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp })
        .send();
    t.is(res.status, 400);
});

test('Get character/double query', async t => {
    const TargetCharacter = {
        id: 'ayaka',
        type: 'partner',
        level: 79,
    };
    const Parameter = {
        lv1: GetCharacter.FromLevel(TargetCharacter.id, TargetCharacter.type, 1),
        target: GetCharacter.FromLevel(TargetCharacter.id, TargetCharacter.type, TargetCharacter.level),
    };
    const Expect = {
        ...Parameter.target,
        magic: GetMagic(Parameter.lv1.parameter.mp, TargetCharacter.type),
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level, exp: 1071 })
        .send();
    t.deepEqual(res.body, Expect);
});

test('Get character/non query', async t => {
    const TargetCharacter = {
        id: 'miyuki',
        type: 'partner',
    };
    const res = await request(server()).get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`).send();
    t.is(res.status, 400);
});

test('Get character/from level/combination error 1', async t => {
    const TargetCharacter = {
        id: 'misaki',
        type: 'player',
        level: 79,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level })
        .send();
    t.is(res.status, 404);
});

test('Get character/from level/combination error 2', async t => {
    const TargetCharacter = {
        id: 'misaki',
        type: 'observer',
        level: 79,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level })
        .send();
    t.is(res.status, 404);
});

test('Get character/from exp/combination error 1', async t => {
    const TargetCharacter = {
        id: 'kotoha',
        type: 'player',
        exp: 1075,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp })
        .send();
    t.is(res.status, 404);
});

test('Get character/from exp/combination error 2', async t => {
    const TargetCharacter = {
        id: 'kotoha',
        type: 'observer',
        exp: 1075,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp })
        .send();
    t.is(res.status, 404);
});

test('Get character/from level/no character', async t => {
    const TargetCharacter = {
        id: 'izumi',
        type: 'player',
        level: 79,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ level: TargetCharacter.level })
        .send();
    t.is(res.status, 404);
});

test('Get character/from exp/no character', async t => {
    const TargetCharacter = {
        id: 'nene',
        type: 'player',
        exp: 1075,
    };
    const res = await request(server())
        .get(`/character/${TargetCharacter.type}/${TargetCharacter.id}`)
        .query({ exp: TargetCharacter.exp })
        .send();
    t.is(res.status, 404);
});
