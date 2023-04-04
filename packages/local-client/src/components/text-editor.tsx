import MDEditor from '@uiw/react-md-editor';
import {useState, useEffect, useRef} from 'react';
import React from 'react';
import {Cell} from '../state/cell';
import './text-editor.css';

import {useActions} from '../hooks/use-actions';

interface TextEditorProp {

    cell:Cell
}

const TextEditor:React.FC<TextEditorProp> =({cell}) => {


   const {updateCell} = useActions(); 

const [editing, setEditing] = useState(false);
const ref = useRef<HTMLDivElement | null>(null);


useEffect(()=> {

    const listener = (event: MouseEvent) => {
        if(ref.current && event.target && ref.current.contains(event.target as Node)){  // dont sweatit typesCript with Node anything make sens
                    console.log('element clicled on is inside editor');
                    return;
        }
        
        console.log('element clicked is not inside editor');
        setEditing(false);
    }
    document.addEventListener('click', listener, {capture:true});// new version of React, object with third saver argument

    return ()=> {

        document.removeEventListener('click', listener, {capture:true}); 

    }


}, [])

// v || ''  if is undefined v then let it be string :)
if(editing){
    return (
        <div className="text-editor card" ref={ref}>
           
            <MDEditor value={cell.content} onChange={(v)=> updateCell(cell.id, v || '') } />  
      
        </div>
    )

}
    return ( <div className="text-editor" onClick={() => setEditing(true)}>
         <div className= "card-content">
    <MDEditor.Markdown source={cell.content || 'click to edit'}/>
    </div>
    </div>);



}

export default TextEditor;