import React, { useState } from 'react';
import PropTypes  from 'prop-types';


const Select = ({ initialValue, options }) => {
  Select.propTypes = {
    initialValue: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
  }

  const [value, setValue] = useState(initialValue);
  const [isInFocus, setIsInFocus] = useState(false);
  const [currentInputValue, setCurrentInputValue] = useState();

  const handleInputChange = (event) => setCurrentInputValue(event.target.value);

  const selectOptions = currentInputValue => {
    if (currentInputValue) {
      const selectedOptions = [];
      options.forEach(option => {
        if (option.toLowerCase().slice(0, currentInputValue.length) === currentInputValue) {
          selectedOptions.push(option);
        }
      });
    return selectedOptions.sort();
    } else {
      return options;
    }
  };

  // Temporary solution to prevent <ul> disappearing from DOM before its child <li> can call setValue()
  // The delay value is selected empirically and may not perform its function in other environments
  const handleBlur = (event) => setTimeout(() => {
    setIsInFocus(false);
    event.target.value = null;
    setCurrentInputValue(null);
  }, 150);

  return (
    <div className='relative w-full h-10 bg-white'>
      <input
        className='absolute w-full h-full p-2 bg-inherit'
        id='location'
        type='text'
        onFocus={() => setIsInFocus(true)}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      {!isInFocus ?
        <label className='absolute w-full h-full text-center text-4xl bg-inherit z-10 cursor-pointer' htmlFor='location'>{value}</label>
        :
        <ul className='absolute mt-10 p-4 bg-inherit'>
          {selectOptions(currentInputValue).map((option, index) => {
            return <li className='p-1 bg-inherit cursor-pointer' key={index} onClick={() => setValue(option)}>{option}</li>
          }
          )}
        </ul>
      }
    </div>
  )
}

export default Select;

// import React, { useState, useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';

// const Select = ({ initialValue, options }) => {
//   Select.propTypes = {
//     initialValue: PropTypes.string.isRequired,
//     options: PropTypes.arrayOf(PropTypes.string),
//   };

//   const [value, setValue] = useState(initialValue);
//   const [isInFocus, setIsInFocus] = useState(false);
//   const ulRef = useRef(null);

//   useEffect(() => {
//     if (!isInFocus && ulRef.current) {
//       ulRef.current.style.display = 'none';
//     }
//   }, [isInFocus]);

//   const handleBlur = () => {
//     setTimeout(() => {
//       if (!isInFocus && ulRef.current) {
//         ulRef.current.style.display = 'none';
//       }
//     });
//   };

//   return (
//     <div className='relative w-full h-10'>
//       <input
//         className='absolute w-full h-full p-2 bg-red-300'
//         id='location'
//         type='text'
//         onFocus={() => setIsInFocus(true)}
//         onBlur={handleBlur}
//       />
//       {!isInFocus ? (
//         <label
//           className='absolute w-full h-full text-center text-4xl bg-lime-300 z-10 cursor-pointer'
//           htmlFor='location'
//         >
//           {value}
//         </label>
//       ) : (
//         <ul className='absolute mt-10 bg-slate-300' ref={ulRef}>
//           {options.map((option, index) => {
//             return (
//               <li
//                 className='m-1 bg-yellow-300 cursor-pointer'
//                 key={index}
//                 onClick={() => {
//                   setValue(option);
//                   setIsInFocus(false);
//                   ulRef.current.style.display = 'none';
//                 }}
//               >
//                 {option}
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Select;
