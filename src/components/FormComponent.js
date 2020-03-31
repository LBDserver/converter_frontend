import React, { Component } from 'react'
import {
    Form,
    Row,
    Col,
    Button
} from 'react-bootstrap'

const axios = require('axios')

export default class FormComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conversions: {
                LBD: { checked: false, fields: { baseUri: '', fileName: '' } },
                ifcOWL: { checked: false },
                GLTF: { checked: false },
                DAE: { checked: false },
                XML: { checked: false }
            },
            checked: [],
            email: "jeroen.werbrouck@hotmail.com"
        }
    }

    addToConversionList = (e) => {
        let { conversions, checked } = this.state
        conversions[e.target.id]["checked"] = !conversions[e.target.id]["checked"]
        if (conversions[e.target.id]["checked"]) {
            checked.push(e.target.id)
        } else {
            checked = checked.filter((v, i, a) => {
                return v !== e.target.id
            })
        }

        this.setState({ conversions, checked })
    }

    setFile = (e) => {
        e.preventDefault()
        this.setState({ files: e.target.files[0] })
    }

    setExtension = (c) => {
        switch(c) {
            case("LBD"):
            case("ifcOWL"):
                return('.ttl');
            case("GLTF"):
                return('.gltf');
            case("DAE"):
                return('.dae');
            case("XML"):
                return('.xml');
            default:
                break;
        }
    }

    submitForm = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("ifcFile", this.state.files, this.state.files.name)

        for (const conv of this.state.checked) {
            axios.post(`http://localhost:4800/IFCto${conv === 'ifcOWL' ? 'OWL' : conv}`, formData)
                .then((res) => {
                    return res.data
                })
                .then((blob) => {
                    console.log(typeof blob)
                    if (typeof blob == 'object') {
                        blob = JSON.stringify(blob)
                        console.log(blob)
                    }
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `conversion${this.setExtension(conv)}`);

                    link.click()
                })
                .catch((error) => console.log('error', error))
        }

    }

    onChange = (e) => {
        this.setState({ email: e.target.value })
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.submitForm}>
                    <Form.Group as={Row} controlId="formName">
                        <Form.Label column sm="2">E-mail</Form.Label>
                        <Col sm="10">
                            <Form.Control type="email" name="email" defaultValue={this.state.email} placeholder="Email address" onChange={this.onChange} />
                            <Form.Text className="text-muted">
                                Your email will not be cached by LBDserver and will be removed after the conversion has taken place.
                        </Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formFile">
                        <Form.Label column sm="2">IFC File</Form.Label>
                        <br />
                        <Col sm="10">
                            <input
                                type="file"
                                name="file"
                                accept=".ifc"
                                onChange={this.setFile}
                                style={{ marginTop: 8 }}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="conversions">
                        <Form.Label column sm="2">Conversions</Form.Label>
                        <br />
                        <Col sm="10">
                            {Object.keys(this.state.conversions).map((type) => (
                                <Form.Check
                                    onChange={this.addToConversionList}
                                    checked={this.state.conversions[type]["checked"]}
                                    inline
                                    key={type}
                                    label={type}
                                    type="checkbox"
                                    id={type}

                                    style={{ marginTop: 7 }}
                                />
                            ))}
                        </Col>
                    </Form.Group>
                    <hr />
                    {/* {options} */}

                    <Button variant="primary" type="submit" disabled={this.state.files && this.state.email && this.state.checked.length > 0 ? false : true}>
                        Start conversion
                    </Button>
                </Form>
            </div>
        )
    }
}
