import React from 'react';



function DropdownMenu(props) {
    const setFlags = props.setFlags
    function DropdownItem(props){
        let clicked = props.clicked
        let name = props.name
        const style = clicked ? {backgroundColor : 'crimson'} : {}
        return(
        <button className="menu-item" style={style} onClick={()=>setFlags(prevState=>({...prevState, [name] : !clicked}))}>
              {props.children}
        </button>
        );
    }
    let {i, s, l, x, m, u} = props.flags
    return (  
        <div className="dropdown">
            <DropdownItem clicked= {i} name = 'i'> I </DropdownItem> 
            <DropdownItem clicked= {s} name = 's'> S </DropdownItem> 
            <DropdownItem clicked= {l} name = 'l'> L </DropdownItem> 
            <DropdownItem clicked= {x} name = 'x'> X </DropdownItem> 
            <DropdownItem clicked= {u} name = 'u'> U </DropdownItem> 
            <DropdownItem clicked= {m} name = 'm'> M </DropdownItem> 
        </div>
 
  );
}

export default DropdownMenu;
