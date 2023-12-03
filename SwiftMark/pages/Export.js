import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { Path, Svg } from 'react-native-svg'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jsonToCSV } from 'react-native-csv'
import { StorageAccessFramework } from 'expo-file-system'
import { StatusBar } from 'expo-status-bar'

//components
import Navbar from '../components/Navbar'

//themes
import { COLORS, FONTS } from '../styles/theme'

export default function Mark() {
	const navigation = useNavigation()

	const [courses, setCourses] = useState([])
	const [batches, setBatches] = useState([])
	const [course, setCourse] = useState(null)
	const [batch, setBatch] = useState(null)

	/*=============================================
	=                fetchCourses                 =
	=============================================*/
	useEffect(() => {
		async function fetch() {
			AsyncStorage.getAllKeys()
				.then((res) => {
					for (let i = 0; i < res.length; i++) {
						if (res[i] === 'settings') res.splice(i, 1)
					}
					setCourses(res.map((item, index) => ({ label: item, value: item })))
				})
				.catch((e) => {
					console.log(e)
				})
		}
		fetch()
	}, [])

	/*=============================================
	=                fetchClasses                 =
	=============================================*/
	useEffect(() => {
		if (course == null) return
		async function fetch() {
			AsyncStorage.getItem(course)
				.then((res) => {
					res = JSON.parse(res)
					res = Object.keys(res['batches'])
					setBatches(res.map((item, index) => ({ label: item, value: item })))
				})
				.catch((e) => {
					console.log(e)
				})
		}
		fetch()
	}, [course])

	async function handlePress() {
		if (course && batch) {
			AsyncStorage.getItem(course).then((res) => {
				const results = JSON.parse(res)

				const jsDate = new Date()
				const weekday = [
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
				]
				const [dotw, day, month, year, hours, minutes, seconds] = [
					weekday[jsDate.getDay()],
					jsDate.getDate(),
					jsDate.getMonth() + 1,
					jsDate.getFullYear(),
					jsDate.getHours(),
					jsDate.getMinutes(),
					jsDate.getSeconds(),
				]

				const date = String(
					dotw + ', ' + day + '/' + month + '/' + year + '-' + hours + ':' + minutes + ':' + seconds
				)
				const fileName = course + '|' + batch + ' || ' + date

				let header = ['Sno.', 'Roll No.', 'Student Name', 'Email ID']

				for (let i = 0; i < results['batches'][batch].date.length; i++) {
					header = [...header, results['batches'][batch].date[i]]
				}

				header = [...header, 'Percentage']

				let student = []

				for (let i = 0; i < results['batches'][batch].students.length; i++) {
					let temp = []
					let pCount = 0
					let tempAttendance = []
					if (results['batches'][batch].students[i].studentName != '') {
						for (let j = 0; j < results['batches'][batch].students[i].attendance.length; j++) {
							if (results['batches'][batch].students[i].attendance[j] == 0) tempAttendance.push('A')
							else if (results['batches'][batch].students[i].attendance[j] == 1) {
								tempAttendance.push('P')
								pCount += 1
							} else if (results['batches'][batch].students[i].attendance[j] == 2) {
								tempAttendance.push('L')
								pCount += 1
							} else if (results['batches'][batch].students[i].attendance[j] == 3)
								tempAttendance.push('N')
						}
						let pPercentage = (
							(pCount / results['batches'][batch].students[i].attendance.length) *
							100
						).toFixed(2)

						let emailId = results['batches'][batch].students[i].emailId
						if (emailId != null) emailId = emailId.trim()

						temp = [
							...temp,
							i + 1,
							results['batches'][batch].students[i].rollNumber.trim(),
							results['batches'][batch].students[i].studentName,
							emailId,
							...tempAttendance,
							pPercentage,
						]
					}
					student = [...student, temp]
				}

				StorageAccessFramework.requestDirectoryPermissionsAsync()
					.then((res) => {
						const folderLocation = res['directoryUri']
						const results = jsonToCSV({
							fields: header,
							data: student,
						})
						StorageAccessFramework.createFileAsync(folderLocation, fileName, 'text/csv').then(
							(res) => {
								StorageAccessFramework.writeAsStringAsync(res, results)
							}
						)
					})
					.catch((e) => {
						console.log(e)
					})
			})
		}
	}

	/**
	 *
	 * archive code
	 *
	 */

	// StorageAccessFramework.createFileAsync()

	// let fileUri = FileSystem.documentDirectory + 'savedFile.txt'
	// console.log(fileUri)
	// await FileSystem.writeAsStringAsync(fileUri, results, {
	// 	encoding: FileSystem.EncodingType.UTF8,
	// })

	// const preRes = MediaLibrary.requestPermissionsAsync()
	// console.log(preRes)

	// const albumRes = MediaLibrary.createAlbumAsync('download', fileUri)
	// console.log(albumRes)
	// }

	/*=============================================
	=               preventGoingBack              =
	=============================================*/

	navigation.addListener(
		'beforeRemove',
		(e) => {
			e.preventDefault()
			navigation.push('Home')
		},
		[navigation]
	)

	return (
		<View style={{ flex: 1 }}>
			<StatusBar style='dark' />
			<View
				style={{
					paddingTop: 60,
					backgroundColor:'beige',
					flexDirection: 'row',
					paddingRight: 20,
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{
						padding: 8,
						borderRadius: 50,
						backgroundColor: COLORS?.white,
						elevation: 3,
						marginTop: 10,
					}}
					activeOpacity={0.7}
					onPress={() => {
						navigation.push('ExportInfo')
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
						Export Attendance
					</Text>
				</View>
			</View>
			<View style={{ alignItems: 'center', marginTop: 32 }}>
				<View
					style={{
						height: 54,
						width: 54,
						justifyContent: 'center',
						alignItems: 'center',
						borderWidth: 1,
						borderColor: COLORS.borderGrey,
						borderRadius: 15,
					}}
				>
					<Svg
						width='30'
						height='30'
						viewBox='0 0 30 30'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<Path
							d='M21 11.25H15.9375V19.0625C15.9375 19.575 15.5125 20 15 20C14.4875 20 14.0625 19.575 14.0625 19.0625V11.25H9C5 11.25 2.5 13.75 2.5 17.75V20.9875C2.5 25 5 27.5 9 27.5H20.9875C24.9875 27.5 27.4875 25 27.4875 21V17.75C27.5 13.75 25 11.25 21 11.25Z'
							fill='#294F82'
						/>
						<Path
							d='M15.9375 5.70128L18.525 8.28878C18.7125 8.47628 18.95 8.56378 19.1875 8.56378C19.425 8.56378 19.6625 8.47628 19.85 8.28878C20.2125 7.92628 20.2125 7.32628 19.85 6.96378L15.6625 2.77628C15.4861 2.60193 15.248 2.50415 15 2.50415C14.752 2.50415 14.5139 2.60193 14.3375 2.77628L10.15 6.96378C9.78749 7.32628 9.78749 7.92628 10.15 8.28878C10.5125 8.65128 11.1125 8.65128 11.475 8.28878L14.0625 5.70128V11.2513H15.9375V5.70128Z'
							fill='#294F82'
						/>
					</Svg>
				</View>
				<View>
					<Text
						style={{
							fontFamily: FONTS?.bold,
							fontSize: 16,
							lineHeight: 19,
							marginBottom: 6,
							marginTop: 70,
						}}
					>
						Course:
					</Text>
					<Dropdown
						style={styles.dropdown}
						placeholder='Select course'
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						data={courses}
						autoScroll={false}
						maxHeight={300}
						containerStyle={{ marginTop: -50, borderRadius: 7 }}
						itemTextStyle={{
							fontFamily: FONTS?.regular,
							fontSize: 14,
							marginLeft: -5,
						}}
						labelField='label'
						valueField='value'
						value={course}
						onChange={(item) => {
							setCourse(item.value)
						}}
						renderRightIcon={() => (
							<Svg
								width='16'
								height='16'
								viewBox='0 0 16 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<Path
									d='M13.28 5.96667L8.9333 10.3133C8.41997 10.8267 7.57997 10.8267 7.06664 10.3133L2.71997 5.96667'
									stroke='#838383'
									stroke-width='1.5'
									stroke-miterlimit='10'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
							</Svg>
						)}
					/>
				</View>
				<View>
					<Text
						style={{
							fontFamily: FONTS?.bold,
							fontSize: 16,
							lineHeight: 19,
							marginBottom: 6,
							marginTop: 15,
						}}
					>
						Batch:
					</Text>
					<Dropdown
						style={styles.dropdown}
						placeholder='Select batch'
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						data={batches}
						autoScroll={false}
						maxHeight={300}
						containerStyle={{ marginTop: -50, borderRadius: 7 }}
						itemTextStyle={{
							fontFamily: FONTS?.regular,
							fontSize: 14,
							marginLeft: -5,
						}}
						labelField='label'
						valueField='value'
						value={batch}
						onChange={(item) => {
							setBatch(item.value)
						}}
						renderRightIcon={() => (
							<Svg
								width='16'
								height='16'
								viewBox='0 0 16 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<Path
									d='M13.28 5.96667L8.9333 10.3133C8.41997 10.8267 7.57997 10.8267 7.06664 10.3133L2.71997 5.96667'
									stroke='#838383'
									stroke-width='1.5'
									stroke-miterlimit='10'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
							</Svg>
						)}
					/>
				</View>
				<TouchableOpacity
					style={{
						height: 43,
						width: 190,
						backgroundColor: COLORS?.blue,
						alignItems: 'center',
						borderRadius: 10,
						flexDirection: 'row',
						justifyContent: 'center',
						marginTop: 40,
					}}
					onPress={handlePress}
					activeOpacity={0.7}
				>
					<Svg
						width='20'
						height='19'
						viewBox='0 0 20 19'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<Path
							d='M16.729 8.06709H14.4411C12.5648 8.06709 11.0369 6.53918 11.0369 4.66293V2.37501C11.0369 1.93959 10.6807 1.58334 10.2453 1.58334H6.88859C4.45025 1.58334 2.479 3.16668 2.479 5.99293V13.0071C2.479 15.8333 4.45025 17.4167 6.88859 17.4167H13.1111C15.5494 17.4167 17.5207 15.8333 17.5207 13.0071V8.85876C17.5207 8.42334 17.1644 8.06709 16.729 8.06709ZM10.2215 12.4925L8.63817 14.0758C8.58275 14.1313 8.5115 14.1788 8.44025 14.2025C8.37072 14.2344 8.2951 14.251 8.21859 14.251C8.14207 14.251 8.06646 14.2344 7.99692 14.2025C7.93142 14.1751 7.87217 14.1347 7.82275 14.0838C7.81484 14.0758 7.80692 14.0758 7.80692 14.0679L6.22359 12.4846C6.11317 12.3729 6.05124 12.2221 6.05124 12.065C6.05124 11.9079 6.11317 11.7572 6.22359 11.6454C6.45317 11.4158 6.83317 11.4158 7.06275 11.6454L7.62484 12.2233V8.90626C7.62484 8.58168 7.894 8.31251 8.21859 8.31251C8.54317 8.31251 8.81234 8.58168 8.81234 8.90626V12.2233L9.38234 11.6533C9.61192 11.4238 9.99192 11.4238 10.2215 11.6533C10.4511 11.8829 10.4511 12.2629 10.2215 12.4925Z'
							fill='white'
						/>
						<Path
							d='M14.2987 6.9746C15.0507 6.98252 16.0957 6.98251 16.9903 6.98251C17.4416 6.98251 17.6791 6.4521 17.3624 6.13543C16.2224 4.98751 14.1799 2.92126 13.0082 1.7496C12.6837 1.42501 12.1216 1.64668 12.1216 2.09793V4.86085C12.1216 6.01668 13.1032 6.9746 14.2987 6.9746Z'
							fill='white'
						/>
					</Svg>
					<Text
						style={{
							paddingLeft: 10,
							fontFamily: FONTS?.regular,
							fontSize: 16,
							color: COLORS?.white,
						}}
					>
						Export attendance
					</Text>
				</TouchableOpacity>
			</View>
			<Navbar />
		</View>
	)
}

const styles = StyleSheet.create({
	dropdown: {
		height: 50,
		borderColor: COLORS?.borderGrey,
		borderWidth: 1,
		width: 270,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 7,
	},
	placeholderStyle: {
		fontFamily: FONTS?.regular,
		fontSize: 14,
		color: COLORS?.placeholder,
	},
	selectedTextStyle: {
		fontFamily: FONTS?.regular,
		fontSize: 14,
		color: COLORS?.black,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
})
