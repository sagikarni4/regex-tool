import React, { useState, useEffect } from 'react';
import _ from "lodash";
import ReactPaginate from 'react-paginate';



function Table(props) {

    const [pagination, setPagination] = useState({
        offset: 0,
        numberPerPage: 100,
        pageCount: 0,
        pageNum : 0,
        currentData: []
      });


      useEffect(() => {
        if(pagination.pageNum> props.matches.data.length/pagination.numberPerPage ){
            setPagination((prevState) => ({
                ...prevState,
                pageNum:0,
                offset:0,
                pageCount: 0,
                currentData: props.matches.data.slice(0, pagination.numberPerPage)
        }))
        }
        else{
        setPagination((prevState) => ({
          ...prevState,
          pageCount: props.matches.data.length / prevState.numberPerPage,
          currentData: props.matches.data.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
        }))
        }
      }, [pagination.numberPerPage, pagination.offset,pagination.pageNum, props.matches.data])

      
      const handlePageClick = event => {
        const selected = event.selected;
        const offset = selected * pagination.numberPerPage
        const pageNum = selected
        setPagination({ ...pagination, offset, pageNum })
      }

  return (  
    <div>
        {pagination.currentData&&
        <table className="match-table"> 
            <thead> 
                <tr>
                    <th className="match-head">match</th>
                    {_.times(props.matches.num_of_groups, (i) => (
                        <th className={ i > 5? 'match-head' : `group${i+1}-head`} key={`groupstring${i}`}>group {i +1}</th>
                    ))} 
                </tr>
            </thead>
            <tbody>
                {pagination.currentData.map((item, index)=>(
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
        }
        <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            pageCount={props.matches.data.length/pagination.numberPerPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            forcePage={pagination.pageNum}
            />
    </div>
  );
}

export default Table;
