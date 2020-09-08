import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Table from './Components/Table'
import Flags from './Components/Flags'
import FlagItem from './Components/FlagItem'
import DropdownMenu from './Components/DropdownMenu'
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import _ from 'lodash'




function App() {
  const [text_area, setTextArea] = useState("")
  const [regex_area, setRegexArea] = useState("")
  const [matches, setMatches] = useState(null)
  const [highlight, setHighlight] = useState([])
  const [typing, setTyping] = useState(false)
  const [i, setI] = useState(0)
  const [flags, setFlags] = useState({i: true, s: true, l : false, x: false, u:false, m:false })


  function isValidRegex(text){
    if (text.includes('[]'))
      return false
    if (text.endsWith('.*?') || text.endsWith('.*') || text.endsWith('|'))
      return false
    try{
      new RegExp(text)
    }
    catch(e){
      return false
    }
    return true
  }

  async function askService(data){
    try{
      console.log(data)
      const resp = await axios.post('http://localhost:8000/api/', data)
      console.log(resp.data)
      setMatches(resp.data)
    }
    catch(e){
      console.log(e)
    }
  }


  async function scrollToMatch(e){
    e.preventDefault()
    if (matches){
    let content =  document.getElementById("text-area")
    let match =  document.querySelectorAll(".match")[i]
    content.scrollTop = await match.offsetTop
    if (i === matches.data.length - 1){
      setI(0)
    }
    let check = true
    let y = i
    while(check){
      if(y+1 >= document.querySelectorAll(".match").length){
        check = false
        setI(0)
      }
      else{
        if(document.querySelectorAll(".match")[y].offsetTop === document.querySelectorAll(".match")[y+1].offsetTop){
          y++
      }
      else{
        setI(y+1)
        check = false
      }
    }
   
    }
    }
    }


  async function addText(e){
      e.preventDefault()
      let {name, value} = e.target
      switch(name){
        case 'text-area':
            setTyping(true)
            setI(0)
            setTextArea(value.replace('&','&amp;'))
            _.debounce(()=>setTyping(false),1000)()
            break
        case 'regex-area':
            setTyping(true)
            setI(0)
            _.debounce(()=>setTyping(false),1000)()
            setRegexArea(value)
            break
        default:
            setRegexArea("")
            setTextArea("")
            break
      }
  }
  useEffect(()=>{
      if(text_area.length>1000){
        setTextArea(text_area.replace(/\s+$/, ''))
      }
      const data = {
        regex_area,
        text_area,
        flags
      }
      if (text_area && regex_area && isValidRegex(regex_area) && !typing){
          askService(data)
      }
      else{
        if (!regex_area || !text_area){
          setMatches(null)
        }

      }
    },
     [regex_area, text_area, typing, flags])

     useEffect(()=>{
      if(matches){
        if(matches.data.length>0 & matches.num_of_groups >1){
          let newHigh = []
          matches.data.map(item=>{
            newHigh = [...newHigh,
            {
              highlight : [[...text_area].slice(0,item.match.start).join('').length,
                          [...text_area].slice(0,item.match.end).join('').length ],
              className: 'match',
            },
            {
              highlight : [[...text_area].slice(0,item.groups[0].start).join('').length,
                          [...text_area].slice(0,item.groups[0].end).join('').length],
              className : 'group1'
            },
            {
              highlight : [[...text_area].slice(0,item.groups[1].start).join('').length,
                          [...text_area].slice(0,item.groups[1].end).join('').length],
              className : 'group2'
            },
           ]
           return newHigh
          }
          )
            setHighlight(newHigh)
          }
        else{
          if(matches.data.length>0 & matches.num_of_groups ===1){
            let newHigh = []
            matches.data.map(item=>{
              newHigh = [...newHigh,
              {
                highlight : [[...text_area].slice(0,item.match.start).join('').length,
                            [...text_area].slice(0,item.match.end).join('').length ],
                className: 'match',
              },
              {
                highlight : [[...text_area].slice(0,item.groups[0].start).join('').length,
                            [...text_area].slice(0,item.groups[0].end).join('').length],
                className : 'group1'
              }
             ]
             return newHigh
            }
            )
              setHighlight(newHigh)
            }
          else{
              if(matches.data.length>0){
                  let newHigh = []
                  matches.data.map(item=>{
                    console.log(item.match.start + item.match.start -[...text_area.substring(0,item.match.start)].length)
                    newHigh = [...newHigh,
                    {
                      highlight : [[...text_area].slice(0,item.match.start).join('').length,
                                  [...text_area].slice(0,item.match.end).join('').length ],
                      className: 'match',
                    }
                   ]
                   return newHigh
                    })
                    setHighlight(newHigh)
                }
              else{
                setHighlight([])
                }
              } 
        }
      
      }
      else{
        setHighlight([])

      }
     
    }
    , [matches, text_area])

  
  return (
    
    <>
      <Flags>
          <FlagItem icon={<i class="far fa-flag"></i>}>
              <DropdownMenu flags = {flags} setFlags= {setFlags}/>
          </FlagItem>
      </Flags>

      <main className = "main-container">

          <div>
              <HighlightWithinTextarea
              highlight = {highlight}
              className = "text-area"
              onChange = {addText}
              value = {text_area}
              name = "text-area"
              id="text-area"
              containerClassName = "text-area-container"
              placeholder="Content goes here..."
              />
         </div>

         <div>
            <textarea className = "regex-area" onChange = {addText} value = {regex_area} name = "regex-area"  placeholder="Regex goes here..."/>
            <div className="data-area">
              {matches &&  matches.data.length >0 ? <button className="btn" onClick={scrollToMatch}>Next Match </button>: <div></div>}  
              {matches && matches.data.length > 1 && <div className="num-matches">{`${matches.data.length} matches found`}</div>}
              {matches && matches.data.length === 1 && <div className="num-matches">{`${matches.data.length} match found`}</div>}
              {matches && matches.data.length < 1 && <div className="num-matches">No matches found</div>}
            </div>
              {matches  && matches.data.length>0 && <Table matches = {matches} text_area = {text_area}/>}
         </div>
      </main>

    </>
  );
}

export default App;
