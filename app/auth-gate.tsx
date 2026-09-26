"use client";
import {useEffect,useState} from "react";
import {AlertCircle,Lock} from "lucide-react";

const SUPABASE_URL="https://tnhbwgxibipfohwsczwi.supabase.co";
const SUPABASE_KEY="sb_publishable_23WJp-uRdOEnlEXuvUu2Kg_Suwo9HZc";
const SESSION_KEY="capital-sync-auth-session-v1";

type StoredSession={access_token:string;refresh_token?:string;expires_at:number};

async function verifySession(session:StoredSession){
  if(!session.access_token||session.expires_at<=Math.floor(Date.now()/1000))return null;
  const response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`}});
  return response.ok?response.json():null;
}

function sessionFromHash():StoredSession|null{
  const params=new URLSearchParams(window.location.hash.slice(1));
  const access_token=params.get("access_token"),refresh_token=params.get("refresh_token")||undefined;
  if(!access_token)return null;
  const expiresIn=Math.max(60,Number(params.get("expires_in")||3600));
  window.history.replaceState({},document.title,window.location.pathname+window.location.search);
  return {access_token,refresh_token,expires_at:Math.floor(Date.now()/1000)+expiresIn};
}

export function AuthGate({complete}:any){
  const[loading,setLoading]=useState(true),[error,setError]=useState(""),[email,setEmail]=useState("demo@capitalsync.com"),[password,setPassword]=useState("demo1234");
  useEffect(()=>{let active=true;(async()=>{try{
    const callbackSession=sessionFromHash();
    const stored=callbackSession||JSON.parse(localStorage.getItem(SESSION_KEY)||"null");
    const user=stored?await verifySession(stored):null;
    if(stored&&user){localStorage.setItem(SESSION_KEY,JSON.stringify(stored));if(active)complete(user);return}
    localStorage.removeItem(SESSION_KEY);
    if(new URLSearchParams(window.location.search).get("error_description"))setError("Google sign-in was not completed. Please try again.");
  }catch{localStorage.removeItem(SESSION_KEY);setError("We could not verify your session. Please try again.")}finally{if(active)setLoading(false)}})();return()=>{active=false}},[complete]);
  const enterDemo=()=>{if(email.trim().toLowerCase()==="demo@capitalsync.com"&&password==="demo1234"){complete({id:"demo-user",email,user_metadata:{full_name:"Demo User"},isDemo:true});return}setError("Use the demo credentials shown below to enter the sample workspace.")};
  return <main className="authPage"><section className="authBrand"><Logo/><div><span>FUNDRAISING INTELLIGENCE</span><h1>Turn every LP relationship into institutional memory.</h1><p>A focused workspace for GP fundraising teams to understand fit, momentum, and the next best action.</p></div><small><Lock/> Private workspace · Capital Sync</small></section><section className="authPanel"><div className="authCard demoLogin"><Logo/><div className="authCopy"><small>TEAM SIGN IN</small><h2>Welcome back</h2><p>Access your GP–LP fundraising workspace.</p></div>{error&&<div className="authError" role="alert"><AlertCircle/>{error}</div>}<label className="plainAuthField"><span>Work email</span><input autoFocus type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="plainAuthField"><span>Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enterDemo()}/></label><button className="authPrimary" onClick={enterDemo}>Enter workspace <span>→</span></button><div className="demoAccess"><Lock/><p><b>Demo access</b><span>demo@capitalsync.com&nbsp;&nbsp;·&nbsp;&nbsp;demo1234</span></p></div></div></section></main>
}

function Logo(){return <div className="authLogo"><span className="authLogoMark" aria-hidden="true">CS</span><span><b>CAPITAL SYNC</b><small>Fundraising intelligence</small></span></div>}
