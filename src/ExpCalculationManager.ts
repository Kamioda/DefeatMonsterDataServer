export function InternalGetLevel(Exp: number, ExpList: number[], start: number, last: number): number {
    const InRange = (Min: number, Max: number) => Min <= Exp && Exp < Max;
    if (Exp < 0) return 0;
    if (InRange(ExpList[start], ExpList[start + 1])) return start;
    if (InRange(ExpList[last], last === 99 ? Number.MAX_SAFE_INTEGER : ExpList[last + 1])) return last;
    if (last - start > 10) {
        const Center: number = Math.floor((last - start) / 2) + start;
        if (InRange(ExpList[Center], ExpList[Center + 1])) return Center;
        else
            return ExpList[Center] < Exp
                ? InternalGetLevel(Exp, ExpList, Center + 1, last)
                : InternalGetLevel(Exp, ExpList, start, Center - 1);
    } else {
        for (let i = start + 1; i < last; i++) {
            if (InRange(ExpList[i], ExpList[i + 1])) return i;
        }
        return 0;
    }
}

export function CreateExpList(ExpList: number[]): number[] {
    let Total = 0;
    const ExpSortedList = ExpList.sort((a, b) => a - b);
    return ExpSortedList.map(i => {
        Total += i;
        return Total;
    });
}

export function GetLevel(Exp: number, ExpList: number[]): number {
    return InternalGetLevel(Exp, CreateExpList(ExpList), 0, ExpList.length - 1) + 1;
}
