"use client";

export function MultiSelect({label,options,value,onChange}:any){
 const selected=Array.isArray(value)?value:[];
 const toggle=(option:string)=>onChange(selected.includes(option)?selected.filter((item:string)=>item!==option):[...selected,option]);
 return <label className="multiField"><span>{label}</span><details className="multiSelect"><summary>{selected.length?selected.join(", "):"Select one or more"}</summary><div>{options.map((option:string)=><label key={option}><input type="checkbox" checked={selected.includes(option)} onChange={()=>toggle(option)}/><span>{option}</span></label>)}</div></details></label>
}
