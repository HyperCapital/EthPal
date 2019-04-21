import React, { Component } from "react";
import { Button, Form, Label } from "semantic-ui-react";

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: 'main'
        }
        this.switchView = this.switchView.bind(this);
        this.renderMain = this.renderMain.bind(this);
    }

    switchView(activeView) {
        this.setState({ activeView: activeView });
    }

    renderView() {
        switch (this.state.activeView) {
            case 'main':
                return this.renderMain();
                break;
            case 'send':
                return this.renderSend();
                break;
        }
    }

    renderSend() {
        return (
            <>
            <div className="send-container">
                <Form>
                    <Form.Field className="form-field">
                        <div className="form-label-container">
                            <label className="form-label">Email:</label>
                        </div>
                        <input className="input" id="send-email" />
                    </Form.Field>
                    <Form.Field className="form-field">
                        <div className="form-label-container">
                            <label className="form-label">Amount:</label>
                        </div>
                        <input className="input" id="send-amount" />
                    </Form.Field>
                    <div className="send-btn-container">
                        <Form.Field className="form-field">
                            <div className="form-label-container form-btn-container">
                                <Button className="form-btn" id="send-send" onClick={() => { this.switchView('main') }}>Send</Button>
                            </div>
                        </Form.Field>
                    </div>
                </Form>
            </div>
            </>
        )
    }

    renderMain() {
        return (
            <>
            <div className="btn-container">
                <Form.Field className="form-field">
                    <div className="form-label-container form-btn-container">
                        <Button className="form-btn huge-btn" id="main-buy" onClick={() => { this.switchView('main') }}>Buy</Button>
                    </div>
                </Form.Field>
                <Form.Field className="form-field hide-mobile">
                    <div className="form-label-container form-btn-container">
                        <Button className="form-btn huge-btn" id="main-send" onClick={() => { this.switchView('send') }}>Send</Button>
                    </div>
                </Form.Field>
            </div>
            <div className="btn-container show-mobile">
                <Form.Field className="form-field">
                    <div className="form-label-container form-btn-container">
                        <Button className="form-btn huge-btn" id="main-send" onClick={() => { this.switchView('send') }}>Send</Button>
                    </div>
                </Form.Field>
            </div>
            <div className="btn-container">
                <Form.Field className="form-field">
                    <div className="form-label-container form-btn-container">
                        <Button className="form-btn huge-btn" id="main-cashout" onClick={() => { this.switchView('main') }}>Cash out</Button>
                    </div>
                </Form.Field>
            </div>
            </>
        )
    }
    render() {
        return (
            <div id="main">
                <div className="container">
                    <div className="black-container">
                        <span className="user-text">user</span>
                        <span className="user-text header"> 0 ETH</span>
                    </div>
                    {this.renderView()}
                </div>
            </div>
        );
    }
}
