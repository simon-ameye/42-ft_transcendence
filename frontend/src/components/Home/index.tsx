import { Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Default from '../../layouts/Default';
import './style.scss'

const Home = () => {

	const [cookie] = useCookies(['displayName']);
	const [RowData, setRowData] = useState([]);

	

	const columns: GridColDef[] = [{
		field: "id",
		headerName: "ID",
		width: 170
	},
	{
		field: "name",
		headerName: "name",
		width: 170
	},
	{
		field: "victories",
		headerName: "victories",
		width: 170
	}]

	useEffect(() => {
		axios.get("http://localhost:3001/leaderboard/getLeaderBoard").then((res) => {
			console.log(res);
			setRowData(res.data)
			console.log(RowData)
		}).catch((error) => {
			console.log(error);
		})
	}, [])

	return (
		<Default>
			<div className='homeContent'>
				<h3>Pong Game - ft_transcendence</h3>
				<p className='pongHistory'>
					Pong is a table tennis–themed twitch arcade sports video game, featuring simple two-dimensional graphics, manufactured by Atari and originally released in <span>1972</span>. It was one of the earliest arcade video games; it was created by <span>Allan Alcorn</span> as a training exercise assigned to him by Atari co-founder Nolan Bushnell, but Bushnell and Atari co-founder Ted Dabney were surprised by the quality of Alcorn's work and decided to manufacture the game.
				</p>
			</div>
			<div>
				<br></br>
				<h1> Hello {cookie.displayName}!</h1>
				<div className='test'>
					<Box
						sx={{
							height:200,
							width:550,
						}}
						>
						<Typography
						variant='h5'
						component='h5'
						sx={{
							textAlign:'center', 
							mt:2, 
							mb:2,
							overflow: 'none'
						}}
					>
						Leaderboard
						</Typography>
					<DataGrid rows={RowData} columns={columns}/>
				</Box>
				</div>
			</div>
		</Default>
	);
};

export default Home;
