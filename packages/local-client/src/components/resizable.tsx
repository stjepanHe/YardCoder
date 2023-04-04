import './resizable.css';
import {useEffect, useState} from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import React from 'react';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
    const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);


  // koristiom za window smanjivanje sa korištenjem statea
  useEffect(()=> {

    let timer: any;

    const listener = () => {
        if (timer){
            clearTimeout(timer);
        }

        timer = setTimeout(()=> {

            setInnerHeight(window.innerHeight);
            setInnerWidth(window.innerWidth);
            if(window.innerWidth * 0.75 < width){
                setWidth(window.innerWidth * 0.75);
            }

        }, 100)
      
    }

    window.addEventListener('resize', listener); // resize je event

    return () => {
        window.removeEventListener('resize', listener) // kada prestane radit komponenta, mi cemo s ovim napraviti clean up
    }

  }, [])

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      height: Infinity,
      width: width,
      resizeHandles: ['e'],
      onResizeStop: (event, data) => {
          setWidth(data.size.width)
            console.log(data);
      }
    };
  } else {
    resizableProps = {
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
