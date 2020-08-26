import React, {useState} from 'react';



function FlagItem(props) {

  const [open, setOpen] = useState(false)

  return (  
   <li className="flag-item">
       <button className="icon-button" onClick={()=>setOpen(!open)}>
           {props.icon}
       </button>
       {open && props.children} 
   </li>
  );
}

export default FlagItem;
