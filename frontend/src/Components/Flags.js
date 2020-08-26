import React from 'react';



function Flags(props) {

  return (  
    <nav className="flags">
        <ul className="flags-nav">
            {props.children}
        </ul>
    </nav>
  );
}

export default Flags;
