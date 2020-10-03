import React, {useState, useRef, useEffect} from 'react';



function FlagItem(props) {

  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(()=>{
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)&& open) {
          setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
    };
  },[ref,open])

  return (  
   <li className="flag-item" ref={ref}>
       <button className="icon-button" onClick={()=>setOpen(!open)}>
           {props.icon}
       </button>
       {open && props.children} 
   </li>
  );
}

export default FlagItem;
