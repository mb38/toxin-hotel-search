function inputDate(element) {

  const inputDateList = document.querySelectorAll(element)
  for (let i = 0; i < inputDateList.length; i++) {

    let inputElement

    if (inputDateList[i].tagName !== 'INPUT') {
      inputElement = inputDateList[i].querySelector('input')
    } else {
      inputElement = inputDateList[i]
    }

    inputElement.addEventListener('input', (event) => {

      if (event.inputType !== 'deleteContentBackward') {

        const stringArr = [...event.target.value]
        let numArr = stringArr.filter(letter => parseInt(letter))
        const newNumArr = []
        
        for (let i = 0; i < numArr.length; i++) {
          if (newNumArr.length < 10) {
            
            newNumArr.push(numArr[i])
            if (i === 1 || i === 3) {
              newNumArr.push('.')
            }
          }
        }
        event.target.value = newNumArr.join('')
      }
    })







  }
}

export default inputDate