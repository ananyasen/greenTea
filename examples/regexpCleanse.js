/*
Use Case: There are a lot of manually inputted courses. We need to clean this data to be able to process it.
Examples: “CS111 2016 Fall” “CS-111 Fall 2016” “CS 111 W2016” “CS:111 Su2016” “CS111 2016Winter”
Summer abbreviations: F=Fall, W=Winter, S=Spring, Su=Summer
Todo: Normalize into Department, Course Number, Year & Semester
*/

const {getYearFromAbbr, getSemFromAbbr} = require('./utils/utils')

/*
  Takes a course input and returns a normalized list of objects
  @param {String} courseInputsList
  @return {Object} , default null
*/
function normalizeCourseName( courseInput ){
    let normalized = {'department': null,
        courseNumber: null,
        year: null,
        semester: null}

    //trim spaces
    courseInput = courseInput.replace(/^[\s]+/g, '')
    courseInput = courseInput.replace(/[\s]+$/g, '')

    //validate string format
    //Examples: “CS111 2016 Fall” “CS-111 Su2016” “CS:3581 W 2016”
    let courseInputRegex = /^[A-Z]+(:|-|\s)?[0-9]+\s{1}[A-Z]+(\s)?[0-9]+$/gi
    let courseInputRegexAlt = /^[A-Z]+(:|-|\s)?[0-9]+\s{1}[0-9]+(\s)?[A-Z]+$/gi

    if(courseInputRegex.test(courseInput) || courseInputRegexAlt.test(courseInput)){
        //extract department course number
        let courseRegex = /^[A-Z]+(:|-|\s)?[0-9]+\s{1}/gi
        let courseFound = courseInput.match(courseRegex)[0]

        //get department
        normalized.department = courseFound.match(/[A-Z]+/gi)[0]
        //get course number
        normalized.courseNumber = parseInt(courseFound.match(/[0-9]+/gi)[0])

        //extract semester & year
        const semesterInput = courseInput.substring(courseFound.length - 1)

        //extract the semester
        const semesterFound = semesterInput.match(/[A-Z]+/gi)[0]
        const parsedSem = getSemFromAbbr(semesterFound)
        if(!parsedSem) return null
        normalized.semester = parsedSem

        //extract the year
        const parsedYear = getYearFromAbbr(semesterInput.match(/[0-9]+/gi)[0])
        if(!parsedYear) return null
        normalized.year = parsedYear
    }
    else{
        //console.log('Invalid Course Input', courseInput)
        return null
    }

    return normalized
}

/*
  Takes a list of course inputs and returns a normalized list of objects
  @param {Array} courseInputsList
  @return {Array[Object]} , default null
*/
function normalizeCourseNamesList( courseInputsList ){

    //Map to sieve out duplicate department & course number
    let dedupMap = {}

    let normalizedList = courseInputsList.map( courseInput => {
        const normalized = normalizeCourseName(courseInput)
        //check if duplicate
        if(normalized && !dedupMap[`${normalized.department}-${normalized.courseNumber}`]) {
            dedupMap[`${normalized.department}-${normalized.courseNumber}`] = true
            return normalized
        }
    })

    normalizedList = normalizedList.filter(course => course)

    //sort desc order of year, semester order by [F, W, S, Su], asc order of dept, asc order of courseNum
    const comparator = (a,b) => {
        //descending order year
        if(a.year > b.year) return -1
        if(a.year < b.year) return 1

        //semester
        const semPrescedence = {'Fall': 0, 'Winter': 1, 'Spring': 2, 'Summer': 3}
        if(semPrescedence[a.semester] > semPrescedence[b.semester]) return 1
        if(semPrescedence[a.semester] < semPrescedence[b.semester]) return -1

        //ascending order of department
        if(a.department > b.department) return 1
        if(a.department < b.department) return -1

        //ascending order of courseNumber
        if(a.courseNumber > b.courseNumber) return 1
        if(a.courseNumber < b.courseNumber) return -1

        return 0
    }
    normalizedList = normalizedList.sort(comparator)

    return normalizedList
}

module.exports = {
    normalizeCourseName,
    normalizeCourseNamesList
}
