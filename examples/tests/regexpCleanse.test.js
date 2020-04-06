const {normalizeCourseName, normalizeCourseNamesList} = require("../regexpCleanse")

/*
Use Case: There are a lot of manually inputted courses. We need to clean this data to be able to process it.
Examples: “CS111 2016 Fall” “CS-111 Fall 2016” “CS 111 W2016” “CS:111 Su2016” “CS 111 Winter 2016”
Summer abbreviations: F=Fall, W=Winter, S=Spring, Su=Summer
*/

test('input with different delimiters', () => {
    expect(normalizeCourseName('CS-111 Fall 2012')).toEqual({ department:'CS', courseNumber:111, year:2012, semester:'Fall' })
    expect(normalizeCourseName('CS:151 Fall 2009')).toEqual({ department:'CS', courseNumber:151, year:2009, semester:'Fall' })
    expect(normalizeCourseName('CS111 2014Spring')).toEqual({ department:'CS', courseNumber:111, year:2014, semester:'Spring' })
})

test('input with semester year first', () => {
    expect(normalizeCourseName('Bio:900 2016 Winter')).toEqual({ department:'Bio', courseNumber:900, year:2016, semester:'Winter' })
    expect(normalizeCourseName('CS 111 2013Su')).toEqual({ department:'CS', courseNumber:111, year:2013, semester:'Summer' })
})

test('invalid input', () => {
    expect(normalizeCourseName('')).toBeNull()
    expect(normalizeCourseName('CS')).toBeNull()
    expect(normalizeCourseName('CS219')).toBeNull()
    expect(normalizeCourseName('CS111 Fall 1999')).toBeNull()
    expect(normalizeCourseName('CS111F2016')).toBeNull()
    expect(normalizeCourseName('CS 111 Q2016')).toBeNull()
})

test('happy path', () => {
    expect(normalizeCourseName('  CS 111 2016 Fall ')).toEqual({ department:'CS', courseNumber:111, year:2016, semester:'Fall' })
    expect(normalizeCourseName('CS111 Winter 16')).toEqual({ department:'CS', courseNumber:111, year:2016, semester:'Winter' })
})

test('Normalize and Dedup a list of course inputs by department and course number', () => {
    const inputs = ['CS-111 Fall 2015', 'CS-111 Fall 2016', 'CS-111 Winter 2015',
        'BIO:124 Winter 2017', 'ACCT:124 Fall 2017', 'Chem:234 Fall 2017', 'Chem:345 Fall 2017']
    const normalizedList = normalizeCourseNamesList(inputs)

    expect(normalizedList.length).toBe(inputs.length -2 )

    let foundDup = false
    const dedupMap = {}
    //check if duplicate
    normalizedList.filter( courseInput => {
        //check if duplicate
        if(dedupMap[`${courseInput.department}-${courseInput.courseNumber}`]) {
            foundDup = true
        }
    })
    expect(foundDup).toBeFalsy()
})

test('Normalize and Sort list of course inputs', () => {
    //sort desc order of year, semester order by [F, W, S, Su], asc order of dept, asc order of courseNum
    const inputs = ['CS-111 Fall 2015', 'CS-111 Fall 2016', 'CS-111 Winter 2015',
        'BIO:124 Winter 2017', 'ACCT:124 Fall 2017', 'Chem:234 Fall 2017', 'Chem:345 Fall 2017']
    const normalizedList = normalizeCourseNamesList(inputs)

    expect(normalizedList.length).toBe(inputs.length -2 )
    expect(normalizedList[0].year).toBe(2017)
    expect(normalizedList[0].department).toBe('ACCT')
    expect(normalizedList[1].department).toBe('Chem')
    expect(normalizedList[1].courseNumber).toBe(234)
    expect(normalizedList[3].semester).toBe('Winter')
})

test('Empty course inputs', () => {
    const inputs = []
    const normalizedList = normalizeCourseNamesList(inputs)
    expect(normalizedList.length).toBe(0)
})
