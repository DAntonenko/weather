import React, { useState, useRef, useEffect } from 'react';
// import { flushSync } from 'react-dom';
import PropTypes, { string }  from 'prop-types';


const Select = ({ initialValue, options, setCity }) => {
  Select.propTypes = {
    initialValue: PropTypes.shape({city: string, country: string}),
    options: PropTypes.arrayOf(PropTypes.shape({city: string, country: string})),
    setCity: PropTypes.func.isRequired,
  }

  const [value, setValue] = useState(initialValue);
  const [isInFocus, setIsInFocus] = useState(false);
  const [currentInputValue, setCurrentInputValue] = useState();

  const handleInputChange = event => setCurrentInputValue(event.target.value);

  const selectOptions = currentInputValue => {
    if (currentInputValue) {
      const selectedOptions = [];
      options.forEach(option => {
        if (option.city.toLowerCase().slice(0, currentInputValue.length) === currentInputValue.toLowerCase()) {
          selectedOptions.push(option.city);
        }
      });
    return selectedOptions.sort();
    } else {
      return options;
    }
  };

  // Temporary solution to prevent <ul> disappearing from DOM before its child <li> can call setValue()
  // The delay value is selected empirically and may not perform its function in other environments
  const handleBlur = event => setTimeout(() => {
    // event.preventDefault();
    // console.log('handleBlur: ', value);
    // setCity(value);
    setIsInFocus(false);
    event.target.value = null;
    setCurrentInputValue(null);
  }, 150);

  const handleEnterPress = event => {
    if (event.key === 'Enter') {
      setValue(currentInputValue[0].toUpperCase() + currentInputValue.slice(1)); // capitalize currentInputValue and set it as value
      // console.log('handleEnterPress: ', value);
      setIsInFocus(false);
      inputRef.current.blur();
    };
  };

  const handleOptionClick = event => {
    // Reconstruct option entry object by city name from the selected <li> innerText
    const selectedOption = {city: event.target.innerText, country: options.find(option => option.city === event.target.innerText).country};
    // console.log(selectedOption);
    setValue(selectedOption);
    setIsInFocus(false);
    // console.log('handleOptionClick: ', value);
  };

// const handleBlur = event => {
//   flushSync(() => {
//     event.preventDefault();
//     console.log('handleBlur: ', value);
//     setValue(value);
//     setCity(value);
//     setIsInFocus(false);
//   });

//   // event.target.value = null;
//   // setCurrentInputValue(null);
//   inputRef.current.blur();
// };

 const inputId = Date.now();
 const inputRef = useRef(null);



  useEffect(() => {
    setCity(value);
  }, [value, setCity]);

  return (
    <div className='relative w-full h-16 bg-white'>
      <input
        className='absolute w-full h-full p-2 bg-inherit'
        id={inputId}
        ref={inputRef}
        type='text'
        onFocus={() => setIsInFocus(true)}
        onChange={handleInputChange}
        onKeyDown={handleEnterPress}
        onBlur={handleBlur}
      />
      {!isInFocus ?
        <label className='absolute w-full h-full flex justify-center items-center text-4xl bg-inherit z-10 cursor-pointer' htmlFor={inputId}>
          {value.city}
        </label>
        :
        <ul className='absolute mt-10 p-4\ bg-inherit'>
          {selectOptions(currentInputValue).map((option, index) => {
            return (
              <li className='p-1 bg-inherit cursor-pointer' key={index} onClick={handleOptionClick}>
                {option.city}
              </li>
            )
          }
          )}
        </ul>
      }
    </div>
  )
}

export default Select;
