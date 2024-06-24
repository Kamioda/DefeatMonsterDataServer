import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, parse } from 'node:path';
import { readJson } from 'nodeeasyfileio';

export function EnumCharacters(CharacterType: string): { name: string; key: string }[] {
    const CharacterDataDir = `./parameters/${CharacterType}/`;
    const Files = readdirSync(CharacterDataDir).map(i => join(CharacterDataDir, i));
    return Files.filter(i => {
        const stats = statSync(i);
        return stats.isFile() && parse(i).ext === '.json';
    }).map(i => {
        const CharacterProfile = readJson(i);
        return {
            name: CharacterProfile['name'],
            key: basename(i, '.json'),
        };
    });
}

export interface Magic {
    name: string;
    id: string;
    mp: {
        use: number;
        less: number;
    };
    basepower: number;
    element: string;
    effect: {
        graphic: {
            file: string;
            blend: number;
            trans: boolean;
        };
        sound: string;
    };
    range: boolean;
    allow?: string[];
}

interface MagicDataFile {
    magics: Magic[];
}

export function GetMagic(MaxMP: number, CharacterType: string) {
    const AttackMagic = JSON.parse(readFileSync('./magics/attack.json', 'utf-8')) as MagicDataFile;
    const CureMagic = JSON.parse(readFileSync('./magics/cure.json', 'utf-8')) as MagicDataFile;
    return {
        attack: AttackMagic.magics.filter(
            i => i.mp.less <= MaxMP && (i.allow ? i.allow.includes(CharacterType) : true)
        ),
        cure: CureMagic.magics.filter(i => i.mp.less <= MaxMP && (i.allow ? i.allow.includes(CharacterType) : true)),
    };
}
