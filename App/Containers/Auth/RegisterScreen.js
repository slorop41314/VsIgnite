import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Styled, CustomInput, CustomButton } from 'react-native-awesome-component'
import { DefaultAccount } from '../../Data/Const'
import Strings from '../../Themes/Strings'
import AuthActions from '../../Redux/AuthRedux'

const styles = StyleSheet.create({
	logo: {
		width: 125,
		height: 203,
		alignSelf: 'center',
		marginBottom: 40,
	},
	container: {
		paddingTop: '30%'
	},
	button: {
		marginTop: 25
	}
})

class RegisterScreen extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: DefaultAccount.name,
			photoUrl: DefaultAccount.photoUrl,
			email: DefaultAccount.email,
			password: DefaultAccount.password,

			nameError: true,
			photoUrlError: true,
			emailError: true,
			passwordError: true,
		}

		this.onPressRegister = this.onPressRegister.bind(this)
	}

	onPressRegister() {
		const { registerRequest } = this.props
		const { name, email, password, photoUrl } = this.state

		registerRequest({ name, email, password, photoUrl })
	}

	render() {
		const { email, password, photoUrl, name, emailError, passwordError, nameError } = this.state
		return (
			<Styled.FlexContainer padded>
				<CustomInput
					setRef={r => this.nameInput = r}
					label={Strings.input.label.name}
					placeholder={Strings.input.placeholder.email}
					onChangeText={(name) => this.setState({ name })}
					defaultValue={name}
					value={name}
					inputType='text'
					isRequired={true}
					onChangeValidation={(isError) => this.setState({ nameError: isError })}
					onSubmitEditing={() => this.photoUrlInput.focus()}
				/>
				<CustomInput
					setRef={r => this.photoUrlInput = r}
					label={Strings.input.label.photoUrl}
					placeholder={Strings.input.placeholder.photoUrl}
					onChangeText={(photoUrl) => this.setState({ photoUrl })}
					defaultValue={photoUrl}
					value={photoUrl}
					inputType='text'
					isRequired={false}
					onChangeValidation={(isError) => this.setState({ photoUrlError: isError })}
					onSubmitEditing={() => this.emailInput.focus()}
				/>
				<CustomInput
					setRef={r => this.emailInput = r}
					label={Strings.input.label.email}
					placeholder={Strings.input.placeholder.email}
					onChangeText={(email) => this.setState({ email })}
					defaultValue={email}
					value={email}
					inputType='email'
					isRequired={true}
					onChangeValidation={(isError) => this.setState({ emailError: isError })}
					onSubmitEditing={() => this.passwordInput.focus()}
				/>
				<CustomInput
					setRef={r => this.passwordInput = r}
					label={Strings.input.label.password}
					placeholder={Strings.input.label.password}
					onChangeText={(password) => this.setState({ password })}
					defaultValue={password}
					value={password}
					inputType='password'
					isRequired={true}
					onChangeValidation={(isError) => this.setState({ passwordError: isError })}
				/>
				<CustomButton
					title={Strings.button.register}
					containerStyle={styles.button}
					onPress={this.onPressRegister}
					disabled={(emailError || passwordError || nameError) ? true : false}
				/>
			</Styled.FlexContainer>
		)
	}
}

const mapStateToProps = (state) => {
	return {

	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		registerRequest: (params) => dispatch(AuthActions.registerRequest(params))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)