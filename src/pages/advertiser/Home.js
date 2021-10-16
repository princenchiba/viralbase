import React, {useState, useEffect} from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox';
import AdCard from '../../components/advertiser/AdCard'
import { Button } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import SpinnerDiv from '../../components/general/SpinnerDiv'

import {auth, db} from '../../fire'
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from '@firebase/firestore';

import { useHistory } from 'react-router-dom';

import './adhome.css'


function Home() {

	const history = useHistory();

	const [userData, setUserData] = useState({});
	const[progressDisplay, setProgressDisplay] = useState('none')

	useEffect(()=>{
		getUserData();
	}, [])

	const getUserData = async ()=>{
		setProgressDisplay('block');
		onAuthStateChanged(auth, async (user)=>{
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const userDoc = docSnap.data();
				setUserData(userDoc);
				setProgressDisplay('none');
			} else{
				setProgressDisplay('none');
			}
		})
	}

	const toImpressionPurchasePage =()=>{
		history.push('/advertiser/purchaseimpressions')
	}

	const toAdCreation =()=>{
		history.push('/advertiser/createad');
	}

	return (
		<div className='ad_home_container'>
			<SpinnerDiv show={progressDisplay} />
		<div style={{flex:1}}>
			<p className='home_business_name' style={{fontWeight:'700'}}>{userData.businessName}</p>
			<div className='home_info_div' style={{ justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column',
				 marginLeft:'auto', marginRight:'auto'}}>
				<p style={{fontWeight:'500', color:'var(--blueprimary)', marginBottom:'-1.5em'}}>Available impressions</p>
				<div style={{display:'flex'}}>
					<p style={{fontSize:'2em', fontWeight:'bold'}}>{userData.availableImpressions}</p>
					<AddBoxIcon className='home_add_btn' style={{color:'var(--blueprimary)', marginTop:'1.9em'}}
						onClick={toImpressionPurchasePage}/>
				</div>
				<button className='home_big_add_btn' style={{fontSize:'1em', backgroundColor:'var(--blueprimary)',
					border:'none', paddingTop:'.7em', paddingBottom:'.7em', borderRadius:'.5em',
					color:'white', width:'10em', marginTop:'-2em', display:'none'}} onClick={toImpressionPurchasePage}>Buy impressions</button>
			</div>
			<div>
					<div className='ad_home_stat_container'>
						<div className="ad_home_impressions_div">
							<p className='ad_home_impressions_count'>{userData.totalImpressions}</p>
							<p className='ad_home_impressions_text'>total impressions</p>
						</div> 
						<div className='ad_home_activeads_div'>
							<p className='ad_home_activeads_count'>{userData.activeAds}</p>
							<p className='ad_home_activeads_text'>active ads</p>
						</div>
					</div>
				</div>

				<div style={{display:'flex', justifyContent:'space-between', marginTop:'1em', paddingLeft:'1em',
					paddingRight:'1em'}}>
					<p>Your ads</p>
					<AddBoxIcon className='home_add_btn' style={{color:'var(--blueprimary)', marginTop:'.7em'}} onClick={toAdCreation}/>
					<Button className='home_createbutton' variant="contained" startIcon={<AddRoundedIcon />} style={{height:'1em', padding:'1.4em',
					 dropShadow:'none', marginTop:'1.2em', marginLeft:'1.2em', 
					 maxWidth:'12em', textTransform: 'lowercase', flex: 1, display:'none',
					  fontWeight:'700', backgroundColor: 'var(--blueprimary)', color: 'white', marginBottom:'1em'}} onClick={toAdCreation}>
						create new ad
					</Button> 
				</div>
				<div className='home_ad_list' style={{display:'grid', gridTemplateColumns:'auto auto', marginLeft:'1em', overflow:'auto',
					maxHeight:'25em'}}>
					<AdCard/>
				</div>
		</div>
		<div >
			<div style={{display:'none'}} className='ad_home_stat_container2'>
				<div className="ad_home_impressions_div">
					<p className='ad_home_impressions_count'>{userData.totalImpressions}</p>
					<p className='ad_home_impressions_text'>total impressions</p>
				</div> 
				<div className='ad_home_activeads_div'>
					<p className='ad_home_activeads_count'>{userData.activeAds}</p>
					<p className='ad_home_activeads_text'>active ads</p>
				</div>
			</div>
			</div>
		</div>
	)
}

export default Home