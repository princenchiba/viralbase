import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material'

import { db} from '../../fire'
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import axios from 'axios'
import {useHistory} from 'react-router-dom';

function Promotion({match}) {

	const history = useHistory();

	useEffect(()=>{
		execute();
	},[])
	// get the related promotion
	// add fifty naira to the promoters account
	// add the gotten impression to the promoter, the promotion, the ad and the owner of the ad
	// subtract the impression from the owner of the ad
	// redirect to wherever the ad link goes.

	const execute = async ()=>{
		//get the related promotion
		const promoRef = doc(db, 'promotions', match.params.promo);
		const promoSnap = await getDoc(promoRef);
		console.log('started')
		if (promoSnap.exists()) {
			// get the related advertiser
			console.log(promoSnap.data())
			const adRef = doc(db, 'users',promoSnap.data().advertiser);
			const adSnap = await getDoc(adRef);
			if (adSnap.exists()){
				// get the device ip address
				const res = await axios.get('https://geolocation-db.com/json/');
				const ip = res.data.IPv4;
				let ispresent = false;
				// check if the device ip address already exists in the promotion's array of addresses
				if (promoSnap.data().addresses){
					promoSnap.data().addresses.forEach((address)=>{
						if (address === ip){
							ispresent = true;
						}
					})
				}
				
				if ( ispresent){
					window.location.replace(`https://${promoSnap.data().link}`);
				} else {
					// check if the adertiser has enough impressions
					if (adSnap.data().availableImpressions > 0){
						// increment the impressions of the promotion by 1
						console.log('updating promotion')
						const ref = doc(db, "promotions", match.params.promo);
						await updateDoc(ref, {
							impressions: increment(1),
							addresses: arrayUnion(ip)
							// the rest will be handled by cloud functions
							// update the nummber of impressions for the promoter
						}).then( async ()=>{
							const ref = doc(db, "users", promoSnap.data().promoter);
							await updateDoc(ref, {
								impressions: increment(1), 
								earnings: increment(100) // give the promoter his/her earnings
								// update the nummber of impressions for the ad
							}).then( async ()=>{
								const ref = doc(db, "ads", promoSnap.data().ad);
								await updateDoc(ref, {
									impressions: increment(1)
									// update the nummber of impressions for the advertiser
								}).then( async ()=>{
									const ref = doc(db, "users", promoSnap.data().advertiser);
									await updateDoc(ref, {
										totalImpressions: increment(1),
										availableImpressions: increment(-1)
										// update the nummber of impressions for the advertiser
									}).then(()=>{
										// redirect to the promotions adlink
									window.location.replace(`https://${promoSnap.data().link}`);	
									})
								})
							})

							
						})
					} else {
						// deactivate the ad
						const ref = doc(db, "ads", promoSnap.data().ad);
						await updateDoc(ref, {
							active: false
						}).then(()=>{
							//redirect to 404 page
							history.push('/pagenotfound')
						})
					}
				}
				
			} else {
				history.push('/pagenotfound')
			}
		} else {
			history.push('/pagenotfound')
		}
	}

	return (
		<div style={{ height:'100vh', width:'100%', paddingTop:'40vh', position:'fixed', opacity:'0.5'}}>
			<div style={{width:'10em', height:'10em', margin:'auto', backgroundColor:'white', borderRadius:'1em', backgroundColor:'#B4B4B4' }}>
				<p style={{textAlign:'center', color:'var(--blueprimary)', margin:0}}>viralbase</p>
				<CircularProgress style={{marginTop:'3.5em', marginLeft:'3.5em', color:'var(--blueprimary)'}}/>
			</div>
		</div>
	)
}

export default Promotion