import { useRef, FormEvent } from "react";
import React from "react";
import "./Style/useInputField.css"


export type InputFieldControls = {
    setInputLoading: () => void,
    setInputValid: () => void,
    setInputInvalid: () => void,
    resetInput: () => void,
}

export function useInputField(
    {onFocus= ()=>{}, onBlur= ()=>{}, onSubmit, placeholder, defaultValue=''}: {
        onFocus?: () => void,
        onBlur?: () => void,
        onSubmit: (inputTerm: string, controls: InputFieldControls) => void,
        placeholder: string,
        defaultValue?: string,
    }
): { inputFieldRender: React.JSX.Element, controls: InputFieldControls } {

    const inputRef = useRef<HTMLInputElement>(null);

    const setInputColor = (color: string) => {
        if(inputRef.current) inputRef.current.style.backgroundColor = color
    }

    const controls: InputFieldControls = {
        setInputLoading: () => {setInputColor('#ccc')},
        setInputValid: () => {setInputColor('#4f80e277')},
        setInputInvalid: () => {setInputColor('pink')},
        resetInput: () => {setInputColor('white')}
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputRef.current) return;
        onSubmit(inputRef.current.value, controls)
    }

    const inputForm = (
        <form className='InputBox' onSubmit={(e) => handleSubmit(e)}>
            <input 
                type={'text'} 
                ref={inputRef} 
                onChange={() => controls.resetInput()}
                placeholder={placeholder} 
                defaultValue={defaultValue}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </form>
    )

    return {
        inputFieldRender: inputForm,
        controls: controls,
    }
}