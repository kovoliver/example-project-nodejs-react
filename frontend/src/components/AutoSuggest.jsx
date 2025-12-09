import { useEffect, useState } from "react";

export function AutoSuggest({values, setValue, title}) {
    const [filtered, setFiltered] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selected, setSelected] = useState(false);

    const filter = ()=> {
        if(!inputValue) {
            setFiltered([]);
            return;
        }

        const ftd = values.filter(v=>v.toLowerCase().includes(inputValue.toLowerCase()));
        setFiltered(ftd);
    };

    useEffect(()=> {
        if(!selected) {
            filter();
        }

        setSelected(false);
    }, [inputValue]);

    const clickLi = (target)=> {
        if(!target) return;
        const newValue = target.getAttribute("val");
        if(!newValue) return;

        setInputValue(newValue);
        setValue(newValue);
        setFiltered([]);
        setSelected(true);
    };

    useEffect(()=> {
        setValue(inputValue);
    }, [inputValue]);

    return(
        <>
            <h4>{title}</h4>
            <input 
                onChange={e=>setInputValue(e.target.value)}
                value={inputValue}
                className="input-md input-primary wp-100"
            />

            <ul className="wp-100">
                {
                    filtered.map((v, i)=> 
                        <li key={i} val={v} onClick={e=>clickLi(e.target)}
                        className="h-30 bg-secondary text-white lh-30 bg-secondary-darker-hover cursor-pointer border-bottom-dark-1" 
                        >
                            {v}
                        </li>
                    )
                }
            </ul>
        </>
    );
};