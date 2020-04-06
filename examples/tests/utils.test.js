const {getYearFromAbbr, getSemFromAbbr} = require('../utils/utils')

test('Parse Year From Abbr', () => {
    expect(getYearFromAbbr('2012')).toBe(2012)
    expect(getYearFromAbbr('12')).toBe(2012)
    expect(getYearFromAbbr('99')).toBeNull()
    expect(getYearFromAbbr('1999')).toBeNull()
    expect(getYearFromAbbr('21')).toBeNull()
    expect(getYearFromAbbr(null)).toBeNull()
})

test('Parse Semester From Abbr', () => {
    expect(getSemFromAbbr('W')).toBe('Winter')
    expect(getSemFromAbbr('Winter')).toBe('Winter')
    expect(getSemFromAbbr('S')).toBe('Spring')
    expect(getSemFromAbbr('Spring')).toBe('Spring')
    expect(getSemFromAbbr('Su')).toBe('Summer')
    expect(getSemFromAbbr('Summer')).toBe('Summer')
    expect(getSemFromAbbr('F')).toBe('Fall')
    expect(getSemFromAbbr('Fall')).toBe('Fall')

    expect(getSemFromAbbr('Sumer')).toBeUndefined()
    expect(getSemFromAbbr(null)).toBeUndefined()
})
