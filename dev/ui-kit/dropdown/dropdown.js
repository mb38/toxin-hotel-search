export default function dropdown(elementSelector) {

  const dropdownElementList = document.querySelectorAll(elementSelector)
  for (let i = 0; i < dropdownElementList.length; i++) {
    const dropdownElement = dropdownElementList[i]
    const dropdownArrowElement = dropdownElement.querySelector(".dropdown__text-arrow")
    const listItemElements = dropdownElement.querySelectorAll(".dropdown-list__item")
    const inputElement = dropdownElement.querySelector("[data-dropdown-input]")
    const clearButtonElement = dropdownElement.querySelector("[data-dropdown-clear]")
    const applyButtonElement = dropdownElement.querySelector("[data-dropdown-apply]")

    const listArray = {}
    
    // открыть/скрыть выпадающее меню
    dropdownArrowElement.addEventListener("click", () => {
      dropdownElement.classList.toggle("dropdown_active")
    })

    // скрыть выпадающее меню по кнопке "применить"
    applyButtonElement.addEventListener('click', () => {
      dropdownElement.classList.toggle("dropdown_active")
    })

    listItemElements.forEach(function(listItem){
      const currentListElement = listItem
      const plusElement = currentListElement.querySelector("[data-dropdown-plus]")
      const minusElement = currentListElement.querySelector("[data-dropdown-minus]")
      const textElement = currentListElement.querySelector("[data-dropdown-text]")
      const countElement = currentListElement.querySelector("[data-dropdown-count]")
      let itemCount
      const elementName = textElement.innerHTML

      listArray[elementName] = itemCount
    
      listItem.addEventListener("click", function(event) {

        if (event.target === plusElement) {
          itemCount = parseInt(countElement.innerHTML)
          itemCount++
          countElement.innerHTML = itemCount
          minusElement.classList.remove("dropdown-list__item-minus_unavailable")
          listArray[elementName] = itemCount
        }

        if (event.target === minusElement && itemCount > 0) {
          itemCount = parseInt(countElement.innerHTML)
          itemCount--
          countElement.innerHTML = itemCount
          if (itemCount <= 0) {
            minusElement.classList.add("dropdown-list__item-minus_unavailable")
          }
          listArray[elementName] = itemCount
        }

        // Заполнение инпута
        const guestArray = ["гость", "гостя", "гостей"]
        const bedroomArray = ["спальня", "спальни", "спален"]
        const bedArray = ["кровать", "кровати", "кроватей"]
        const bathroomArray = ["ванная комната", "ванных комнаты", "ванных комнат"]
        let guestCount = 0
        let dropdownGuests = false
        let string = ""
        let comma = ""

        for(let key in listArray) {
          if (listArray[key] > 0) {
            if (key === "взрослые" || key === "дети" || key === "младенцы") {
              guestCount += parseInt(listArray[key])
              dropdownGuests = true
            } else {
              if (string !== "") {
                comma = ", "
              }
              if (key === "спальни") {
                string += `${comma}${listArray[key]} ${makeWordsEnds( listArray[key], bedroomArray)}`
              } else if (key === "кровати") {
                string += `${comma}${listArray[key]} ${makeWordsEnds( listArray[key], bedArray)}`
              } else {
                string += `${comma}${listArray[key]} ${makeWordsEnds( listArray[key], bathroomArray)}`
              } 
            }
          }
        }
        if (dropdownGuests) {
          string = `${guestCount} ${makeWordsEnds( guestCount, guestArray)}`
        }

        inputElement.value = string

        // Поведение кнопки "Очистить"
        if (string !== "") {
          clearButtonElement.classList.remove("hide")
          clearButtonElement.addEventListener("click",(event)=> {
            event.preventDefault()
    
            listItemElements.forEach(function(listItem, i, arr){
              listItem.querySelector("[data-dropdown-count]").innerHTML = 0
              minusElement.classList.add("dropdown-list__item-minus_unavailable")
            })
            inputElement.value = ""
            clearButtonElement.classList.add("hide")
            for(let key in listArray){
              listArray[key] = 0
            }
            
            itemCount = 0
          })
        } else {
          clearButtonElement.classList.add("hide")
        }
      })
      
    })
  }

  //оформление дропдауна "гости" в ui-kit
  // if (elementSelector === "#dropdown-calculator") {

  //   const dropdownGuestElement = document.querySelector(elementSelector)
  //   if (dropdownGuestElement) {

  //     const dropdownListTextElement = dropdownGuestElement.querySelectorAll(".dropdown-list__item")
  //     const clearButtonElement = dropdownGuestElement.querySelector("[data-dropdown-clear]")
  //     const inputElement = dropdownGuestElement.querySelector("[data-dropdown-input]")
      
  //     for (let item of dropdownListTextElement) {
  //       const textElement = item.querySelector("[data-dropdown-text]")
  //       const countElement = item.querySelector("[data-dropdown-count]")
  //       const minusElement = item.querySelector("[data-dropdown-minus]")
        
  //       if (textElement.innerHTML === "взрослые") {
  //         countElement.innerHTML = "2"
  //         minusElement.classList.remove("dropdown-list__item-minus_unavailable")
  //         clearButtonElement.classList.remove("hide")
  //       } 
  //       if (textElement.innerHTML === "дети") {
  //         countElement.innerHTML = "1"
  //         minusElement.classList.remove("dropdown-list__item-minus_unavailable")
  //       }
  //     }
  //   }
  // }

  function makeWordsEnds( number, array) {
    let string = ""
    const lastNum = String(number)[String(number).length-1]
    const previosNum = String(number)[String(number).length-2]

    if (lastNum === "1" && previosNum !== "1") {
      string = array[0]
    } else if ((lastNum === "2" || lastNum === "3" || lastNum === "4") && previosNum !== "1") {
      string = array[1]
    } else if (number === 0) {
      string = ""
    } else {
      string = array[2]
    }
    return string
  }
}