import { existsSync } from 'fs';
import { GetLevel } from './ExpCalculationManager.js';
import { AdjustByGender } from './GenderMagnification.js';
import { readJson } from 'nodeeasyfileio';

export type CharacterBaseStatus = {
    attack: number;
    cleverness: number;
    defence: number;
    hp: number;
    magicattack: number;
    magiccure: number;
    magicdefence: number;
    mp: number;
    speed: number;
}

export type ResCharacterStatus = CharacterBaseStatus & {
    level: number;
}

export type CharacterStatus = ResCharacterStatus & {
    exp?: number;
}

type CharacterInformation = {
    name: string;
    element: string[];
    params: CharacterStatus[];
}

export type CharacterSearchResult = {
    name: string;
    element: string[];
    parameter: ResCharacterStatus;
}

function InternalGetCharacter(
    CharacterID: string,
    CharacterType: string,
    NumParameter: number,
    GetLevelProcess:
        | ((NumParam: number) => number)
        | ((NumParam: number, CharacterData: CharacterInformation) => number),
    Gender?: string
): CharacterSearchResult | null {
    const FilePath = `./parameters/${CharacterType}/${CharacterID}.json`;
    if (existsSync(FilePath)) {
        const Data: CharacterInformation = readJson<CharacterInformation>(FilePath);
        const Level = GetLevelProcess(NumParameter, Data);
        let ParameterData = Data.params.find(i => i.level === Level);
        if (ParameterData === undefined) return null;
        if (CharacterType === 'player') {
            if (Gender === undefined) return null;
            ParameterData = AdjustByGender(Gender, ParameterData);
        }
        const Res = {
            name: Data.name,
            element: Data.element,
            parameter: ParameterData,
        };
        if (Res.parameter.exp) delete Res.parameter.exp;
        return Res;
    }
    return null;
}

export const GetCharacter = {
    FromExp: (CharacterID: string, CharacterType: string, Exp: number, Gender?: string) => {
        return InternalGetCharacter(
            CharacterID,
            CharacterType,
            Exp,
            (Exp, Data) => {
                if (Data.params.some(i => i.exp == null)) return -1;
                return GetLevel(Exp, Data.params.map(i => i.exp) as number[]);
            },
            Gender
        );
    },
    FromLevel: (CharacterID: string, CharacterType: string, Level: number, Gender?: string) => {
        return InternalGetCharacter(CharacterID, CharacterType, Level, (lv: number) => lv, Gender);
    },
};
