const Types = ['player', 'partner', 'enemy'];

export const ValidCharacterType = (TypeText: string) => Types.includes(TypeText);
