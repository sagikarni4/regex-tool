import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import './App.css';
import Table from './Components/Table'
import Flags from './Components/Flags'
import FlagItem from './Components/FlagItem'
import DropdownMenu from './Components/DropdownMenu'
import _ from 'lodash'
import Spinner from 'react-bootstrap/Spinner';




function App() {
  const [text_area, setTextArea] = useState("")
  const [regex_area, setRegexArea] = useState("")
  const [matches, setMatches] = useState(null)
  const [typing, setTyping] = useState(false)
  const [i, setI] = useState(0)
  const [editContent, setEditContent] = useState(false)
  const [flags, setFlags] = useState({i: true, s: true, l : false, x: false, u:false, m:false })
  const [waiting, setWating] =useState(false)
  const textareaRef = useRef()
  const highlightsRef = useRef()



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
      setWating(true)
      const resp = await axios.post('http://localhost:8000/api/', data)
      setMatches(resp.data)
      setWating(false)
    }
    catch(e){
      console.log(e)
    }
  }


  async function scrollToMatch(e){
    e.preventDefault()
    if (matches){
    let content =  document.getElementById("backdrop")
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
            setTextArea(value)
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

    if(regex_area.length===0 || text_area.length===0){
      setEditContent(false)
    }
     
      const data = {
        regex_area,
        text_area,
        flags
      }
      if (text_area && regex_area && isValidRegex(regex_area) && !typing && !editContent){
          askService(data)
      }
      else{
        if (!regex_area || !text_area){
          setMatches(null)
        }

      }
    },
     [regex_area, text_area, typing, flags, editContent])

  
  return (
    
    <>
      {
        waiting&&
          <div className="loader">
            <Spinner animation="border" variant='danger' />
          </div>
      }
      
      <Flags>
          <FlagItem icon={<i className="far fa-flag"></i>}>
              <DropdownMenu flags = {flags} setFlags= {setFlags}/>
          </FlagItem>
      </Flags>

      <main className = "main-container">
      
        <div className="container">
          {regex_area.length<=0  || !matches  || matches.newContent<=0 || editContent?
            <textarea
            className = "text-area"
            onChange = {addText}
            value = {text_area}
            name = "text-area"
            id="text-area"
            placeholder="Content goes here..."
            ref={textareaRef}
            />
            :
            <>
              <div id= "backdrop" className="backdrop"  ref={highlightsRef}>
                  <div className="highlights" id="highlights" dangerouslySetInnerHTML={{ __html: matches.newContent}}>
                  </div>
              </div>
              {/* <textarea
                highlight = {highlight}
                className = "text-area"
                onChange = {addText}
                value = {text_area}
                name = "text-area"
                id="text-area"
                placeholder="Content goes here..."
                onScroll={e=>handleScroll(e)}
                ref={textareaRef}
              />         */}
            </>   
          }
        </div>

         <div>
            <textarea className = "regex-area" onChange = {addText} value = {regex_area} name = "regex-area"  placeholder="Regex goes here..."/>
            <div className="data-area">
              {matches &&  matches.data.length >0 && !editContent ? <button className="btn next-match-btn" onClick={scrollToMatch}>Next Match </button>: <div></div>}
              {matches ? <button className="btn search-btn" onClick={()=> setEditContent(prev=> !prev)}>{ !editContent? "Edit Content" : "Search For Matches" }</button>: <div></div>}    
              {matches && matches.data.length > 1  && !editContent && <div className="num-matches">{`${matches.data.length} matches found`}</div>}
              {matches && matches.data.length === 1 && !editContent && <div className="num-matches">{`${matches.data.length} match found`}</div>}
              {matches && matches.data.length < 1  && !editContent && <div className="num-matches">No matches found</div>}
              {matches && matches.data.length > 0  && !editContent && <div className="duration">{`duration: ${matches.duration}`}</div>}
            </div>
              {matches  && matches.data.length>0 && !editContent && <Table matches = {matches} text_area = {text_area}/>}
         </div>
      </main>

    </>
  );
}

export default App;
