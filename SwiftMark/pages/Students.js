import { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Path, Svg } from 'react-native-svg'
import AsyncStorage from '@react-native-async-storage/async-storage'

//components
import Navbar from '../components/Navbar'

//themes
import { COLORS, FONTS } from '../styles/theme'
import { ScrollView } from 'react-native-gesture-handler'

export default function Students({ route, navigation }) {
	const { course, batch, date } = route.params

	const [students, setStudents] = useState([])
	const [dateIndex, setDateIndex] = useState()
	const [stats, setStats] = useState([])
	const [status, setStatus] = useState([
		COLORS?.lightRed,
		COLORS?.green,
		COLORS?.yellow,
		COLORS?.borderGrey,
	])
	const [avg, setAvg] = useState(0)

	useEffect(() => {
		if (course == null) return
		async function fetch() {
			AsyncStorage.getItem(course)
				.then((res) => {
					res = JSON.parse(res)
					setDateIndex(res.batches[batch]['date'].indexOf(date))
					setStudents(res.batches[batch].students)
				})
				.catch((e) => {
					console.log(e)
				})
		}
		fetch()
	}, [])

	useEffect(() => {
		if (!students) return
		var tempStats = [0, 0, 0, 0]

		for (let i = 0; i < students.length; i++) {
			if (students[i].attendance[dateIndex] == 0) tempStats[2]++
			else if (students[i].attendance[dateIndex] == 1) tempStats[1]++
			else if (students[i].attendance[dateIndex] == 2) tempStats[3]++
			else tempStats[0]++
		}
		setStats(tempStats)

		/*=====  calculateAvgAttendance  ======*/

		setAvg((((tempStats[1] + tempStats[3]) / students.length) * 100).toFixed(2))
	}, [students])

	/*=============================================
	=               preventGoingBack              =
	=============================================*/

	navigation.addListener(
		'beforeRemove',
		(e) => {
			e.preventDefault()
			navigation.push('Mark')
		},
		[navigation]
	)

	return (
		<View style={{ flex: 1 }}>
			<StatusBar style='dark' />
			<View
				style={{
					paddingTop: 60,
					flexDirection: 'row',
					paddingRight: 20,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity style={{ padding: 20 }} onPress={() => navigation.push('Mark')}>
					<Svg
						width='20'
						height='20'
						viewBox='0 0 16 17'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<Path
							d='M9.99998 13.78L5.65331 9.4333C5.13998 8.91997 5.13998 8.07997 5.65331 7.56664L9.99998 3.21997'
							stroke='#525058'
							stroke-width='1.5'
							stroke-miterlimit='10'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</Svg>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						padding: 8,
						borderRadius: 50,
						backgroundColor: COLORS?.white,
						elevation: 3,
					}}
					activeOpacity={0.7}
					onPress={() => {
						navigation.push('StudentsSettings', {
							course: course,
							batch: batch,
							date: date,
							dateIndex: dateIndex,
						})
					}}
				>
					<Svg
						width='20'
						height='21'
						viewBox='0 0 20 21'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<Path
							d='M10 9.45834C10.3452 9.45834 10.625 9.73818 10.625 10.0833V14.25C10.625 14.5952 10.3452 14.875 10 14.875C9.65483 14.875 9.375 14.5952 9.375 14.25V10.0833C9.375 9.73818 9.65483 9.45834 10 9.45834Z'
							fill='black'
						/>
						<Path
							d='M10 8.5C10.4602 8.5 10.8332 7.62691 10.8332 7.16668C10.8332 6.70644 10.4601 6.33334 9.99984 6.33334C9.53959 6.33334 9.1665 6.70644 9.1665 7.16668C9.1665 7.62691 9.53975 8.5 10 8.5Z'
							fill='black'
						/>
						<Path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M2.7085 10.5C2.7085 6.47294 5.97309 3.20834 10.0002 3.20834C14.0272 3.20834 17.2918 6.47294 17.2918 10.5C17.2918 14.5271 14.0272 17.7917 10.0002 17.7917C5.97309 17.7917 2.7085 14.5271 2.7085 10.5ZM10.0002 4.45834C6.66345 4.45834 3.9585 7.16329 3.9585 10.5C3.9585 13.8368 6.66345 16.5417 10.0002 16.5417C13.3369 16.5417 16.0418 13.8368 16.0418 10.5C16.0418 7.16329 13.3369 4.45834 10.0002 4.45834Z'
							fill='black'
						/>
					</Svg>
				</TouchableOpacity>

				<View
					style={{
						position: 'absolute',
						top: 80,
						left: 0,
						right: 0,
						alignItems: 'center',
					}}
				>
					<Text
						style={{
							fontFamily: FONTS?.bold,
							color: COLORS?.subHeading,
							fontSize: 16,
							lineHeight: 19,
						}}
					>
						Mark attendance
					</Text>
				</View>
			</View>
			<View style={{ paddingLeft: 24, paddingRight: 24, marginTop: 20 }}>
				<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							paddingTop: 13,
							paddingBottom: 13,
							flex: 1 / 4,
							backgroundColor: COLORS?.borderGrey,
							borderRadius: 10,
							borderWidth: 3,
							borderStyle: 'solid',
							borderColor: '#E8E8E8',
						}}
					>
						<Svg
							width='19'
							height='20'
							viewBox='0 0 19 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<Path
								d='M9.50016 2.08337C5.13808 2.08337 1.5835 5.63796 1.5835 10C1.5835 14.3621 5.13808 17.9167 9.50016 17.9167C13.8622 17.9167 17.4168 14.3621 17.4168 10C17.4168 5.63796 13.8622 2.08337 9.50016 2.08337ZM12.9439 12.8263C12.9043 12.8938 12.8516 12.9527 12.789 12.9996C12.7264 13.0466 12.6551 13.0806 12.5793 13.0997C12.5034 13.1189 12.4245 13.1228 12.3471 13.1112C12.2697 13.0996 12.1954 13.0727 12.1285 13.0321L9.67433 11.5675C9.06475 11.2034 8.6135 10.4038 8.6135 9.69921V6.45337C8.6135 6.12879 8.88266 5.85962 9.20725 5.85962C9.53183 5.85962 9.801 6.12879 9.801 6.45337V9.69921C9.801 9.98421 10.0385 10.4038 10.2839 10.5463L12.7381 12.0109C13.0231 12.1771 13.1181 12.5413 12.9439 12.8263Z'
								fill='black'
							/>
						</Svg>
						<Text style={{ paddingLeft: 8, fontFamily: FONTS?.bold, fontSize: 16 }}>
							{stats[0]}
						</Text>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							paddingTop: 13,
							paddingBottom: 13,
							flex: 1 / 4,
							marginLeft: 10,
							backgroundColor: COLORS?.green,
							borderRadius: 10,
							borderWidth: 3,
							borderStyle: 'solid',
							borderColor: '#ABE2CB',
						}}
					>
						<Svg
							width='19'
							height='20'
							viewBox='0 0 19 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<Path
								d='M14.6776 3.76162L10.3235 2.13079C9.87221 1.96454 9.13596 1.96454 8.68471 2.13079L4.33055 3.76162C3.49138 4.07829 2.81055 5.05996 2.81055 5.95454V12.367C2.81055 13.0083 3.23013 13.8554 3.74471 14.2354L8.09888 17.4891C8.8668 18.067 10.1255 18.067 10.8935 17.4891L15.2476 14.2354C15.7622 13.8475 16.1818 13.0083 16.1818 12.367V5.95454C16.1897 5.05996 15.5089 4.07829 14.6776 3.76162ZM12.2551 8.19496L8.85096 11.5991C8.73221 11.7179 8.5818 11.7733 8.43138 11.7733C8.28096 11.7733 8.13055 11.7179 8.0118 11.5991L6.74513 10.3166C6.63471 10.2049 6.57278 10.0541 6.57278 9.89704C6.57278 9.73995 6.63471 9.58919 6.74513 9.47746C6.97471 9.24787 7.35471 9.24787 7.5843 9.47746L8.4393 10.3325L11.4239 7.34787C11.6535 7.11829 12.0335 7.11829 12.263 7.34787C12.4926 7.57746 12.4926 7.96537 12.2551 8.19496Z'
								fill='black'
							/>
						</Svg>

						<Text style={{ paddingLeft: 8, fontFamily: FONTS?.bold, fontSize: 16 }}>
							{stats[1]}
						</Text>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							paddingTop: 13,
							paddingBottom: 13,
							flex: 1 / 4,
							marginLeft: 10,
							backgroundColor: COLORS?.lightRed,
							borderRadius: 10,
							borderWidth: 3,
							borderStyle: 'solid',
							borderColor: '#FFA196',
						}}
					>
						<Svg
							width='19'
							height='20'
							viewBox='0 0 19 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<Path
								d='M14.6776 3.76162L10.3235 2.13079C9.87221 1.96454 9.13596 1.96454 8.68471 2.13079L4.33055 3.76162C3.49138 4.07829 2.81055 5.05996 2.81055 5.95454V12.367C2.81055 13.0083 3.23013 13.8554 3.74471 14.2354L8.09888 17.4891C8.8668 18.067 10.1255 18.067 10.8935 17.4891L15.2476 14.2354C15.7622 13.8475 16.1818 13.0083 16.1818 12.367V5.95454C16.1897 5.05996 15.5089 4.07829 14.6776 3.76162ZM11.6218 11.5595C11.503 11.6783 11.3526 11.7337 11.2022 11.7337C11.0518 11.7337 10.9014 11.6783 10.7826 11.5595L9.52388 10.3008L8.22555 11.5991C8.1068 11.7179 7.95638 11.7733 7.80596 11.7733C7.65555 11.7733 7.50513 11.7179 7.38638 11.5991C7.27596 11.4874 7.21403 11.3366 7.21403 11.1795C7.21403 11.0225 7.27596 10.8717 7.38638 10.76L8.68471 9.46162L7.41805 8.19496C7.30762 8.08322 7.2457 7.93246 7.2457 7.77537C7.2457 7.61828 7.30762 7.46753 7.41805 7.35579C7.64763 7.12621 8.02763 7.12621 8.25721 7.35579L9.51596 8.61454L10.743 7.38746C10.9726 7.15787 11.3526 7.15787 11.5822 7.38746C11.8118 7.61704 11.8118 7.99704 11.5822 8.22662L10.3551 9.45371L11.6139 10.7125C11.8514 10.95 11.8514 11.322 11.6218 11.5595Z'
								fill='black'
							/>
						</Svg>

						<Text style={{ paddingLeft: 8, fontFamily: FONTS?.bold, fontSize: 16 }}>
							{stats[2]}
						</Text>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							paddingTop: 13,
							paddingBottom: 13,
							flex: 1 / 4,
							marginLeft: 10,
							backgroundColor: COLORS?.yellow,
							borderRadius: 10,
							borderWidth: 3,
							borderStyle: 'solid',
							borderColor: '#FFEE93',
						}}
					>
						<Svg
							width='20'
							height='20'
							viewBox='0 0 20 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<Path
								d='M17.7267 13.1034L12.66 3.98337C11.9792 2.75629 11.0371 2.08337 10 2.08337C8.96296 2.08337 8.02088 2.75629 7.34004 3.98337L2.27338 13.1034C1.63213 14.2671 1.56088 15.3834 2.07546 16.2621C2.59004 17.1409 3.60338 17.6238 4.93338 17.6238H15.0667C16.3967 17.6238 17.41 17.1409 17.9246 16.2621C18.4392 15.3834 18.368 14.2592 17.7267 13.1034ZM9.40629 7.62504C9.40629 7.30046 9.67546 7.03129 10 7.03129C10.3246 7.03129 10.5938 7.30046 10.5938 7.62504V11.5834C10.5938 11.908 10.3246 12.1771 10 12.1771C9.67546 12.1771 9.40629 11.908 9.40629 11.5834V7.62504ZM10.5621 14.5205L10.4434 14.6155C10.3959 14.6471 10.3484 14.6709 10.3009 14.6867C10.2534 14.7105 10.2059 14.7263 10.1505 14.7342C10.103 14.7421 10.0475 14.75 10 14.75C9.95254 14.75 9.89713 14.7421 9.84171 14.7342C9.7921 14.7256 9.74407 14.7096 9.69921 14.6867C9.64875 14.6694 9.60083 14.6454 9.55671 14.6155L9.43796 14.5205C9.29546 14.37 9.20838 14.1642 9.20838 13.9584C9.20838 13.7525 9.29546 13.5467 9.43796 13.3963L9.55671 13.3013C9.60421 13.2696 9.65171 13.2459 9.69921 13.23C9.74671 13.2063 9.79421 13.1905 9.84171 13.1825C9.94463 13.1588 10.0555 13.1588 10.1505 13.1825C10.2059 13.1905 10.2534 13.2063 10.3009 13.23C10.3484 13.2459 10.3959 13.2696 10.4434 13.3013L10.5621 13.3963C10.7046 13.5467 10.7917 13.7525 10.7917 13.9584C10.7917 14.1642 10.7046 14.37 10.5621 14.5205Z'
								fill='black'
							/>
						</Svg>

						<Text style={{ paddingLeft: 8, fontFamily: FONTS?.bold, fontSize: 16 }}>
							{stats[3]}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						height: 43,
						borderWidth: 1,
						borderStyle: 'solid',
						borderColor: COLORS?.borderGrey,
						borderRadius: 10,
						marginTop: 10,
						justifyContent: 'space-around',
					}}
				>
					<Text style={{ fontFamily: FONTS?.bold, fontSize: 16 }}>
						Total students: {students?.length}
					</Text>
					<Text style={{ fontFamily: FONTS?.bold, fontSize: 16 }}>{avg}%</Text>
				</View>
			</View>
			<Text style={{ fontFamily: FONTS?.bold, fontSize: 16, paddingLeft: 24, marginTop: 25 }}>
				Students:
			</Text>
			<View
				style={{
					paddingLeft: 24,
					paddingRight: 24,
					width: '100%',
					marginTop: 10,
					marginBottom: 378,
				}}
			>
				{students.length > 0 && (
					<FlatList
						keyExtractor={(student) => student.rollNumber}
						data={students}
						renderItem={({ item, index }) => (
							<TouchableOpacity
								rollNumber={item.rollNumber}
								style={{
									marginTop: 8,
									paddingLeft: 16,
									paddingBottom: 12,
									paddingTop: 12,
									borderColor: `${status[item.attendance[dateIndex]]}`,
									backgroundColor: `${status[item.attendance[dateIndex]]}`,
									borderWidth: 1,
									borderRadius: 10,
									width: '100%',
								}}
								activeOpacity={0.4}
								onPress={() =>
									navigation.push('Student', {
										course: course,
										batch: batch,
										id: index,
										date: date,
										dateIndex: dateIndex,
									})
								}
							>
								<Text
									style={{ fontSize: 18, fontFamily: FONTS?.regular, width: '75%' }}
									numberOfLines={1}
								>
									{item.studentName}
								</Text>
							</TouchableOpacity>
						)}
					/>
				)}
			</View>

			<Navbar />
		</View>
	)
}
