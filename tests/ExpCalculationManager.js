import { GetLevel, CreateExpList, InternalGetLevel } from '../dist/ExpCalculationManager.js';
import test from 'ava';
import { readJson } from 'nodeeasyfileio';
const ayaka = readJson('./parameters/partner/ayaka.json');
const expTable = ayaka.params.map(i => i.exp);

test('Create Exp list test', t => {
    const copyData = expTable;
    copyData.sort((a, b) => a - b);
    const Table = CreateExpList(expTable);
    Table.forEach((i, index) => {
        const Expect = copyData.slice(0, index + 1).reduce((sum, element) => sum + element);
        t.is(i, Expect, `index: ${index}`);
    });
});

test('Exp calculation test/error', t => {
    const ExpTable = CreateExpList(expTable);
    t.is(InternalGetLevel(0, ExpTable, 50, 99), 0);
    t.is(InternalGetLevel(ExpTable[99], ExpTable, 0, 40), 0);
});

test('Exp calculation test/start', t => {
    t.is(GetLevel(0, expTable), 1);
});

test('Exp calculation test/minus', t => {
    t.is(GetLevel(-1, expTable), 1);
});

test('Exp calculation test/over', t => {
    t.is(GetLevel(CreateExpList(expTable)[99] + 1, expTable), 100);
});

test('Exp calculation test/on border', t => {
    t.is(GetLevel(CreateExpList(expTable)[10], expTable), 11);
});

test('Exp calculation test/on border after split', t => {
    t.is(GetLevel(CreateExpList(expTable)[24], expTable), 25);
});

test('Exp calculation test/under border', t => {
    t.is(GetLevel(CreateExpList(expTable)[10] - 1, expTable), 10);
});
