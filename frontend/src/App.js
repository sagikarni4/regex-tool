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

  function removeEmojis (string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, '');
  }

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
            setTextArea(removeEmojis(value))
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
              highlight : [item.match.start, item.match.end],
              className: 'match',
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
                      //highlight : [...text_area].slice(item.match.start,item.match.end).join(''),
                      className: 'match',
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
      <Flags>
          <FlagItem icon={<i class="far fa-flag"></i>}>
              <DropdownMenu flags = {flags} setFlags= {setFlags}/>
          </FlagItem>
      </Flags>

      <main className = "main-container">

        {/* <div class="container">
          <div class="backdrop" id='backdrop'>
            <div class="highlights" dangerouslySetInnerHTML={{ __html: htmlDecode(highlights) }}>
            </div>
          </div>
          <textarea onChange = {addText} value = {text_area } id="text-area" name = "text-area" className = "text-area"/>
        </div> */}

          <div>
              <HighlightWithinTextarea
              highlight = {highlight}
              className = "text-area"
              onChange = {addText}
              value = {text_area }
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
