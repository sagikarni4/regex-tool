import React from 'react';
import _ from "lodash";



function Table(props) {

  return (  
    <div>
        <table className="match-table"> 
            <thead> 
                <tr>
                    <th className="match-head">match</th>
                    {_.times(props.matches.num_of_groups, (i) => (
                        <th className={ i > 1? 'match-head' : `group${i+1}-head`} key={`groupstring${i}`}>group {i +1}</th>
                    ))} 
                </tr>
            </thead>
            <tbody>
                {props.matches.data.map((item, index)=>(
                    <tr key={index}>
                        <td>{[...props.text_area].slice(item.match.start,item.match.end).join('')}</td>
                        {item.groups.map((group,index)=>(
                            <td key={`groupstart${group.start}end${group.end}index${index}`}>
                                {[...props.text_area].slice(group.start, group.end).join('')
                            }</td>
                        ))}
                    </tr>
                )
            )
            }   
            </tbody>
        </table>
    </div>
  );
}

export default Table;
