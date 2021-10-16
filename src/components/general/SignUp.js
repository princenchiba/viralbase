import React, {useEffect, useState} from 'react'
import SpinnerDiv from './SpinnerDiv';
import {Link, useHistory} from 'react-router-dom';

import {db, auth} from '../../fire'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import './signup.css'

function SignUp({match}){

	const [title, setTitle] = useState('Full Name') // the title of the name input

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState(''); //phone number
	const [password, setPassword] = useState('');

	const[progressDisplay, setProgressDisplay] = useState('none')

	const history = useHistory();

	//const user = {};

	useEffect(()=>{
		console.log(match)
		if (match.params.role === 'advertiser'){
			setTitle('Business name');
		}
	})

	const register = async(e)=>{
		// if role is advertiser
		// register as advertiser
		// if role is promoter 
		// register as promoter
		//show progress bar
		setProgressDisplay('block')
		e.preventDefault();
		if (match.params.role === 'advertiser'){
			createUserWithEmailAndPassword(auth, email, password).
			then(()=>{
				onAuthStateChanged(auth, async (user)=>{
					if (user){
						// set up the users profile in firestore
						await setDoc(doc(db, 'users', user.uid), {
							businessName: name, phoneNumber: phone, 
							role: 'advertiser', impressions:0,
							activeAds:0, totalImpressions:0,
							availableImpressions:0
						}).then(()=>{
							console.log('firestore setup successful');
							history.push('/advertiser/dashboard/Home')
						})
					}
				})
			}
			).catch((error)=>{
				const errorCode = error.code;
    			const errorMessage = error.message;
				console.log(errorMessage, errorCode)
			})
			console.log('you are a new advertiser')
		} else {
			// do something for promoter
			createUserWithEmailAndPassword(auth, email, password).
			then(()=>{
				onAuthStateChanged(auth, async (user)=>{
					if (user){
						console.log(user.uid);
						// set up the users profile in firestore
						await setDoc(doc(db, 'users', user.uid), {
							name: name, phoneNumber: phone, 
							role: 'promoter'
						}).then(()=>{
							console('firestore setup successful')
						})
					}
				})
			}
			).catch((error)=>{
				const errorCode = error.code;
    			const errorMessage = error.message;
				console.log(errorMessage, errorCode)
			})
			console.log('you are a new promoter')
		}
	}

	return(

		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<SpinnerDiv show={progressDisplay} />
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				<div style={{textAlign:'center', }}>
					<h3>Create a free account</h3>
					<p>welcome to the future of marketing</p>
				</div>
				<form onSubmit={register} style={{padding:'1em'}}>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>{title}</p>
						<input required type='text' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={name} onChange={(e)=>{setName(e.target.value)}}/>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Email</p>
						<input required type='email' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Phone Number</p>
						<input required type='phone number' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={phone} onChange={(e)=>{setPhone(e.target.value)}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Password</p>
						<input required type='password' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={password} onChange={(e)=>{setPassword(e.target.value)}} />
					</div>
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Create account</button>
				</form>
				<p style={{textAlign:'center', fontSize:'.7em'}}>Already have an account? <Link to='/login'>Log in</Link></p>
			</div>
		</div>

	)
}

export default SignUp;