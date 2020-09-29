function rangeSlider () {
    const rangeSliderList = document.querySelectorAll('[data-range-slider]')
    for( let i = 0; i < rangeSliderList.length; i++) {
        const sliderFieldElement = rangeSliderList[i].querySelector('[data-range-slider-field]')
        const leftElement = rangeSliderList[i].querySelector('[data-range-slider-left-item]')
        const rightElement = rangeSliderList[i].querySelector('[data-range-slider-right-item]')
        const lineElement = rangeSliderList[i].querySelector('[data-range-slider-line]')
        const inputElement = rangeSliderList[i].querySelector('[data-input-range-slider]')

        const sliderWidth = sliderFieldElement.getBoundingClientRect().width

        const minValueElement = rangeSliderList[i].querySelector('[data-min]')
        const maxValueElement = rangeSliderList[i].querySelector('[data-max]')

        const minRange = parseInt(rangeSliderList[i].getAttribute('data-min-range'))
        const maxRange = parseInt(rangeSliderList[i].getAttribute('data-max-range'))
        const minValue = removeSpaces(minValueElement.innerHTML)
        const maxValue = removeSpaces(maxValueElement.innerHTML)

        const mainProportion = (maxRange - minRange)/parseInt(sliderWidth)
        const leftPointToLeft = (minValue - minRange) / mainProportion
        const rightPointToLeft = (maxValue - minRange) / mainProportion

        const proportions = { minRange, mainProportion }
        const inputValues = { minValue, maxValue }
        setInputValue(inputElement, inputValues)

        leftElement.style.left = `${leftPointToLeft}px`

        rightElement.style.left = `${rightPointToLeft}px`

        lineElement.style.left = `${leftPointToLeft}px`
        lineElement.style.width = `${rightPointToLeft - leftPointToLeft}px`

        const position = {
            leftPointPosition: leftPointToLeft,
            rightPointPosition: rightPointToLeft
        }

        function mousedownListener(event) {
            event.stopPropagation()

            document.addEventListener('mousemove', mousemoveListener)
            document.addEventListener('mouseup', mouseupListener)

            if (event.touches) {
                document.addEventListener('touchmove', mousemoveListener)
                document.addEventListener('touchend', mouseupListener)
                position.mouseX = event.touches[0].pageX
            } else {
                document.addEventListener('mousemove', mousemoveListener)
                document.addEventListener('mouseup', mouseupListener)
                position.mouseX = event.pageX
            }

            position.currentElement = this.element
        }

        function mousemoveListener (event) {
            event.stopPropagation()

            let delta
            if (event.touches) {
                delta = event.touches[0].pageX - position.mouseX
            } else {
                event.preventDefault()
                delta = event.pageX - position.mouseX
            }

            if (position.currentElement === leftElement) {

                let newleftItemPosition = position.leftPointPosition + delta

                if (newleftItemPosition < 0) {
                    newleftItemPosition = 0
                }
                if (newleftItemPosition > position.rightPointPosition) {
                    newleftItemPosition = position.rightPointPosition
                }
                if ((newleftItemPosition >= 0) && (newleftItemPosition <= position.rightPointPosition)){
                    leftElement.style.left = `${newleftItemPosition}px`
                    lineElement.style.left = `${newleftItemPosition}px`
                    lineElement.style.width = `${position.rightPointPosition - newleftItemPosition}px`
                    inputValues.minValue = Math.round(showValue(newleftItemPosition, 'left', proportions))
                    setInputValue(inputElement, inputValues)
                }
            }
            else if (position.currentElement === rightElement) {

                let newRightItemPosition = position.rightPointPosition + delta

                if (newRightItemPosition < position.leftPointPosition) {
                    newRightItemPosition = position.leftPointPosition
                }
                if (newRightItemPosition > sliderWidth) {
                    newRightItemPosition = sliderWidth
                }
                if ((newRightItemPosition >= position.leftPointPosition ) && (newRightItemPosition <= sliderWidth)){
                    rightElement.style.left = `${newRightItemPosition}px`
                    lineElement.style.width = `${newRightItemPosition - parseInt(lineElement.style.left)}px`
                    inputValues.maxValue = Math.round(showValue(newRightItemPosition, 'right', proportions))
                    setInputValue (inputElement, inputValues)
                }
            }
        }

        function mouseupListener () {
            if (position.currentElement === leftElement) {
                position.mouseX = leftElement.getBoundingClientRect().x
                position.leftPointPosition = parseInt(leftElement.style.left)
            }
            else if (position.currentElement === rightElement) {
                position.mouseX = rightElement.getBoundingClientRect().x
                position.rightPointPosition = parseInt(rightElement.style.left)
            }
            document.removeEventListener('mousemove', mousemoveListener)
            document.removeEventListener('mouseup', mouseupListener)

            document.removeEventListener('touchmove', mousemoveListener)
            document.removeEventListener('touchend', mouseupListener)
        }

        leftElement.addEventListener('mousedown', {handleEvent: mousedownListener, element: leftElement})
        rightElement.addEventListener('mousedown', {handleEvent: mousedownListener, element: rightElement})

        leftElement.addEventListener('touchstart', {handleEvent: mousedownListener, element: leftElement})
        rightElement.addEventListener('touchstart', {handleEvent: mousedownListener, element: rightElement})


        function showValue (pixels, element, proportions) {
            const calculatedValue = (proportions.mainProportion * pixels) + proportions.minRange
            if (element === 'left') {
                const minValueElement = rangeSliderList[i].querySelector('[data-min]')
                minValueElement.innerHTML = formatValue(calculatedValue)
            }
            else if (element === 'right') {
                const maxValueElement = rangeSliderList[i].querySelector('[data-max]')
                maxValueElement.innerHTML = formatValue(calculatedValue)
            }
            return calculatedValue
        }
    }

    function removeSpaces (string) {
        return parseInt([...string].filter(letter => letter !== ' ').join(''))
    }

    function formatValue (number) {
        const value = [...Math.round(number).toString()].reverse()
        const newValue = []

        for( let i = 0; i < value.length; i++) {
            if ((Math.floor(i/3) === i/3) && i !== 0) {
                newValue.push(' ')
                newValue.push(value[i])
            } else {
                newValue.push(value[i])
            }
        }
        return newValue.reverse().join('')
    }

    function setInputValue (inputElement, inputValues) {
        const obj = [inputValues.minValue, inputValues.maxValue]
        const string = obj.join(';')
        inputElement.value = string
    }
}

rangeSlider()