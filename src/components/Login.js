import React, { Component } from "react";
import Spinner from 'react-spinner-material';
import { Button, Form, Header, Icon } from "semantic-ui-react";
import { availableEnvironments, createSdk } from '@archanova/wallet-sdk';
import Box from "3box"

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      phone_number: '',
      authCode: '',
      activeForm: 'login',
      loading: false
    }

    this.renderForm = this.renderForm.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.renderSignUp = this.renderSignUp.bind(this);
    this.renderVerify = this.renderVerify.bind(this);
    this.switchForm = this.switchForm.bind(this);
  }

  onChange = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  componentDidUpdate() {
    console.log('update:')
  }

  isLoading = (load) => {
    this.setState({
      loading: load
    })
  }

  async removePublicStoreProfile() {
    await window.box.public.remove('user.username')
    await window.box.public.remove('user.password')
    await window.box.public.remove('user.email')
    await window.box.public.remove('user.phone_number')
  }

  signUpRequest= () =>{
    const { username, password, email, phone_number } = this.state
    const sdk = new createSdk(availableEnvironments.staging);
    
    const syncComplete = () => {
      console.log('Sync Complete')
      this.getName()
    }
    if (username !== "" && password !== "" && email !== "" && phone_number !== "") {
      console.log('signing up....')
    } else {
        console.log('Incomplete fields')
        return
    }

    this.isLoading(true)
    sdk
      .initialize().then(() => {
        sdk
          .createAccount()
          .then(account => {
            console.log('account:', account);
            sdk
              .getAccountDevices()
              .then(accountDevices => {
                console.log('accountDevices:', accountDevices);
                window.ethereum.enable().then(addresses => {
                  Box.openBox(addresses[0], window.ethereum, {}).then(box => {
                    box.onSyncDone(syncComplete)
                    window.box = box

                    box.public.all().then(profile => {
                        console.log('PROFILE:',profile)
                    })
                  })
                })
              })
              .catch(console.error);
          })
          .catch(console.error);
        })
    .catch(console.error)
  }

  async getName() {
  
    this.removePublicStoreProfile()
    
    const { username, password, email, phone_number } = this.state
    await window.box.public.set('user.username',username)
    await window.box.public.set('user.password',password)
    await window.box.public.set('user.email',email)
    await window.box.public.set('user.phone_number',phone_number)

    const box_username =  await window.box.public.get('user.username')
    const box_password =  await window.box.public.get('user.password')
    const box_email =  await window.box.public.get('user.email')
    const box_phoneNumber =  await window.box.public.get('user.phone_number')
    const box_did =  await window.box.public.get('proof_did')

    console.log('    username:',box_username)
    console.log('    password:',box_password)
    console.log('       email:',box_email)
    console.log('phone_number:',box_phoneNumber)
    console.log('DID:',box_did)
    
    const verifyEmail = {
      did: box_did,
      email_address: box_email
    }

    console.log("Request:",verifyEmail)
    this.isLoading(false)
    this.switchForm('verify')
    // fetch('https://verifications.3box.io/send-email-verification', {
    // method: 'post',
    // body: JSON.stringify(verifyEmail)
    // }).then(function(response) {
    //     return response.json();
    // }).then(function(data) {
    //     console.log('response:', data); // {status:"success"}
    // });
  }

  confirmLogin = () => {
    console.log('confirm login')
    const syncComplete = () => {
        console.log('Sync login Complete')
        this.checkLogin()
    }

    this.isLoading(true)
    window.ethereum.enable().then(addresses => {
      Box.openBox(addresses[0], window.ethereum, {}).then(box => {
          box.onSyncDone(syncComplete)
          window.box = box
          box.public.all().then(profile => {
            console.log('PROFILE:',profile)
          })
      })
    }) 
  }
  
  async checkLogin() {
      const { username, password } = this.state

      if (username !== "" && password !== "") {
          console.log('loging in....')
      } else {
          console.log('Incomplete fields')
          this.isLoading(false)
          return
      }

      const box_username = await window.box.public.get('user.username')
      const box_password = await window.box.public.get('user.password')

      console.log('username:',username,box_username)
      console.log('password:',password,box_password)

      if(username != box_username || password != box_password) {
        console.log('Invalid username/password');
        this.isLoading(false)
        return
      }
      
      this.isLoading(false)
      this.switchForm('main')
  }

  switchForm(activeForm) {
      this.setState({ activeForm: activeForm })
  }

  renderForm() {
    switch (this.state.activeForm) {
      case 'login':
        return this.renderLogin();
        break;
      case 'signup':
        return this.renderSignUp();
        break;
      case 'verify':
        return this.renderVerify();
        break;
      case 'main':
        this.props.history.push('main');
        break;
    }
  }

  renderLogin() {
    return (
      <>
      <Header as='h1' className="header">Login</Header>
      <Form>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Email:</label>
          </div>
          <input className="input" id="login-email" 
            placeholder='Username'
            onChange={evt => this.onChange('username', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Password :</label>
          </div>
          <input className="input" id="login-password" 
            placeholder='Username'
            onChange={evt => this.onChange('password', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container form-btn-container">
            <Button className="form-btn" id="loginContinue" onClick={() => { this.confirmLogin() }}>Continue</Button>
            <div className="underlined" onClick={() => { this.switchForm('signup') }} >
              <label className="pointer">Don't have an account? Sign Up </label>
              <Icon className="pointer form-icon" disabled name='angle right' />
            </div>
          </div>
        </Form.Field>
        <Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={this.state.loading} />
      </Form>
      </>
    )
  }

  renderSignUp() {
    return (
      <>
      <Header as='h1' className="header">Sign Up</Header>
      <Form>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Name:</label>
          </div>
          <input className="input" id="signup-name" 
            placeholder='Username'
            onChange={evt => this.onChange('username', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Email:</label>
          </div>
          <input className="input" id="signup-email" 
          placeholder='Email'
          onChange={evt => this.onChange('email', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Password :</label>
          </div>
          <input className="input" id="signup-password" 
            placeholder='Password'
            type='password'
            onChange={evt => this.onChange('password', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Phone:</label>
          </div>
          <input className="input" id="signup-phone" 
            placeholder='Phone'
            onChange={evt => this.onChange('phone_number', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container form-btn-container">
            <Button className="form-btn" id="loginContinue" onClick={() => { this.signUpRequest() }}>Continue</Button>
            <div className="underlined" onClick={() => { this.switchForm('login') }} >
              <label className="pointer">Already have an account? Login </label>
              <Icon className="pointer form-icon" disabled name='angle right' />
            </div>
          </div>
        </Form.Field>
        <Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={this.state.loading} />
      </Form>
      </>
    )
  }

  renderVerify() {
    return (
      <>
      <Header as='h1' className="header">Check your inbox for your verification code</Header>
      <Form>
        <Form.Field className="form-field">
          <div className="form-label-container">
            <label className="form-label">Access code:</label>
          </div>
          <input className="input" id="verify-code" 
            placeholder='Code'
            onChange={evt => this.onChange('authCode', evt.target.value)}
          />
        </Form.Field>
        <Form.Field className="form-field">
          <div className="form-label-container form-btn-container">
            <Button className="form-btn" id="loginContinue" onClick={() => { this.emailVerify() }}>Continue</Button>
          </div>
        </Form.Field>
      </Form>
      </>
    )
  }

  render() {
    return (
      <div id="login">
        <div className="container">
          {this.renderForm()}
        </div>
      </div>
    );
  }
}
