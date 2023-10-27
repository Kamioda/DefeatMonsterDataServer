import express from 'express';
import { CharacterSearchResult, GetCharacter } from './CharacterLoader.js';
import { EnumCharacters, GetMagic } from './Enum.js';
import { ValidCharacterType } from './CharacterType.js';
import cors from 'cors';
const NumReg = /^\d{1,}$/;

export const server = () => {
    const app = express();
    app.use(cors());
    app.get('/character/:character_type', (req, res) => {
        if (!ValidCharacterType(req.params.character_type)) return res.sendStatus(404);
        res.status(200).json({ characters: EnumCharacters(req.params.character_type) });
    });
    app.get('/character/:character_type/:key', (req, res) => {
        if (!ValidCharacterType(req.params.character_type)) return res.sendStatus(404);
        const Loader = (
            NumParam: string,
            CharacterGetter: (
                CharacterID: string,
                CharacterType: string,
                NumParameter: number,
                Gender?: string
            ) => CharacterSearchResult | null
        ) => {
            if (!NumReg.test(NumParam)) return res.sendStatus(400);
            const CharacterInfo = CharacterGetter(
                req.params.key,
                req.params.character_type,
                parseInt(NumParam),
                req.query.gender == null ? undefined : (req.query.gender as string)
            );
            if (CharacterInfo == null) return res.sendStatus(404);
            if (req.params.character_type === 'partner') {
                const CharacterLv1Info = GetCharacter.FromLevel(req.params.key, 'partner', 1);
                /* c8 ignore next */
                if (CharacterLv1Info == null) return res.sendStatus(500); // ここは基本通らないので、カバレッジチェックでも無視
                CharacterInfo['magic'] = GetMagic(CharacterLv1Info.parameter.mp, 'partner');
            } else CharacterInfo['magic'] = GetMagic(CharacterInfo.parameter.mp, req.params.character_type);
            res.status(200).json(CharacterInfo);
        };
        if (req.query.level) Loader(req.query.level as string, GetCharacter.FromLevel);
        else if (req.query.exp) Loader(req.query.exp as string, GetCharacter.FromExp);
        else return res.sendStatus(400);
    });
    app.use(express.static('./wwwroot'));
    return app;
};

server().listen(process.env.HTTP_PLATFORM_PORT || 42000);
