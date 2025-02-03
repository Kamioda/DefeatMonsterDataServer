import { readFileSync } from 'fs';
import { ResCharacterStatus, CharacterBaseStatus } from './CharacterLoader.js';

type CharacterMagnificationInformation = {
    boy: Partial<CharacterBaseStatus>;
    girl: Partial<CharacterBaseStatus>;
    boygirl: Partial<CharacterBaseStatus>;
    guygirl: Partial<CharacterBaseStatus>;
};

export function AdjustByGender(Gender: string, BaseParam: ResCharacterStatus): ResCharacterStatus {
    const AllMagnificationData: CharacterMagnificationInformation = JSON.parse(
        readFileSync('./parameters/magnification.json', 'utf-8')
    ) as CharacterMagnificationInformation;
    if (!Object.keys(AllMagnificationData).includes(Gender)) return BaseParam;
    const Res: ResCharacterStatus = BaseParam;
    const MagnificationData: Partial<CharacterBaseStatus> = AllMagnificationData[Gender];
    Object.keys(MagnificationData).forEach(i => {
        if (MagnificationData[i] !== null) Res[i] = Math.floor((Res[i] * MagnificationData[i]) / 100);
    });
    return Res;
}
