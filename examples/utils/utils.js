/*
  Util function to get numeric year from string inputs like “2016” “12” “1999”
  @param {String} yearInput
  @return {Number} , default null
*/
function getYearFromAbbr(yearInput){
    if(!yearInput) return null

    const currentYear = (new Date()).getFullYear()
    const currentSubYear = currentYear % 100

    yearInput = parseInt(yearInput)
    if((yearInput < 100 && yearInput >  currentSubYear)
        || (yearInput > 99 && yearInput < 2000)){

        //console.log(`Select a year after 1999!`)
        return null
    }
    else if(yearInput < 100 && yearInput <= currentSubYear){
        //ASSUMPTION: supporting years from 2000's only
        //examples 2015, 2020, NOT 1999

        return 2000 + yearInput
    }
    else if(yearInput > 99 && yearInput <= currentYear){
        return yearInput
    }
}

/*
  Util function to get semester full name from string inputs like “Fall” “CS-111 Su2016” “CS:3581 W 2016”
  @param {String} courseInputsList
  @return {Number} , default undefined
*/
function getSemFromAbbr(semesterInput){
    if(!semesterInput) return undefined

    const semestersKey = {'F': 'Fall', 'W': 'Winter',
        'SU': 'Summer',  'S': 'Spring',
        'FALL': 'Fall', 'WINTER': 'Winter',
        'SUMMER': 'Summer', 'SPRING': 'Spring'}

    return semestersKey[semesterInput.toUpperCase()]
}

module.exports = {
    getYearFromAbbr,
    getSemFromAbbr
}
