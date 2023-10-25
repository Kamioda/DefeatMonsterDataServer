import { existsSync, readFileSync } from 'fs';
import { GetLevel } from './ExpCalculationManager.js';

export interface CharacterStatus {
    attack: number;
    cleverness: number;
    defence: number;
    exp: number;
    hp: number;
    level: number;
    magicattack: number;
    magiccure: number;
    magicdefence: number;
    mp: number;
    speed: number;
}

interface CharacterInformation {
    name: string;
    element: string[];
    params: CharacterStatus[];
}

export interface CharacterSearchResult {
    name: string;
    element: string[];
    parameter: CharacterStatus;
}

function InternalGetCharacter(
    CharacterID: string,
    CharacterType: string,
    NumParameter: number,
    GetLevelProcess:
        | ((NumParam: number) => number)
        | ((NumParam: number, CharacterData: CharacterInformation) => number)
): CharacterSearchResult | null {
    const FilePath = `./parameters/${CharacterType}/${CharacterID}.json`;
    if (existsSync(FilePath)) {
        const Data: CharacterInformation = JSON.parse(readFileSync(FilePath, 'utf-8')) as CharacterInformation;
        const Level = GetLevelProcess(NumParameter, Data);
        const ParameterData = Data.params.find(i => i.level === Level);
        if (ParameterData === undefined) return null;
        return {
            name: Data.name,
            element: Data.element,
            parameter: ParameterData,
        };
    }
    return null;
}

export const GetCharacter = {
    FromExp: (CharacterID: string, CharacterType: string, Exp: number) => {
        return InternalGetCharacter(CharacterID, CharacterType, Exp, (Exp, Data) => {
            if (Data.params.some(i => i.exp == null)) return -1;
            return GetLevel(
                Exp,
                Data.params.map(i => i.exp)
            )
        });
    },
    FromLevel: (CharacterID: string, CharacterType: string, Level: number) => {
        return InternalGetCharacter(CharacterID, CharacterType, Level, (lv: number) => lv);
    },
};
