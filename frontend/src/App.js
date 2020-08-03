import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Table from './Components/Table'
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import _ from 'lodash'




function App() {
  const [text_area, setTextArea] = useState("")
  const [regex_area, setRegexArea] = useState("")
  const [matches, setMatches] = useState(null)
  const [highlight, setHighlight] = useState([])
  const [typing, setTyping] = useState(false)
  //const [typingTimeout, setTypingTimeout] = useState(0)


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
      const resp = await axios.post('http://localhost:8000/api/', data)
      setMatches(resp.data)
    }
    catch(e){
      console.log(e)
    }
  }


  function addText(e){
      e.preventDefault()
      let {name, value} = e.target
      switch(name){
        case 'text-area':
            setTyping(true)
            setTextArea(value)
            _.debounce(()=>setTyping(false),1000)()
            break
        case 'regex-area':
            setTyping(true)
            setRegexArea(value)
            _.debounce(()=>setTyping(false),1000)()
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
        text_area
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
     [regex_area, text_area, typing])

  useEffect(()=>{
      if(matches){
        if(matches.data.length>0 & matches.num_of_groups >1){
          let newHigh = []
          matches.data.map(item=>{
            newHigh = [...newHigh,
            {
              highlight : [item.match.start, item.match.end],
              className: 'match'
            },
            {
              highlight : [item.groups[0].start, item.groups[0].end],
              className : 'group1'
            },
            {
              highlight : [item.groups[1].start, item.groups[1].end],
              className : 'group2'
            }
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
                highlight : [item.match.start, item.match.end],
                className: 'match'
              },
              {
                highlight : [item.groups[0].start, item.groups[0].end],
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
                  matches.data.map(item=>(
                    newHigh = [...newHigh,
                    {
                      highlight : [item.match.start, item.match.end],
                      className: 'match'
                    }
                   ]
                    ))
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
    , [matches])


  return (
    
    <>
      <main className = "main-container">
          <div>
              <HighlightWithinTextarea
              highlight = {highlight}
              className = "text-area"
              onChange = {addText}
              value = {text_area}
              name = "text-area"
              containerClassName = "text-area-container"
              />
          </div>
         
         <div>
            <textarea  className = "regex-area" onChange = {addText} value = {regex_area} name = "regex-area"/>
            {matches  && matches.data.length && <Table matches = {matches} text_area = {text_area}/>}

         </div>
      </main>

    </>
  );
}

export default App;
